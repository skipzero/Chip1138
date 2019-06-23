import expect from 'expect.js';
import CPU from '../cpu.js';
import { random8bit } from './utils.js';
import Memory from '../memory.js';
import rom from '../../../roms/flappyboy.json';


describe('CPU', () => {
  let cpu, memory;

  beforeEach(() => {
    // create a new blank CPU for each test.
    memory = new Memory(rom);
    cpu = new CPU({
      memory,
    });
  });

  describe('main registers', () => {
    it('cpu.a defaults to 0x01', () => {
      expect(cpu.a).to.eql(0x01);
    });
    it('a is 8-bit', () => {
      cpu.a = 0xfff; // 4095 should overflow on 8-bit
      expect(cpu.a).to.eql(0xff); // largest 8-bit number
    });

    it('b is 8-bit', () => {
      cpu.b = 0xfff; // 4095 should overflow on 8-bit
      expect(cpu.b).to.eql(0xff); // largest 8-bit number
    });

    it('d is 8-bit', () => {
      cpu.d = 0xfff; // 4095 should overflow on 8-bit
      expect(cpu.d).to.eql(0xff); // largest 8-bit number
    });

    it('h is 8-bit', () => {
      cpu.h = 0xfff; // 4095 should overflow on 8-bit
      expect(cpu.h).to.eql(0xff); // largest 8-bit number
    });


    it('cpu.f defaults to 0xB0', () => {
      expect(cpu.f).to.eql(0xB0);
    });
    it('f is 8-bit', () => {
      cpu.f = 0xfff; // 4095 should overflow on 8-bit
      expect(cpu.f).to.eql(0xff); // largest 8-bit number
    });

    it('c is 8-bit', () => {
      cpu.c = 0xfff; // 4095 should overflow on 8-bit
      expect(cpu.c).to.eql(0xff); // largest 8-bit number
    });

    it('e is 8-bit', () => {
      cpu.e = 0xfff; // 4095 should overflow on 8-bit
      expect(cpu.e).to.eql(0xff); // largest 8-bit number
    });

    it('l is 8-bit', () => {
      cpu.l = 0xfff; // 4095 should overflow on 8-bit
      expect(cpu.l).to.eql(0xff); // largest 8-bit number
    });
  }); // main registers

  describe('alternate registers', () => {
    it('altA is 8-bit', () => {
      cpu.altA = 0xfff; // 4095 should overflow on 8-bit
      expect(cpu.altA).to.eql(0xff); // largest 8-bit number
    });

    it('altB is 8-bit', () => {
      cpu.altB = 0xfff; // 4095 should overflow on 8-bit
      expect(cpu.altB).to.eql(0xff); // largest 8-bit number
    });

    it('altD is 8-bit', () => {
      cpu.altD = 0xfff; // 4095 should overflow on 8-bit
      expect(cpu.altD).to.eql(0xff); // largest 8-bit number
    });

    it('altH is 8-bit', () => {
      cpu.altH = 0xfff; // 4095 should overflow on 8-bit
      expect(cpu.altH).to.eql(0xff); // largest 8-bit number
    });

    it('altF is 8-bit', () => {
      cpu.altF = 0xfff; // 4095 should overflow on 8-bit
      expect(cpu.altF).to.eql(0xff); // largest 8-bit number
    });

    it('altC is 8-bit', () => {
      cpu.altC = 0xfff; // 4095 should overflow on 8-bit
      expect(cpu.altC).to.eql(0xff); // largest 8-bit number
    });

    it('altE is 8-bit', () => {
      cpu.altE = 0xfff; // 4095 should overflow on 8-bit
      expect(cpu.altE).to.eql(0xff); // largest 8-bit number
    });

    it('altL is 8-bit', () => {
      cpu.altL = 0xfff; // 4095 should overflow on 8-bit
      expect(cpu.altL).to.eql(0xff); // largest 8-bit number
    });
  }); // alternate registers

  describe('combined registers', () => {
    let byte1, byte2;

    beforeEach(() => {
      byte1 = random8bit();
      byte2 = random8bit();
    });

    it('read af [16-bit]', () => {
      cpu.a = byte1;
      cpu.f = byte2;
      expect(cpu.af).to.eql((byte1 << 8) | byte2);
    });
    it('write af [16-bit]', () => {
      cpu.af = (byte1 << 8) | byte2;
      expect(cpu.a).to.eql(byte1);
      expect(cpu.f).to.eql(byte2);
    });


    it('cpu.bc defaults to 0x0013', () => {
      expect(cpu.bc).to.eql(0x0013);
    });
    it('read bc [16-bit]', () => {
      cpu.b = byte1;
      cpu.c = byte2;
      expect(cpu.bc).to.eql((byte1 << 8) | byte2);
    });
    it('write bc [16-bit]', () => {
      cpu.bc = (byte1 << 8) | byte2;
      expect(cpu.b).to.eql(byte1);
      expect(cpu.c).to.eql(byte2);
    });

    it('cpu.de defaults to 0x00D8', () => {
      expect(cpu.de).to.eql(0x00D8);
    });
    it('read de [16-bit]', () => {
      cpu.d = byte1;
      cpu.e = byte2;
      expect(cpu.de).to.eql((byte1 << 8) | byte2);
    });
    it('write de [16-bit]', () => {
      cpu.de = (byte1 << 8) | byte2;
      expect(cpu.d).to.eql(byte1);
      expect(cpu.e).to.eql(byte2);
    });

    it('cpu.hl defaults to 0x014D', () => {
      expect(cpu.hl).to.eql(0x014d);
    });
    it('read hl [16-bit]', () => {
      cpu.h = byte1;
      cpu.l = byte2;
      expect(cpu.hl).to.eql((byte1 << 8) | byte2);
    });
    it('write hl [16-bit]', () => {
      cpu.hl = (byte1 << 8) | byte2;
      expect(cpu.h).to.eql(byte1);
      expect(cpu.l).to.eql(byte2);
    });
  }); // combined registers

  describe('special registers', () => {
    it('i is 16-bit', () => {
      cpu.i = 0xfffff; // 1048575 should overflow on 16-bit
      expect(cpu.i).to.eql(0xffff); // largest 16-bit number
    });

    it('r is 16-bit', () => {
      cpu.r = 0xfffff; // 1048575 should overflow on 16-bit
      expect(cpu.r).to.eql(0xffff); // largest 16-bit number
    });

    it('ix is 16-bit', () => {
      cpu.ix = 0xfffff; // 1048575 should overflow on 16-bit
      expect(cpu.ix).to.eql(0xffff); // largest 16-bit number
    });

    it('iy is 16-bit', () => {
      cpu.iy = 0xfffff; // 1048575 should overflow on 16-bit
      expect(cpu.iy).to.eql(0xffff); // largest 16-bit number
    });

    /*
      The SP, or Stack Pointer, register points to the current stack position.
     */
    it('sp is 16-bit', () => {
      cpu.sp = 0xfffff; // 1048575 should overflow on 16-bit
      expect(cpu.sp).to.eql(0xffff); // largest 16-bit number
    });

    it('sp defaults to 0xFFFE', () => {
      expect(cpu.sp).to.eql(0xfffe); // largest 16-bit number
    });

    /*
      The PC, or Program Counter, register points to the next instruction to be executed in the Game Boy memory.
     */
    it('pc is 16-bit', () => {
      cpu.pc = 0xfffff; // 1048575 should overflow on 16-bit
      expect(cpu.pc).to.eql(0xffff); // largest 16-bit number
    });

    it('pc defaults to 0x0100', () => {
      expect(cpu.pc).to.eql(0x0100); // default in the docs
    });
  }); // special registers
});
