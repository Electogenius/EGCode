var sample = 
`print(hello)`

function compileEGCodeToJS(code) {
	var output;
	var usemes
	//splitting into commands
	code = code.split(/\f?\n/);
	//parsing:
	for (var comIndex in code) {
		var command = code[comIndex]
		var comCharArr = command.split("")
		for (var charInd in comCharArr) {
			var currentChar = comCharArr[charInd]
		}
	}
	//keywords -> js:
	return output
}