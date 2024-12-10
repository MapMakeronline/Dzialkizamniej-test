export class BinaryReader {
  private view: DataView;
  private offset: number;
  private length: number;

  constructor(buffer: ArrayBuffer) {
    if (!buffer || buffer.byteLength === 0) {
      throw new Error('Invalid or empty buffer');
    }
    this.view = new DataView(buffer);
    this.offset = 0;
    this.length = buffer.byteLength;
  }

  readDouble(): number {
    this.checkBounds(8);
    const value = this.view.getFloat64(this.offset, true);
    this.offset += 8;
    return value;
  }

  readInt32(): number {
    this.checkBounds(4);
    const value = this.view.getInt32(this.offset, true);
    this.offset += 4;
    return value;
  }

  readBytes(length: number): Uint8Array {
    this.checkBounds(length);
    const bytes = new Uint8Array(this.view.buffer, this.offset, length);
    this.offset += length;
    return bytes;
  }

  private checkBounds(bytesToRead: number) {
    if (this.offset + bytesToRead > this.length) {
      throw new Error(`Buffer overflow: Trying to read ${bytesToRead} bytes at offset ${this.offset} in a buffer of length ${this.length}`);
    }
  }

  getOffset(): number {
    return this.offset;
  }

  setOffset(offset: number): void {
    if (offset < 0 || offset > this.length) {
      throw new Error(`Invalid offset: ${offset}. Must be between 0 and ${this.length}`);
    }
    this.offset = offset;
  }

  getRemainingBytes(): number {
    return this.length - this.offset;
  }
}