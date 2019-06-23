import expect from 'expect.js';
import { readBytes } from './readBytes.js';

describe('readBytes', () => {
  const buffer = Buffer.from([0x7f, 0x45, 0x4c, 0x46, 0x1A, 0x0B, 0x2C, 0x0D]);
  let actual;

  describe('2 bytes: Little Edian', () => {
    const isLittleEdian = true;
    const byteLength = 2;
    describe('offset 0', () => {
      const offset = 0;
      beforeEach(() => {
        actual = readBytes(isLittleEdian, buffer, offset, byteLength);
      });
      it(`returns 0x457F (${0x457F})`, () => {
        expect(actual).to.eql(0x457F);
      });
      it(`returns the same as Buffer.readUIntLE(${offset}, ${byteLength})`, () => {
        expect(actual).to.eql(buffer.readUIntLE(offset, byteLength));
      });
      it(`returns the same as Buffer.readIntLE(${offset}, ${byteLength})`, () => {
        expect(actual).to.eql(buffer.readIntLE(offset, byteLength));
      });
    });
    describe('offset 2', () => {
      const offset = 2;
      beforeEach(() => {
        actual = readBytes(isLittleEdian, buffer, offset, byteLength);
      });
      it(`returns 0x464c (${0x464c})`, () => {
        expect(actual).to.eql(0x464c);
      });
      it(`returns the same as Buffer.readUIntLE(${offset}, ${byteLength})`, () => {
        expect(actual).to.eql(buffer.readUIntLE(offset, byteLength));
      });
      it(`returns the same as Buffer.readIntLE(${offset}, ${byteLength})`, () => {
        expect(actual).to.eql(buffer.readIntLE(offset, byteLength));
      });
    });
  });

  describe('2 bytes: Big Edian', () => {
    const isLittleEdian = false;
    const byteLength = 2;
    describe('offset 0', () => {
      const offset = 0;
      beforeEach(() => {
        actual = readBytes(isLittleEdian, buffer, offset, byteLength);
      });
      it(`returns 0x7f45 (${0x7f45})`, () => {
        expect(actual).to.eql(0x7f45);
      });
      it(`returns the same as Buffer.readUIntBE(${offset}, ${byteLength})`, () => {
        expect(actual).to.eql(buffer.readUIntBE(offset, byteLength));
      });
      it(`returns the same as Buffer.readIntBE(${offset}, ${byteLength})`, () => {
        expect(actual).to.eql(buffer.readIntBE(offset, byteLength));
      });
    });
    describe('offset 2', () => {
      const offset = 2;
      beforeEach(() => {
        actual = readBytes(isLittleEdian, buffer, offset, byteLength);
      });
      it(`returns 0x4c46 (${0x4c46})`, () => {
        expect(actual).to.eql(0x4c46);
      });
      it(`returns the same as Buffer.readUIntBE(${offset}, ${byteLength})`, () => {
        expect(actual).to.eql(buffer.readUIntBE(offset, byteLength));
      });
      it(`returns the same as Buffer.readIntBE(${offset}, ${byteLength})`, () => {
        expect(actual).to.eql(buffer.readIntBE(offset, byteLength));
      });
    });
  });

  describe('4 bytes: Little Edian', () => {
    const isLittleEdian = true;
    const byteLength = 4;
    describe('offset 0', () => {
      const offset = 0;
      beforeEach(() => {
        actual = readBytes(isLittleEdian, buffer, offset, byteLength);
      });
      it(`returns 0x464c457F (${0x464c457F})`, () => {
        expect(actual).to.eql(0x464c457F);
      });
      it(`returns the same as Buffer.readUIntLE(${offset}, ${byteLength})`, () => {
        expect(actual).to.eql(buffer.readUIntLE(offset, byteLength));
      });
      it(`returns the same as Buffer.readIntLE(${offset}, ${byteLength})`, () => {
        expect(actual).to.eql(buffer.readIntLE(offset, byteLength));
      });
    });
    describe('offset 4', () => {
      const offset = 4;
      beforeEach(() => {
        actual = readBytes(isLittleEdian, buffer, offset, byteLength);
      });
      it(`returns 0x0d2c0b1a (${0x0d2c0b1a})`, () => {
        expect(actual).to.eql(0x0d2c0b1a);
      });
      it(`returns the same as Buffer.readUIntLE(${offset}, ${byteLength})`, () => {
        expect(actual).to.eql(buffer.readUIntLE(offset, byteLength));
      });
      it(`returns the same as Buffer.readIntLE(${offset}, ${byteLength})`, () => {
        expect(actual).to.eql(buffer.readIntLE(offset, byteLength));
      });
    });
  });
  describe('4 bytes: Big Edian', () => {
    const isLittleEdian = false;
    const byteLength = 4;
    describe('offset 0', () => {
      const offset = 0;
      beforeEach(() => {
        actual = readBytes(isLittleEdian, buffer, offset, byteLength);
      });
      it(`returns 0x7f454c46 (${0x7f454c46})`, () => {
        expect(actual).to.eql(0x7f454c46);
      });
      it(`returns the same as Buffer.readUIntBE(${offset}, ${byteLength})`, () => {
        expect(actual).to.eql(buffer.readUIntBE(offset, byteLength));
      });
      it(`returns the same as Buffer.readIntBE(${offset}, ${byteLength})`, () => {
        expect(actual).to.eql(buffer.readIntBE(offset, byteLength));
      });
    });
    describe('offset 4', () => {
      const offset = 4;
      beforeEach(() => {
        actual = readBytes(isLittleEdian, buffer, offset, byteLength);
      });
      it(`returns 0x1a0b2c0d (${0x1a0b2c0d})`, () => {
        expect(actual).to.eql(0x1a0b2c0d);
      });
      it(`returns the same as Buffer.readUIntBE(${offset}, ${byteLength})`, () => {
        expect(actual).to.eql(buffer.readUIntBE(offset, byteLength));
      });
      it(`returns the same as Buffer.readIntBE(${offset}, ${byteLength})`, () => {
        expect(actual).to.eql(buffer.readIntBE(offset, byteLength));
      });
    });
  });

  it.skip('8 bytes: Little Edian', () => {
    actual = readBytes(true, buffer, 0, 8);
    expect(actual).to.eql(0xDDCCBBAA464c457f);
  });
  it.skip('8 bytes: Big Edian', () => {
    actual = readBytes(false, buffer, 0, 8);
    expect(actual).to.eql(0x7f454c46AABBCCDD);
  });

});
