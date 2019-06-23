/**
 * Adds some extra attributes to the opcode object
 * This is to make the tests look nicer.
 */
export function addTestData(opcode) {
  opcode.register1 = opcode.operand1.toLowerCase();
  opcode.register2 = opcode.operand2.toLowerCase();
  opcode.byte = parseInt(opcode.addr, 16);
  return opcode;
}

export function random8bit() {
  return 0|Math.random()*0x100;
}

export function random16bit() {
  return 0|Math.random()*0x10000;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
export function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
