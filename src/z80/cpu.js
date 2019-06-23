/**
 * Virtual CPU for the Gameboy Color; a modified z80
 */
import { OPCODE } from '../../const/opcode.js';
class CPU {
  constructor({ memory }) {
    // Create the memory banks
    this.memory8bit = new Uint8Array(18);
    this.memory16bit = new Uint16Array(6);

    this.memory = memory;

    this.opcodeBuffer = [];
    this.a = 0x01;
    this.f = 0xb0;

    /*
    /* fullCarry: 0b0001
    /* halfCarry: 0b0010
    /* subtract: 0b0100
    /* zero: 0b1000
     */

    this.masks = {
      full: 0b0001,
      half: 0b0010,
      sub: 0b0100,
      zero: 0b1000,
    };
  }

  adc(opcode, byte1) {
    const meta = OPCODE[opcode];
    const source = meta.operand2.toLowerCase();
    let value;

    switch (source) {
      case 'd8':
        value = this.a + byte1;
        break;
      case '(hl)':
        value = this.a + this.memory.readROM(this.hl);
        break;
      default:
        value = this.a + this[source];
    }

    // Add the carry value
    value += this.f & 0b0001;

    // Update the flags
    // Carry
    if (value > 0xFF) {
      this.f = this.f | 0b0001;
    }
    // Half-Carry
    if (value > 0x0F) {
      this.f = this.f | 0b0010;
    }

    this.a = value;
  }

  add(opcode, byte1) {
    const meta = OPCODE[opcode];
    const dest = meta.operand1.toLowerCase();
    const source = meta.operand2.toLowerCase();
    let value;

    // Add the numbers
    switch (source) {
      case 'd8':
        value = this[dest] + byte1;
        break;
      default:
        value = this[dest] + this[source];
    }
    // Check for Carry
    if (value > 0xFF) {
      this.f = this.f | 0b0001;
    }
    else {
      // Reset Carry
      this.f = this.f & 0b0001;
    }

    this[dest] = value;
  }

  sub(opcode) {
    const meta = OPCODE[opcode];
    const source = meta.operand1.toLowerCase();
    const value = this[source];

    this.a -= value;
    // Set the subtract flag, cus we are subtraction 😝
    this.f = this.f | 0b100;
  }

  // Loads bytes into CPU registers
  ld(opcode, byte1, byte2) {
    const meta = OPCODE[opcode];
    const dest = meta.operand1.toLowerCase();
    const source = meta.operand2.toLowerCase();
    let value;

    // use the source to get the new value.
    switch (source) {
      case 'd8':
        value = byte1;
        break;
      case 'd16':
        value = (byte1 << 8) | byte2;
        break;
      case '(hl)':
        value = this.memory.readROM(this.hl);
        break;
      default:
        value = this[source];
        break;
    }

    // Update the dest with the new value.
    this[dest] = value;
  }

  // -1 a register or memory value
  dec(opcode) {
    const meta = OPCODE[opcode];
    const dest = meta.operand1.toLowerCase();

    // HL means change the value in memory
    if (dest === '(hl)') {
      let value = this.memory.readROM(this.hl);
      value -= 1;
      this.memory.writeROM(this.hl, value);
    }
    // change in register
    else {
      this[dest] -= 1;
    }
  }

  // +1 a register or memory values
  inc(opcode) {
    const meta = OPCODE[opcode];
    const dest = meta.operand1.toLowerCase();

    // HL means change the value in memory
    if (dest === '(hl)') {
      let value = this.memory.readROM(this.hl);
      value += 1;
      this.memory.writeROM(this.hl, value);
    }
    // change in register
    else {
      this[dest] += 1;
    }
  }

  // Pushes the value at af into the stack and decrements the stackpointer.
  push() {
    const address1 = this.sp - 1;
    const address2 = this.sp - 2;

    this.memory.writeROM(address1, this.a);
    this.memory.writeROM(address2, this.f);
    this.sp -= 2;
  }

