const reg = /^((m|p)-?)?([blrtxy])(?:-?(-?.+))?$/;

const str = 'mr-10px';

console.log(str.match(reg));
