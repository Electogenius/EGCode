var sample =
`log(2 + 2)
log(10)
vaR x(1)
Log([||x|| - 2])
var x do n{
	log(you have entered |n|)
}`
var EGCode = {
compileToJS: function(code) {
	if (typeof(code)!=="string") {
		throw("Input must be of type string. Invalid code "+code+". ")
	}
	//UVar -> js
	function UVarToJS(uvar) {
		var x = uvar
		var isNumber = false
		if (x[x.length-1]!==")") {
			throw("Incorrect end of UVar")
		}else{}
		
		x = x.slice(0, x.length-1)
		//check type:
		if (!Number.isNaN(Number(x))) { //number
			x = Number(x)
			isNumber = true
		}else if(x[0]=="[" && x[x.length-1]=="]"){ //math
			x = x.slice(1, x.length-1)
			var math = x.split(/ /)
			var mfun = ""
			for (var i = 0; i < math.length; i++) {
				var mkw = math[i]
				if (mfun = ""&&mkw.length == 1) { //math operator
					
				}
			}
		}else{ //string
			
		}
		if (!isNumber) {
			x = x.replace(/<>/g, "")
			x = "'" + x + "'"
		}
		return x
	}
	function iSE(a, b) { //case insensitive ===
		return a?.toLowerCase() === b?.toLowerCase()
	}
	//setup thingies
	var output = "";
	var usemes = {};
	code = code?.replace(/\t/g, "")
	//splitting into commands
	code = code.split(/\f?\n/);
	//egc -> parse:
	var kwArr = [""] //keywords array
	for (var comIndex in code) {
		var command = code[comIndex].trim()
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
	var arrr = [[]] //list of arrays of keywords in commands
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
	for (var ci = 0; ci < arrr.length; ci++) {
		var commandArr = arrr[ci]
		usemes.cmdName = commandArr[0]
		for (var kwdInd in commandArr) {
			var kwd = commandArr[kwdInd]
			//print
			if (iSE(usemes.cmdName, "log")) {
				if (kwdInd == 0) {
					output += "console.log("
				}else if (kwdInd == 1){
					output += UVarToJS(kwd) + ")"
				} else{}
			}
			//var
			if (iSE(usemes.cmdName, "var")) {
				if (kwdInd==0) {
					output+="var"
				}else if (kwdInd==1) {
					output+=kwd
				}else if (kwdInd==2) {
					if (kwd == " do") {
						output+=" = function("
					}else{
						console.log(kwd + " or do")
						output+= " = " + kwd.slice(0, kwd.length-1)
					}
				}else{
					output += kwd.slice(0, kwd.length-1) + "){"
				}
			}
			if(usemes.cmdName == "}") {
				output+="}"
			}
		}
		output += "\n"
	}
	//output js:
	/*
	console.log(kwArr)
	console.log(arrr)
	console.log(output) */
	return output
},
	variables: {},
	clearData: 0,
	
}