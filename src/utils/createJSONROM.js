import { readFile, writeFile } from 'fs';
import { Base64 } from 'js-base64';
export const MEDIATYPE = 'data:application/octet-stream;base64,';

/**
 * Creates a JSON with with the ROM binary from a Uint16Array
 * @param  {Uint16Array} binary - TypedArray of data.
 * @return {Object} A JSON with a dataurl of the data.
 */
export function createJSONROM(binary) {
  // convert each byte into a char code so we can turn it into a base64 string.
  const stringData = binary.reduce((acc, byte) => { return acc + String.fromCharCode(byte); }, '');
  // convert the string into a base64 string.
  const base64String = Base64.encode(stringData);
  return {
    data: MEDIATYPE + base64String,
  };
}
export default createJSONROM;

export function convertROMtoJSON(filePath) {
  return new Promise(function(resolve, reject) {
    try {
      readFile(filePath, function(err, dataBuffer) {
        // reference: https://en.wikipedia.org/wiki/Executable_and_Linkable_Format
        if (err) { reject(err); }

        resolve(createJSONROM(dataBuffer));
      });
    }
    catch (err) {
      reject(`Unknown error loading ROM at "${filePath}"\n\t${err}`);
    }
  });
}

export function writeJSON(filePath, json) {
  return new Promise(function(resolve, reject) {
    try {
      writeFile(filePath, JSON.stringify(json, void 0, 4), 'utf8', function(err, dataBuffer) {
        // reference: https://en.wikipedia.org/wiki/Executable_and_Linkable_Format
        if (err) { reject(err); }

        resolve(filePath);
      });
    }
    catch (err) {
      reject(`Unknown error loading ROM at "${filePath}"\n\t${err}`);
    }

  });
}
