function sha1(message) {
    function rotateLeft(n, s) {
      return (n << s) | (n >>> (32 - s));
    }
  
    function addPadding(message) {
      let originalLength = message.length * 8;
      let paddingLength = (448 - (originalLength + 8) % 512 + 512) % 512;
      let padding = "\x80" + "\x00".repeat(paddingLength / 8);
      let lengthBytes = [];
      for (let i = 56; i >= 0; i -= 8) {
        lengthBytes.push((originalLength >> i) & 0xff);
      }
      return message + padding + String.fromCharCode(...lengthBytes);
    }
  
    function processChunk(chunk, h0, h1, h2, h3, h4) {
      let words = [];
      for (let i = 0; i < chunk.length; i += 4) {
        words.push(
          (chunk.charCodeAt(i) << 24) |
            (chunk.charCodeAt(i + 1) << 16) |
            (chunk.charCodeAt(i + 2) << 8) |
            chunk.charCodeAt(i + 3)
        );
      }
  
      for (let i = 16; i < 80; i++) {
        words[i] = rotateLeft(
          words[i - 3] ^ words[i - 8] ^ words[i - 14] ^ words[i - 16],
          1
        );
      }
  
      let a = h0;
      let b = h1;
      let c = h2;
      let d = h3;
      let e = h4;
  
      for (let i = 0; i < 80; i++) {
        let f, k;
        if (i < 20) {
          f = (b & c) | (~b & d);
          k = 0x5a827999;
        } else if (i < 40) {
          f = b ^ c ^ d;
          k = 0x6ed9eba1;
        } else if (i < 60) {
          f = (b & c) | (b & d) | (c & d);
          k = 0x8f1bbcdc;
        } else {
          f = b ^ c ^ d;
          k = 0xca62c1d6;
        }
  
        let temp =
          rotateLeft(a, 5) + f + e + k + words[i];
        e = d;
        d = c;
        c = rotateLeft(b, 30);
        b = a;
        a = temp >>> 0;
      }
  
      h0 = (h0 + a) >>> 0;
      h1 = (h1 + b) >>> 0;
      h2 = (h2 + c) >>> 0;
      h3 = (h3 + d) >>> 0;
      h4 = (h4 + e) >>> 0;
  
      return [h0, h1, h2, h3, h4];
    }
  
    message = addPadding(message);
    let h0 = 0x67452301;
    let h1 = 0xefcdab89;
    let h2 = 0x98badcfe;
    let h3 = 0x10325476;
    let h4 = 0xc3d2e1f0;
  
    for (let i = 0; i < message.length; i += 64) {
      let chunk = message.slice(i, i + 64);
      [h0, h1, h2, h3, h4] = processChunk(chunk, h0, h1, h2, h3, h4);
    }
  
    return (
      ("0000000" + h0.toString(16)).slice(-8) +
      ("0000000" + h1.toString(16)).slice(-8) +
      ("0000000" + h2.toString(16)).slice(-8) +
      ("0000000" + h3.toString(16)).slice(-8) +
      ("0000000" + h4.toString(16)).slice(-8)
    );
  }
  

//   let message = "Hello, world!";
//   console.log("SHA-1 hash:", sha1(message));
export{ sha1 }
  