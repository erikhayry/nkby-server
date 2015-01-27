_encode  = (str) ->
    str.replace(/&046/g, ".").replace(/&047/g, "/")	
    
_decode = (str) ->
	str.replace(/\./g, "&046").replace(/\//g, "&047")		    		

module.exports = 
	encode: _encode
	decode: _decode