  pop() {
    const address1 = this.sp + 0;
    const address2 = this.sp + 1;

    this.h = this.memory.readROM(address2);
    this.l = this.memory.readROM(address1);
    this.sp += 2;
  }

  nop() {
    // no operation, aka do nothing.
  }

  // This instruction disables interrupts but not immediately. Interrupts are disabled after instruction after DI is executed.
  di() {
    console.log('di', this.toHex(arguments[0]));
    debugger;
  }

  // Logical exclusive OR with register A, result in A.
  // example from z80 doc: If the Accumulator contains 96h (1001 0110), then upon the execution of an XOR 5Dh (5Dh = 0101 1101) instruction, the Accumulator contains CBh (1100 1011).
  xor(opcode) {
    console.log('xor', this.toHex(opcode), this.toHex(arguments[0]));
    this.a = this.a ^ this.a;
  }

  // Add n to current address and jump to it
  jr(opcode) {
    console.log('jr', this.toHex(opcode), this.toHex(arguments[0]));
  }

  /**
   * Performs a JUMP operation by combining two 8bit bytes into a new 16bit address.
   * Sets cpu.pc
   * @param  {8Bit} byte1
   * @param  {8Bit} byte2
   * @return {16Bit} new value of cpu.pc
   */
  jump(opcode, byte1, byte2) {
    this.pc = (byte2 << 8) | byte1;
  }

  tick() {
    const data = this.memory.readROM(this.pc);
    debugger;
    // const { opcodeBuffer } = this;
    const meta = OPCODE[data];
    const { length } = meta;

    console.log('META:', meta);

    // this.processOpcode(opcodeBuffer[0])

    this.processOpcode(data);

    for (let i = 1; i <= length; i++) {
      this.pc += 1;
      console.log('++BUFFER', this.toHex(this.pc), this.opcodeBuffer);
      this.processOpcode(this.memory.readROM(this.pc + i));
    }
    debugger;
    // if (opcodeBuffer.length >= length || opcodeBuffer.length === 0) {
    //   this.processOpcode(data);
    //   this.pc += 1;
    // }
    // } else {
    //   this.tick();
    // }
    // console.log(':::', this.pc, ':::');
    // JUMP
    // if (data === 0xc3) {
    //   for (let i = 1; i < opcode.length; i++) {
    //     this.processOpcode(this.memory.readROM(this.pc + i));
    //   }
    //   return;
    // }
    // console.log('PC:::', this.toHex(this.pc));
    this.pc += 1;
    console.log('PC:::AFTER', this.toHex(`0x${this.pc}`), this.toHex(`0x${this.opcodeBuffer}`));
  }

  toHex(val) {
    return `0x${(val).toString(16)}`;
  }


  processOpcode(opcode) {
    const { opcodeBuffer } = this;
    // Add the new byte to the buffer.
    opcodeBuffer.push(opcode);

    // The first byte is the opcode, the rest is data.
    // So when we get the opcode metadata, get it from the frist byte.
    const meta = OPCODE[opcodeBuffer[0]];
    const { length } = meta;
    const mnemonic = meta.mnemonic.toLowerCase();

    // Hold bytes in the buffer until we have all the bytes for the call.
    if (opcodeBuffer.length < length) {
      return;
    }
    // console.log('processOpcode', mnemonic, length, opcodeBuffer);
    // Call the opcode function with data.
    try {
      console.log('Mnemonic:', this.opcodeBuffer)
      this[mnemonic].apply(this, opcodeBuffer);
    }
    catch (error) {
      throw new Error(`Unsupported Opcode: "${mnemonic}"`);
    }
    console.log('OPCODE BUFFER::', opcodeBuffer);
    // Clear the buffer for the next call.
    this.opcodeBuffer = [];
  }

  // 8 Bit regsiters
  get a() {
    return this.memory8bit[0];
  }
  set a(value) {
    this.memory8bit[0] = value;
  }

