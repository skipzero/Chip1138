import loadROM from '../utils/loadROM.js';
// import { CART_TYPE } from '../const/cartType.js';

class Memory {

  constructor(rom) {
    if (!rom) {
      throw new Error('requires ROM');
    }
    // this.cartType = CART_TYPE.ROM_ONLY;
    this.data = new Uint16Array(0xffff);

    this.rom = loadROM(rom);
    // this.data = romArray.set(this.rom);

    this.rom.forEach((curr, index) => {
      this.data[index] = curr;
    });
  }

  readROM(address) {
    let romValue;
    // if we used `if (!value)...` we would get a hit on 0 since it's falsey.
    if (typeof address != 'number') {
      // this could throw an error or return the whole rom. I chose return rom to avoid errors
      romValue = this.data; // returns the whole ROM loaded in
    }

    else {
      // get our data at the given address in
      romValue = this.data[address];
    }

    return romValue;
  }

  readROMRange(rangeLow, rangeHigh) {

    // range to read from
    if (!rangeLow && !rangeHigh) {
      throw new Error('please provide a range to return');
    }

    // smallest number of our range
    const low = rangeLow;

    // largest number of our range
    const high = rangeHigh;

    // get our new Array length
    const length = high - low + 1;

    // take our range from the ROM data
    const tempArray = this.data.slice(low, high + 1);

    // create out new typed array
    let rangeArray = new Uint16Array(length);

    // set the values of tempArray into rangeArray
    rangeArray.set(tempArray);
    return rangeArray;
  }

  hexConverter(value) {
    return value.toString(16);
  }

  writeROM(address, data) {
    // const echoAddress = address > 0xfe00 ? address - 0x2000 : address + 0x2000;
    // const hexAddress = (address - 0x2000).toString(16);
    let echoAddress;

    if (address > 0xe000 && address < 0xfe00) {
      echoAddress = address - 0x2000;
      // console.log('Minus:', this.hexConverter(address), '-', this.hexConverter(echoAddress));
      this.data[echoAddress] = data;
    }

    if (address > 0xc000 && address < 0xde00) {
      echoAddress = address + 0x2000;
      // console.log('Plus:', this.hexConverter(address), '+', this.hexConverter(echoAddress));
      this.data[echoAddress] = data;
    }

    this.data[address] = data;
  }

  get isColor() {
    return this.readROM(0x0143) === 0x80;
  }

  get isSuper() {
    return this.readROM(0x0146) === 0x03;
  }

  get cartType() {
    return this.readROM(0x0147);
  }
}

export default Memory;
