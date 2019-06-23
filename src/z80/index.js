// import CPU from './cpu.js';
// import Memory from './memory.js';
// import loadROM from './utils/loadROM.js';
// import rom from '../roms/flappyboy.json';
// let romData = window.romData = loadROM(rom);
//
//
// const memory = window.memory = new Memory(rom);
// const cpu = window.cpu = new CPU({
//   memory,
// });
//
// cpu.pc = 0x0100;
// [
//   { pc: 256, opcode: 0 },
//   { pc: 257, opcode: 195 },
//   { pc: 336, opcode: 243 },
//   { pc: 337, opcode: 87 },
//   { pc: 338, opcode: 175 },
// ].forEach((set) => {
//   const pc = cpu.pc;
//   const opcode = memory.readROM(pc);
//   cpu.tick(); // this can change pc
//
//   if (opcode === set.opcode) {
//     console.log('%cSUCCESS:', 'background-color: #2ECC40; padding: .5em;', 'opcode', `0x${opcode.toString(16)}`, ', pc', `0x${pc.toString(16)}`);
//   }
//   else {
//     console.log('%cFAILURE:', 'background-color: #FF4136; padding: .5em', 'opcode', `0x${opcode.toString(16)}`, 'should be', `0x${set.opcode.toString(16)}`, ', pc', `0x${pc.toString(16)}`, 'should be', `0x${set.pc.toString(16)}`);
//   }
// });



// print the rom title
// const title = [0x134, 0x135, 0x136, 0x137, 0x138, 0x139, 0x13a, 0x13b, 0x13c].reduce((acc, addr) => {
//   return acc + String.fromCharCode(romData[addr]);
// }, '');
// console.log('rom title: ', title);


// const cpu = new CPU();
// const opcodes = [
//   0x3e, 0xff, // LD  a, 255
//   0x87, // ADD a, a
// ];
// run the opcodes
// opcodes.forEach(function(opcode) {
//   cpu.processOpcode(opcode);
// });
