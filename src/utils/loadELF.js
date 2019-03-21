import { readFile } from 'fs';

// Online GCC: https://godbolt.org/
// help from: https://github.com/riscv/riscv-angel/blob/release/elfload.js
//          : https://github.com/indutny/elfy/blob/master/lib/elfy/parser.js

export default function loadELF(filePath) {
  let readUInt16, readUInt32;
  let readUInt;
  return new Promise(function(resolve, reject) {
    try {
      readFile(filePath, function(err, data) {
        // reference: https://en.wikipedia.org/wiki/Executable_and_Linkable_Format
        const header = {};
        if (err) { reject(err); }
        // Check for the ELF header 0x7f454c46 aka ox7f ELF (in ASCII)
        // const magicNumber = data.readIntLE(0, 4);
        const magicNumber = data.slice(0, 4).toString('hex');
        if (magicNumber !== '7f454c46') { reject(`ELF failed magic number test. Found "${magicNumber}"`); }

        // Edian affects reading over 1 byte, so get it early
        header.ei_data = data[0x05];
        // Add fun and handy getters because the offical names suck.
        Object.defineProperties(header, {
          isLittleEdian: { get() {return this.ei_data === 1;} },
          isBigEdian: { get() {return this.ei_data === 2;} },
        });
        // Update our read methods to use the correct edianness
        if (header.isLittleEdian) {
          readUInt = data.readUIntLE.bind(data);
        }
        else if (header.isBigEdian) {
          readUInt = data.readUIntBE.bind(data);
        }

        // check if the file is 32 or 64 bit
        header.ei_class = data[0x04];
        Object.defineProperties(header, {
          is32: { get() {return this.ei_class === 1;} },
          is64: { get() {return this.ei_class === 2;} },
        });

        header.ei_version = data[0x06];
        header.ei_osabi = data[0x07];
        header.ei_abiversion = data[0x08]
        header.e_type = readUInt(0x10, 2);
        header.e_machine = readUInt(0x12, 2);

        // Entry Point Address
        if (header.is32) {
          header.e_entry = readUInt(0x18, 4);
          header.e_phoff = readUInt(0x1C, 4);
          header.e_shoff = readUInt(0x20, 4);
          header.e_flags = readUInt(0x24, 4);
          header.e_ehsize = readUInt(0x28, 2);
          header.e_phentsize = readUInt(0x2A, 2);
        }
        else if (header.is64) {
          header.e_entry = readUInt(0x18, 8);
          header.e_phoff = readUInt(0x20, 8);
          header.e_shoff = readUInt(0x28, 8);
          header.e_flags = readUInt(0x30, 4);
          header.e_ehsize = readUInt(0x34, 2);
          header.e_phentsize = readUInt(0x36, 2);
        }


        resolve(header);
      });
    } catch (err) {
      reject(`Unknown error loading elf at "${filePath}"\n\t${err}`);
    }
  });
}
