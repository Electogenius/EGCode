var sample =
	`print([2 + 2])
var x(1)
Print([||x|| - 2])`

eval(compileEGCodeToJS(sample))

function compileEGCodeToJS(code) {
	//UVar -> js
	function EGC_UVarToJS(uvar) {
	
	}
	function iSE(a, b) { //case insensitive ===
		return a?.toLowerCase() === a?.toLowerCase()
	}
	function removeLastLetter(txt) {
		return txt?.split(0, txt?.length - 1)
	}
	var output = "";
	var usemes = {};
	code = code.replace(/\t/, "")
	code = code.trim()
	//splitting into commands
	code = code.split(/\f?\n/);
	//egc -> parse:
	var kwArr = [""] //keywords array
	for (var comIndex in code) {
		var command = code[comIndex]
		var comCharArr = command.split("")
		for (var charInd in comCharArr) {
			var currentChar = comCharArr[charInd]
			if (currentChar == "(" && usemes.isInUVal !== true) {
				usemes.isInUVal = true
				kwArr.push("")
			} else {
				if (currentChar == " " && usemes.isInUVal !== true) {
					kwArr.push("")
				}
				kwArr[kwArr.length - 1] += currentChar;
			}
		}
		usemes.isInUVal = 0
		kwArr.push(';')
		kwArr.push("")
	}
	//parse -> better parse
	var arrr = [[]] //array of arrays of keywords in commands
	for (var kwdInd in kwArr) {
		var kw = kwArr[kwdInd];
		if (kw !== "") {
			if (kw == ";") {
				arrr.push([])
			} else {
				arrr[arrr.length - 1].push(kw)
			}
		}
	}
	//better parse -> js:
	//output js:
	console.log(kwArr)
	console.log(arrr)
	console.log(output)
	return output
}