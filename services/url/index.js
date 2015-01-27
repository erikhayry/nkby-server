var _decode, _encode;

_encode = function(str) {
  return str.replace(/&046/g, ".").replace(/&047/g, "/");
};

_decode = function(str) {
  return str.replace(/\./g, "&046").replace(/\//g, "&047");
};

module.exports = {
  encode: _encode,
  decode: _decode
};

//# sourceMappingURL=index.js.map