  get b() {
    return this.memory8bit[1];
  }
  set b(value) {
    this.memory8bit[1] = value;
  }

  get c() {
    return this.memory8bit[2];
  }
  set c(value) {
    this.memory8bit[2] = value;
  }

  get d() {
    return this.memory8bit[3];
  }
  set d(value) {
    this.memory8bit[3] = value;
  }

  get e() {
    return this.memory8bit[4];
  }
  set e(value) {
    this.memory8bit[4] = value;
  }

  get f() {
    return this.memory8bit[5];
  }
  set f(value) {
    this.memory8bit[5] = value;
  }

  get l() {
    return this.memory8bit[6];
  }
  set l(value) {
    this.memory8bit[6] = value;
  }

  get h() {
    return this.memory8bit[7];
  }
  set h(value) {
    this.memory8bit[7] = value;
  }

  // combined 16 bit registers
  // combining 2 8 bit registers to hold 16 bits
  get af() {
    const bitA = this.a;
    const bitF = this.f;
    return (bitA << 8) | bitF;
  }
  set af(value) {
    const bitA = (value >> 8) & 0xff;
    const bitF = value & 0xff;
    this.a = bitA;
    this.f = bitF;
  }

  get bc() {
    const bitB = this.b;
    const bitC = this.c;
    return (bitB << 8) | bitC || 0x0013;
  }
  set bc(value) {
    const bitB = (value >> 8) & 0xff;
    const bitC = value & 0xff;
    this.b = bitB;
    this.c = bitC;
  }

  get de() {
    const bitD = this.d;
    const bitE = this.e;
    return (bitD << 8) | bitE || 0x00d8;
  }
  set de(value) {
    const bitD = (value >> 8) & 0xff;
    const bitE = value & 0xff;
    this.d = bitD;
    this.e = bitE;
  }

  get hl() {
    const bitH = this.h;
    const bitL = this.l;
    return (bitH << 8) | bitL || 0x014d;
  }
  set hl(value) {
    const bitH = (value >> 8) & 0xff;
    const bitL = value & 0xff;
    this.h = bitH;
    this.l = bitL;
  }

  // Alternate register
  get altA() {
    return this.memory8bit[8];
  }

  set altA(value) {
    this.memory8bit[8] = value;
  }

  get altB() {
    return this.memory8bit[9];
  }

  set altB(value) {
    this.memory8bit[9] = value;
  }

  get altD() {
    return this.memory8bit[10];
  }

  set altD(value) {
    this.memory8bit[10] = value;
  }

  get altH() {
    return this.memory8bit[11];
  }

  set altH(value) {
    this.memory8bit[11] = value;
  }

  get altF() {
    return this.memory8bit[12];
  }

  set altF(value) {
    this.memory8bit[12] = value;
  }

  get altC() {
    return this.memory8bit[13];
  }

  set altC(value) {
    this.memory8bit[13] = value;
  }

  get altE() {
    return this.memory8bit[14];
  }

  set altE(value) {
    this.memory8bit[14] = value;
  }

  get altL() {
    return this.memory8bit[15];
  }

  set altL(value) {
    this.memory8bit[15] = value;
  }

  get i() {
    return this.memory16bit[0];
  }

  set i(value) {
    this.memory16bit[0] = value;
  }

  get r() {
    return this.memory16bit[1];
  }

  set r(value) {
    this.memory16bit[1] = value;
  }

  get ix() {
    return this.memory16bit[2];
  }

  set ix(value) {
    this.memory16bit[2] = value;
  }

  get iy() {
    return this.memory16bit[3];
  }

  set iy(value) {
    this.memory16bit[3] = value;
  }

  // Stack pointer, 16 bits
  get sp() {
    return this.memory16bit[4] || 0xFFFE;
  }

  set sp(value) {
    this.memory16bit[4] = value;
  }

  get pc() {
    return this.memory16bit[5] || 0x0100;
  }

  set pc(value) {
    this.memory16bit[5] = value;
  }
}

export default CPU;
