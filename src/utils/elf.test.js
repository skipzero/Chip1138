import path from 'path';
import expect from 'expect.js';
import { loadELF } from './elf.js';
const FILE_PATH = path.join(process.cwd(), '/roms/hello/hello');

describe('Elf("roms/hello/hello")', () => {
  it('sets isBigEdian and isLittleEdian', () => {
    return loadELF(FILE_PATH)
      .then((actual) => {
        expect(actual.isBigEdian).to.eql(false);
        expect(actual.isLittleEdian).to.eql(true);
      })
      .catch((e) => {
        expect().to.fail(e);
      });
  });
  it('uses RISC-V instruction set architecture', () => {
    return loadELF(FILE_PATH)
      .then((actual) => {
        expect(actual.e_machine).to.eql(0xF3);
      })
      .catch((e) => {
        expect().to.fail(e);
      });
  });
  it('sets is32 and is64', () => {
    return loadELF(FILE_PATH)
      .then((actual) => {
        expect(actual.is32).to.eql(false);
        expect(actual.is64).to.eql(true);
      })
      .catch((e) => {
        expect().to.fail(e);
      });
  });

  it('e_entry (used to set cpu.pc)', () => {
    return loadELF(FILE_PATH)
      .then((actual) => {
        expect(actual.e_entry).to.eql(0x103d0);
      })
      .catch((e) => {
        expect().to.fail(e);
      });
  });

  it('e_phoff (Program Header Offset)', () => {
    return loadELF(FILE_PATH)
      .then((actual) => {
        expect(actual.e_phoff).to.eql(64);
      })
      .catch((e) => {
        expect().to.fail(e);
      });
  });
  it('e_phnum (Program Header Offset)', () => {
    return loadELF(FILE_PATH)
      .then((actual) => {
        expect(actual.e_phnum).to.eql(9);
      })
      .catch((e) => {
        expect().to.fail(e);
      });
  });
});
