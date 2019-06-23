import expect from 'expect.js';
import CPU from '../cpu.js';
import Memory from '../memory.js';
import rom from '../../../roms/flappyboy.json';
import { pcRuntimeValues } from './utils/pcRuntimeValues.js';

describe('clock', () => {
  let cpu, memory;

  beforeEach(() => {
    memory = new Memory(rom);
    cpu = new CPU({
      memory,
    });
  });

  describe.only('tick()', () => {
    it('first tick() that does nothing but increment pc.', () => {
      console.log('\none tick() before, cpu.pc', `0x${cpu.pc.toString(16)}`, 'data at pc', `0x${memory.readROM(cpu.pc).toString(16)}`);
      cpu.tick();
      console.log('\none tick() after, cpu.pc', `0x${cpu.pc.toString(16)}`, 'data at pc', `0x${memory.readROM(cpu.pc).toString(16)}`);
      expect(cpu.pc).to.eql(0x0101);
    });

    it('second tick() that performs a JUMP [0xC3]', () => {
      // cpu.pc = 0x0100
      cpu.tick(); // Run one tick, which will run JUMP [0xC3]
      // cpu.pc = 0x0101; // opcode at this address is JUMP [0xC3]
      cpu.tick(); // Run one tick, which will run JUMP [0xC3]
      console.log('\ntwo tick() after both, cpu.pc', `0x${cpu.pc.toString(16)}`, 'data at pc', `0x${memory.readROM(cpu.pc).toString(16)}`);
      expect(cpu.pc).to.eql(0x0150); // The new pc after the jump.
    });
  });

  describe('PC during Flappyboy', () => {
    let cpu, memory;

    beforeEach(() => {
      memory = new Memory(rom);
      cpu = new CPU({
        memory,
      });
    });

    it('0: tick(), CPU.pc = 0x0100', () => {
      expect(cpu.pc).to.eql(0x0100);
    });

    it('1: tick(), CPU.pc = 0x0101', () => {
      cpu.tick();
      expect(cpu.pc).to.eql(0x0101);
    });

    it('2: tick(), CPU.pc = 0x0150', () => {
      cpu.tick();
      cpu.tick();
      expect(cpu.pc).to.eql(0x0150);
    });

    it('3: tick(), CPU.pc = 0x0151', () => {
      for (let i = 0; i < 3; i++) {
        cpu.tick();
      }
      expect(cpu.pc).to.eql(0x0151);
    });

    it('4: tick(), CPU.pc = 0x0152', () => {
      for (let i = 0; i < 4; i++) {
        cpu.tick();
      }
      expect(cpu.pc).to.eql(0x0152);
    });

    it('5: tick(), CPU.pc = 0x0153', () => {
      for (let i = 0; i < 5; i++) {
        cpu.tick();
      }
      expect(cpu.pc).to.eql(0x0153);
    });

    it('6: tick(), CPU.pc = 0x0156', () => {
      for (let i = 0; i < 6; i++) {
        cpu.tick();
      }
      expect(cpu.pc).to.eql(0x0156);
    });

    it('7: tick(), CPU.pc = 0x0159', () => {
      for (let i = 0; i < 7; i++) {
        cpu.tick();
      }
      expect(cpu.pc).to.eql(0x0159);
    });

    it('8: tick(), CPU.pc = 0x015b', () => {
      for (let i = 0; i < 8; i++) {
        cpu.tick();
      }
      expect(cpu.pc).to.eql(0x015b);
    });

    it('9: tick(), CPU.pc = 0x015d', () => {
      for (let i = 0; i < 9; i++) {
        cpu.tick();
      }
      expect(cpu.pc).to.eql(0x015d);
    });

    it('10: tick(), CPU.pc = 0x015e', () => {
      for (let i = 0; i < 10; i++) {
        cpu.tick();
      }
      expect(cpu.pc).to.eql(0x015e);
    });

    // Check the first 1,000 ticks and the PC values for each
    pcRuntimeValues.slice(0, 25).forEach((pcValue, tickCount) => {
      it(`${tickCount}: tick(), CPU.pc = 0x${pcValue.toString(16)}`, () => {
        for (let i = 0; i < tickCount; i++) {
          cpu.tick();
        }
        expect(cpu.pc).to.eql(pcValue);
      });
    });

  });
});
