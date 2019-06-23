import { readFile } from 'fs';

export class Elf {
  constructor(buffer) {
    this.buffer = buffer;

    // use the readInt with the correct edianness
    if (this.isLittleEdian) {
      this.readInt = buffer.readIntLE.bind(buffer);
    }
    else {
      this.readInt = buffer.readIntBE.bind(buffer);
    }
  }

  // Edian
  /* eslint-disable camelcase */
  get ei_data() {
    return this.buffer[0x05]; // this can't use readInt since readInt uses it.
  }
  /* eslint-enable camelcase */
  get isLittleEdian() {
    return this.ei_data === 1;
  }
  get isBigEdian() {
    return this.ei_data === 2;
  }

  // 32 or 64 bits
  /* eslint-disable camelcase */
  get ei_class() {
    return this.buffer[0x04];
  }
  /* eslint-enable camelcase */
  get is32() {
    return this.ei_class === 1;
  }
  get is64() {
    return this.ei_class === 2;
  }

  /* eslint-disable camelcase */
  get e_machine() {
    return this.readInt(0x12, 2);
  }

  get e_entry() {
    // JavaScript doesn't support 64 bit numbers, so stick with 32 bit.
    return this.readInt(0x18, 4);
  }

  get e_phoff() {
    if (this.is32) {
      return this.readInt(0x1C, 4);
    }
    // JavaScript doesn't support 64 bit numbers, so stick with 32 bit.
    return this.readInt(0x20, 4);
  }
  get e_phnum() {
    if (this.is32) {
      return this.readInt(0x2C, 2);
    }
    return this.readInt(0x38, 2);
  }

  /* eslint-enable camelcase */
}


export function loadELF(filePath) {
  return new Promise(function(resolve, reject) {
    try {
      readFile(filePath, function(err, dataBuffer) {
        // reference: https://en.wikipedia.org/wiki/Executable_and_Linkable_Format
        if (err) { reject(err); }
        // Check for the ELF header 0x7f454c46 aka ox7f ELF (in ASCII)
        const magicNumber = dataBuffer.slice(0, 4).toString('hex');
        if (magicNumber !== '7f454c46') { reject(`ELF failed magic number test. Found "${magicNumber}"`); }

        resolve(new Elf(dataBuffer));
      });
    }
    catch (err) {
      reject(`Unknown error loading elf at "${filePath}"\n\t${err}`);
    }
  });
}
