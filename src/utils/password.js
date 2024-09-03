export function randPassword(letters, numbers, either) {
    var chars = [
     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 
     "0123456789", 
     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    ];
  
    function randInt(this_max) {
      let umax = Math.pow(2, 32);
      let max = umax - (umax % this_max);
      let r = new Uint32Array(1);
      do {
        crypto.getRandomValues(r);
      } while(r[0] > max);
      return r[0] % this_max;
    }
  
    function randCharFrom(chars) {
      return chars[randInt(chars.length)];
    }
  
    function shuffle(arr) {
      for (let i = 0, n = arr.length; i < n - 2; i++) {
          let j = randInt(n - i);
          [arr[j], arr[i]] = [arr[i], arr[j]];
      }
      return arr;
    }
  
    return shuffle([letters, numbers, either].map(function(len, i) {
      return Array(len).fill(chars[i]).map(x => randCharFrom(x)).join('');
    }).concat().join('').split('')).join('')
  }
  