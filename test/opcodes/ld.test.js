import expect from 'expect.js';
import filter from 'lodash.filter';
import CPU from '../../src/cpu.js';
import OPCODE from '../../const/opcode.js';
import { addTestData, random8bit, random16bit } from '../utils.js';


describe('OPCODE: LD', () => {
  let cpu, opcodes;

  beforeEach(() => {
    // create a new blank CPU for each test.
    cpu = new CPU();
  });


  describe('loads 8-bit value into 8-bit register.', () => {
    opcodes = filter(OPCODE, {mnemonic: 'LD', length: 2, operand2: 'd8'});
    // limit to opcodes that work with 8-bit registers
    opcodes = filter(opcodes, ({operand1}) => operand1.length === 1 );
    // make the data eaiser to work with.
    opcodes = opcodes.map(addTestData);

    // Create a test for each opcode
    opcodes.forEach(function(opcode) {
      const randomByte = random8bit();
      const {mnemonic, register1, operand1, addr, byte} = opcode;

      it(`${mnemonic} ${operand1}, 0x${randomByte.toString(16)}; load into register ${register1} [${addr}]`, () => {
        cpu.processOpcode(byte); // LD Opcode
        cpu.processOpcode(randomByte); // random 8-bit value
        expect(cpu[register1]).to.eql(randomByte);
      });
    });
  }); // loads 8-bit value into 8-bit register

  describe('copies value from one register into another register.', () => {
    opcodes = filter(OPCODE, {mnemonic: 'LD', length: 1});
    // limit to opcodes that work with 8-bit registers
    opcodes = filter(opcodes, ({operand1, operand2}) => operand1.length === 1 && operand2.length === 1);
    // make the data eaiser to work with.
    opcodes = opcodes.map(addTestData);

    // Create a test for each opcode
    opcodes.forEach(function(opcode) {
      const {mnemonic, register1, register2, addr, byte} = opcode;
      it(`${mnemonic}; replaces value at cpu.${register1} with value at cpu.${register2}  [${addr}]`, () => {
        const randomByte1 = random8bit();
        const randomByte2 = random8bit();
        // set old data in register1 so we can tell if it changed
        cpu[register1] = randomByte1;
        // set the new data in register2
        cpu[register2] = randomByte2;
        // run the opcode
        cpu.processOpcode(byte);
        // check that register1 now has the value from register2
        expect(cpu[register1]).to.eql(randomByte2);
      });
    });
  }); // copies value from one register into another register.


  describe('loads 16-bit value into 16-bit register', () => {
    opcodes = filter(OPCODE, {mnemonic: 'LD', length: 3, operand2: 'd16'});
    // limit to opcodes that work with basic 16-bit registers
    opcodes = filter(opcodes, ({operand1}) => operand1.length === 2 );
    // make the data eaiser to work with.
    opcodes = opcodes.map(addTestData);

    // Create a test for each opcode
    opcodes.forEach(function(opcode) {
      const randomByte = random16bit();
      const {mnemonic, register1, operand1, addr, byte} = opcode;

      it(`${mnemonic} ${operand1}, 0x${randomByte.toString(16)}; load into register ${register1}  [${addr}]`, () => {
        cpu.processOpcode(byte); // LD Opcode
        cpu.processOpcode(randomByte >> 8);   // Split the 16-bit into two 8-bits
        cpu.processOpcode(randomByte & 0xff); 
        expect(cpu[register1]).to.eql(randomByte);
      });
    });


    it('LD SP, HL; loads value at cpu.hl into cpu.sp [0xf9]', () => {
      const randomByte = random16bit();
      cpu.hl = randomByte;
      cpu.sp = 0;
      cpu.processOpcode(0xf9);
      expect(cpu.sp).to.eql(randomByte);
    });
  }); // loads 8-bit value into 8-bit register


}); // OPCODE: LD
