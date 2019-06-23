import expect from 'expect.js';
import Memory from '../memory.js';
import { random8bit, randomInt } from './utils.js';
import rom from '../../../roms/flappyboy.json';
import romRumble from '../../../roms/flappyboy.rumble.json';
import { CART_TYPE } from '../../../const/cartType.js';

describe('Memory', () => {
  let memory;

  beforeEach(() => {
    memory = new Memory(rom);
  });

  it('requires a ROM', () => {
    expect(function() {
      new Memory();
    }).to.throwException(/requires ROM/);
  });

  it('can read from the ROM', () => {
    const actual = memory.readROM(0x0000);
    expect(actual).to.eql(0xc9);
  });

  it('can write to the ROM', () => {
    const byte = random8bit();
    memory.writeROM(0x0000, byte);
    const actual = memory.readROM(0x0000);
    expect(actual).to.eql(byte);
  });

  it('addresses work >= 0x8000', () => {
    const byte = random8bit();
    memory.writeROM(0x8000, byte);
    const actual = memory.readROM(0x8000);
    expect(actual).to.eql(byte);
  });

  it('addresses work < 0x8000', () => {
    const byte = random8bit();
    memory.writeROM(0x7fff, byte);
    const actual = memory.readROM(0x7fff);
    expect(actual).to.eql(byte);
  });

  it('can read ROM TITLE', () => {
    const actual = memory.readROMRange(0x0134, 0x13c);
    const expected = new Uint8Array([0x46, 0x4c, 0x41, 0x50, 0x50, 0x59, 0x42, 0x4f, 0x59]);
    expect(actual).to.eql(expected);
  });

  it('can read from internal echo', () => {
    const byte = random8bit();
    memory.writeROM(0xf92e, byte);
    const actual = memory.readROM(0xf92e);
    expect(actual).to.eql(byte);
  });


  describe('8 kilobyte Internal Echo', () => {
    const bank1 = [0xE000, 0xFE00];
    const bank2 = [0xC000, 0xDE00];
    const length = bank1[1] - bank1[0];

    // We don't want to test each and every bit, that's 8k of tests!
    // Just pick a few at random.
    for(let i=0; i < 5; i++) {
      const offset = randomInt(0, length);
      const bank1Addr = bank1[0] + offset;
      const bank2Addr = bank2[0] + offset;

      it(`writes to 0x${bank1Addr.toString(16)} bank1 updates 0x${bank2Addr.toString(16)}`, () => {
        const byte = random8bit();
        memory.writeROM(bank1Addr, byte);
        const actual = memory.readROM(bank2Addr);
        // console.log('bank1','wrote', byte, 'read', actual);
        expect(actual).to.eql(byte);
      });

      it(`writes to 0x${bank2Addr.toString(16)} bank2 updates 0x${bank1Addr.toString(16)}`, () => {
        const byte = random8bit();
        memory.writeROM(bank2Addr, byte);
        const actual = memory.readROM(bank1Addr);
        // console.log('bank2','wrote', byte, 'read', actual);
        expect(actual).to.eql(byte);
      });
    }
  }); // 8 kilobyte Internal Echo

  describe('Cartridge Type', () => {
    it('is read only', () => {
      expect(function() {
        memory.cartType = CART_TYPE.POCKET_CAMERA;
      }).to.throwException(/has only a getter/);
    });

    it(`CART_TYPE.ROM_ONLY is set when address 0x0147 has value 0x${(0x00).toString(16)}`, () => {
      expect(memory.cartType).to.eql(CART_TYPE.ROM_ONLY);
    });

    it.skip(`CART_TYPE.ROM_MBC5_RUMBLE is set when address 0x0147 has value 0x${(0x1c).toString(16)}`, () => {
      memory = new Memory(romRumble);
      expect(memory.cartType).to.eql(CART_TYPE.ROM_MBC5_RUMBLE);
    });

    // set the 16-bits that describes the Cartridge type, then test that the memory object returns the correct type.
    Object.keys(CART_TYPE).forEach((name) => {
      const byte = CART_TYPE[name];

      it(`${name} is set when address 0x0147 has value 0x${(byte).toString(16)}`, () => {
        memory.writeROM(0x0147, byte);
        expect(memory.cartType).to.eql(byte);
      });
    });
  }); // Cartridge Type

  describe('memory.isColor', () => {
    it(' === true', () => {
      memory.writeROM(0x0143, 0x80); // this is the only value that means true
      expect(memory.isColor).to.eql(true);
    });

    it(' === false', () => {
      expect(memory.isColor).to.eql(false);
    });
  });

  describe('memory.isSuper', () => {
    it(' === true', () => {
      memory.writeROM(0x0146, 0x03); // this is the only value that means true
      expect(memory.isSuper).to.eql(true);
    });

    it(' === false', () => {
      expect(memory.isSuper).to.eql(false);
    });
  });
});
