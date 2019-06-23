import expect from 'expect.js';
import filter from 'lodash.filter';
import CPU from '../cpu.js';
import Memory from '../memory.js';
import OPCODE from '../../../const/opcode.js';
import rom from '../../../roms/flappyboy.json';
import { random8bit } from './utils.js';


describe('CPU can run OPCODES:', () => {
  let cpu, opcodeList, memory;

  beforeEach(() => {
    memory = new Memory(rom);
    cpu = new CPU({
      memory,
    });
  });

  describe('ADD:', () => {
    // Test LD opcodes that load from the next byte into a register.
    opcodeList = filter(OPCODE, { mnemonic: 'ADD', length: 1 });
    // temp limit to single register
    opcodeList = filter(opcodeList, ({ operand1, operand2 }) => operand1.length === 1 && operand2.length === 1);


    opcodeList.forEach(function(opcode) {
      const { addr, mnemonic, operand1, operand2 } = opcode;
      const register = operand1.toLowerCase();
      const register2 = operand2.toLowerCase();

      it(`${mnemonic} ${operand1}, ${operand2}; Adds register ${register2} to register ${register} [${addr}]`, () => {
        // Set values we want to add together
        cpu[register2] = 0x1;
        cpu[register] = 0x2;
        cpu.processOpcode(parseInt(addr, 16));

        if (register === register2) {
          expect(cpu[register]).to.eql(0x4);
        }
        else {
          expect(cpu[register]).to.eql(0x3);
        }
      });

      it(`${mnemonic} ${operand1}, ${operand2}; Clears the Add/Subtract Flag n [${addr}]`, () => {
        // Set values we want to add together
        cpu[register2] = 0x1;
        cpu[register] = 0x2;
        cpu.processOpcode(parseInt(addr, 16));

        expect(cpu.f & 0b10).to.eql(0);
      });
    });

    it('ADD A, 0x33; Adds register a to register a [0xc6]', () => {
      cpu.a = 0x23;
      cpu.processOpcode(0xc6);
      cpu.processOpcode(0x33);

      expect(cpu.a).to.eql(0x56);
    });

    it('ADD 255, 255; Sets the carry flag', () => {
      const opcodes = [
        0x3e, 0xff, // LD  a, 255 (62, 255)
        0x87, // ADD a, a (135)
      ];

      // run the opcodes
      opcodes.forEach(function(opcode) {
        cpu.processOpcode(opcode);
      });
      expect(cpu.f & 0b0001).to.eql(0b0001);
    });

    it('ADD 10, 11; Unsets the carry flag', () => {
      const opcodes = [
        0x3e, 0x0a, // LD  a, 10
        0x6, 0x0b, // LD  b, 11
        0x80, // ADD a, b
      ];

      // run the opcodes
      opcodes.forEach(function(opcode) {
        cpu.processOpcode(opcode);
      });

      // z80 spec: "C is set if carry from bit 7; otherwise, it is reset."
      expect(cpu.f | 0b0001).to.eql(0);
    });
  }); // ADD

  describe('SUB:', () => {
    // Test LD opcodes that load from the next byte into a register.
    opcodeList = filter(OPCODE, { mnemonic: 'SUB', length: 1 });
    // temp limit to single register
    opcodeList = filter(opcodeList, ({ operand1 }) => operand1.length === 1);

    opcodeList.forEach(function(opcode) {
      const { addr, mnemonic, operand1 } = opcode;
      const register = operand1.toLowerCase();

      it(`${mnemonic} A, ${operand1}; Subtracts register ${register} from register a [${addr}]`, () => {
        cpu.a = 0x29;
        cpu[register] = 0x11;
        cpu.processOpcode(parseInt(addr, 16));

        // a - a = 0
        if (register === 'a') {
          expect(cpu.a).to.eql(0);
        }
        else {
          expect(cpu.a).to.eql(0x18);
        }
      });

      // Subtract Flag (N):
      // This bit is set if a subtraction was performed in the last math instruction.
      it(`${mnemonic} A, ${operand1}; Sets the Subtract Flag N [${addr}]`, () => {
        cpu.a = 0x29;
        cpu[register] = 0x11;
        cpu.processOpcode(parseInt(addr, 16));

        expect(cpu.f & 0b100).to.eql(0b100);
      });
    }); // end forEach opcode
  }); // SUB

  describe('JUMP:', () => {
    it('[0xC3] to address', () => {
      cpu.processOpcode(0xc3); // JUMP opcode
      cpu.processOpcode(0x22); // address one
      cpu.processOpcode(0xaa); // address two
      expect(cpu.pc).to.eql(0xaa22);
    });
  }); // JUMP:

  describe('INC', () => {
    let randomValue;

    beforeEach(() => {
      randomValue = random8bit();
    });

    opcodeList = filter(OPCODE, { mnemonic: 'INC' });
    opcodeList.forEach(function(opcode) {
      const { addr, operand1 } = opcode;
      const register = operand1.toLowerCase();
      const byte = parseInt(addr, 16);

      it(`[${addr}] INC ${operand1}; Increments the value at ${register}`, () => {
        if (register === '(hl)') {
          cpu.hl = 0x0010;
          memory.writeROM(cpu.hl, randomValue);
          cpu.processOpcode(byte);
          expect(memory.readROM(cpu.hl)).to.eql(randomValue + 1);
        }
        else {
          // Set values we want to add together
          cpu[register] = randomValue;
          cpu.processOpcode(byte);
          expect(cpu[register]).to.eql(randomValue + 1);
        }
      });
    });
  }); // INC

  describe('DEC', () => {
    let randomValue;

    beforeEach(() => {
      randomValue = random8bit();
    });

    opcodeList = filter(OPCODE, { mnemonic: 'DEC' });
    opcodeList.forEach(function(opcode) {
      const { addr, operand1 } = opcode;
      const register = operand1.toLowerCase();
      const byte = parseInt(addr, 16);

      it(`[${addr}] DEC ${operand1}; Decrement the value at ${register}`, () => {
        if (register === '(hl)') {
          cpu.hl = 0x0010;
          memory.writeROM(cpu.hl, randomValue);
          cpu.processOpcode(byte);
          expect(memory.readROM(cpu.hl)).to.eql(randomValue - 1);
        }
        else {
          cpu[register] = randomValue;
          cpu.processOpcode(byte);
          expect(cpu[register]).to.eql(randomValue - 1);
        }
      });
    });
  }); // INC

  describe('ADC', () => {
    let randomValue;

    beforeEach(() => {
      randomValue = random8bit();
    });

    // Loop over all the Add with Carry opcodes
    opcodeList = filter(OPCODE, { mnemonic: 'ADC' });
    opcodeList.forEach(function(opcode) {
      const { addr, operand2 } = opcode;
      const register = operand2.toLowerCase();
      const byte = parseInt(addr, 16);

      it(`ADC a, ${register}; Opcode [${addr}] Adds ${register} to register A.`, () => {
        cpu.a = 0x50;

        // d8 means a random 8bit number
        if (register === 'd8') {
          cpu.processOpcode(byte); // Run the opcode
          cpu.processOpcode(randomValue);
        }
        // (hl) is a special register
        else if (register === '(hl)') {
          cpu.hl = 0x0001;
          memory.writeROM(cpu.hl, randomValue);
          cpu.processOpcode(byte); // Run the opcode
        }
        // Since a is the dest, we don't want to overwrite it when it's also the source.
        else if (register === 'a') {
          cpu.processOpcode(byte); // Run the opcode
        }
        else {
          cpu[register] = randomValue;
          cpu.processOpcode(byte); // Run the opcode
        }

        if (register !== 'a') {
          // JS will happly overflow, but we don't want that for the test.
          // use `& 0xFF` to keep it 8bits.
          expect(cpu.a).to.eql((0x50 + randomValue) & 0xff);
        } else {
          // Since a is the dest, we don't want to overwrite it when it's also the source.
          expect(cpu.a).to.eql(0xA0);
        }
      });
    }); // forEach opcode

    it('it sets the carry flag', () => {
      const opcodes = [
        0x3e, 0xfe, // LD a 0xFE
        0xce, 0x02, // ADC a 0x02
      ];

      // run the opcodes
      opcodes.forEach(function(opcode) {
        cpu.processOpcode(opcode);
      });
      expect(cpu.f & 0b0001).to.eql(0b0001);
    });

    it('it resets the carry flag', () => {
      const opcodes = [
        0x3e, 0xfe, // LD  a, 255 (62, 255)
        0xce, // ADC a, d8
        0x01, // value that will not carry when added to A
      ];

      // run the opcodes
      opcodes.forEach(function(opcode) {
        cpu.processOpcode(opcode);
      });
      expect(cpu.f & 0b0001).to.eql(0);
    });


    it('it sets the half carry flag', () => {
      const opcodes = [
        0x3e, 0x0e, // LD  a 0x0e
        0xce, 0x02, // ADC a 0x02
      ];

      // run the opcodes
      opcodes.forEach(function(opcode) {
        cpu.processOpcode(opcode);
      });
      expect(cpu.f & 0b0010).to.eql(0b0010);
    });

    it('it resets the half carry flag', () => {
      const opcodes = [
        0x3e, 0x0e, // LD  a, 255 (62, 255)
        0xce, // ADC a, d8
        0x01, // value that will not carry when added to A
      ];

      // run the opcodes
      opcodes.forEach(function(opcode) {
        cpu.processOpcode(opcode);
      });
      expect(cpu.f & 0b0010).to.eql(0);
    });
  });
});
