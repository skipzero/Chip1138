// reads a number of bytes and returns a number
export function readBytes(isLittleEdian, buffer, offset, byteLength) {
  let result = 0, byte = 0;
  if (byteLength >= 6) {
    throw new Error('Javascript supports 64-bit doubles, this limits the total byteLength to 6.');
  }

  for (let i=0; i < byteLength; i++) {
    if (isLittleEdian) {
      // Little Edian, walk forward, increasing the offset for each byte.
      byte = buffer[offset+i];
    }
    else {
      // Big Edian, walk backwards, decreasing from the offset for each byte.
      byte = buffer[offset+(byteLength-i-1)];
    }
    // Shift by 8 bits to make room for the new byte.
    result |= byte << (8 * i);
  }
  return result;
}
