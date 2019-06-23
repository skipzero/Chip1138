import expect from 'expect.js';
import loadROM from './loadROM.js';
import rom from '../../roms/flappyboy.json';

describe('loadROM', () => {
  let actual;

  beforeEach(() => {
    actual = loadROM(rom);
  });

  it('checks for valid datauri', () => {
    expect(function() {
      loadROM({data: ''});
    }).to.throwException(/Error invalid datauri/);
  });

  it('first byte is 0xC9', () => {
    expect(actual[0]).to.eql(0xc9);
  });

  it('can read name', () => {
    const title = [0x134, 0x135, 0x136, 0x137, 0x138, 0x139, 0x13a, 0x13b, 0x13c].reduce((acc, addr) => {
      return acc + String.fromCharCode(actual[addr]);
    }, '');
    expect(title).to.eql('FLAPPYBOY');
  });
});
