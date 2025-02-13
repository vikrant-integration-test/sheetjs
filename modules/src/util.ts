/*! sheetjs (C) 2013-present SheetJS -- http://sheetjs.com */
var u8_to_dataview = (array: Uint8Array): DataView => new DataView(array.buffer, array.byteOffset, array.byteLength);
export { u8_to_dataview };

var u8str = (u8: Uint8Array): string => /* Buffer.isBuffer(u8) ? u8.toString() :*/ typeof TextDecoder != "undefined" ? new TextDecoder().decode(u8) : utf8read(a2s(u8));
export { u8str };

var u8concat = (u8a: Uint8Array[]): Uint8Array => {
	var len = u8a.reduce((acc: number, x: Uint8Array) => acc + x.length, 0);
	var out = new Uint8Array(len);
	var off = 0;
	u8a.forEach(u8 => { out.set(u8, off); off += u8.length; });
	return out;
};
export { u8concat };

var indent = (str: string, depth: number /* = 1 */): string => str.split(/\n/g).map(x => x && "  ".repeat(depth) + x).join("\n");
export { indent };

function u8indexOf(u8: Uint8Array, data: string | number | Uint8Array, byteOffset?: number): number {
	//if(Buffer.isBuffer(u8)) return u8.indexOf(data, byteOffset);
	if(typeof data == "number") return u8.indexOf(data, byteOffset);
	var l = byteOffset;
	if(typeof data == "string") {
		outs: while((l = u8.indexOf(data.charCodeAt(0), l)) > -1) {
			++l;
			for(var j = 1; j < data.length; ++j) if(u8[l+j-1] != data.charCodeAt(j)) continue outs;
			return l - 1;
		}
	} else {
		outb: while((l = u8.indexOf(data[0], l)) > -1) {
			++l;
			for(var j = 1; j < data.length; ++j) if(u8[l+j-1] != data[j]) continue outb;
			return l - 1;
		}
	}
	return -1;
}
export { u8indexOf };

/* Hopefully one day this will be added to the language */
var popcnt = (x: number): number => {
  x -= ((x >> 1) & 0x55555555);
  x = (x & 0x33333333) + ((x >> 2) & 0x33333333);
  return (((x + (x >> 4)) & 0x0F0F0F0F) * 0x01010101) >>> 24;
};
export { popcnt };

/* Used in the modern cell storage */
var readDecimal128LE = (buf: Uint8Array, offset: number): number => {
	var exp = ((buf[offset + 15] & 0x7F) << 7) | (buf[offset + 14] >> 1);
	var mantissa = buf[offset + 14] & 1;
	for(var j = offset + 13; j >= offset; --j) mantissa = mantissa * 256 + buf[j];
	return ((buf[offset+15] & 0x80) ? -mantissa : mantissa) * Math.pow(10, exp - 0x1820);
};
export { readDecimal128LE };
