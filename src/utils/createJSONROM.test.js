import path from 'path';
import expect from 'expect.js';
import { convertROMtoJSON, writeJSON, MEDIATYPE } from './createJSONROM.js';
const ROOT_PATH = '/roms/gbstudio_test.gb';
const ROM_PATH = path.join(process.cwd(), '/roms/gbstudio_test.gb');
const JSON_PATH = path.join(process.cwd(), '/roms/gbstudio_test.json');

describe('convertROMtoJSON', () => {
  it('has a property called data', () => {
    return convertROMtoJSON(ROM_PATH)
      .then((actual) => {
        expect(actual.data).to.be.a('string');
      })
      .catch((e) => {
        expect().to.fail(e);
      });
  });
  it('has a dataurl header', () => {
    return convertROMtoJSON(ROM_PATH)
      .then((actual) => {
        expect(actual.data.substring(0, 37)).to.eql(MEDIATYPE);
      })
      .catch((e) => {
        expect().to.fail(e);
      });
  });
  it('writes json file', () => {
    return convertROMtoJSON(ROM_PATH)
      .then(writeJSON.bind(null, JSON_PATH))
      .then((actual) => {
        expect(actual).to.eql(JSON_PATH);
      })
      // writeJSON
      .catch((e) => {
        expect().to.fail(e);
      });

  });
});
