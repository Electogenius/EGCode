var sample =
	`Log([1 + 2 - 2 * 2 / 2])
log([hello world + world])
log([uppercase: hi])
log([1\\ +\\ 1\\ is \\ + 1 + 1])
var fun dO n{
	log(you have entered |n|)
}`//idk

var EGCode = {
	compileToJS: function(code) {
		if (typeof(code) !== "string") {
			throw ("JavaScript input must be of type string. Invalid code ", code)
		}
		//UVar -> js
		EGCode.UVarToJS = function(uvar) {
			var x = uvar
			var isNumber = false
			x = x.slice(0, x.length - 1)
			//check type:
			if (!Number.isNaN(Number(x))) { //number
				x = Number(x)
				isNumber = true
			} else if (x[0] == "[" && x[x.length - 1] == "]") { //math
				isNumber = true
				x = x.slice(1, x.length - 1)
				var math = x.split(/ /)
				var mfun = ""
				x = ""
				for (var i = 0; i < math.length; i++) {
					var mkw = math[i]
					if (mkw.length == 1 && (mkw.match(/[+\-*\/]/)||mkw=="("||mkw==")") && mfun == "") { //math operator
						x += " " + mkw + " "
						if (mkw == "(" || mkw == ")") {
							x+="d"
						}else{
							mfun=mkw
						}
					} else if (mkw[mkw.length - 1] == ":") { //math function
						x += "EGCode.funs." + EGCode.varMatch(mkw) + "("
						usemes.isInFunction = true
					} else { //string
						if (mfun !== "" || i == 0) {
							x += (EGCode.UVarToJS(mkw + ")"))
							mfun = ""
						} else { //support for spaces in strings inside math
							if (i !== 0) {
								if (usemes.isInFunction) {
									x += EGCode.UVarToJS(mkw+")")+")"
									usemes.isInFunction=false
								}else{
									var a = (EGCode.UVarToJS(mkw + ")"))
									if (typeof(a) == "string") { //strings
										x = x.slice(0, x.length - 1) + " " + EGCode.UVarToJS(mkw + ")").slice(1, EGCode.UVarToJS(mkw + ")").length)
									} else {
										x = x.slice(0, x.length - 1) + " " + EGCode.UVarToJS(mkw + ")") + "'"
									}
								}
							}
						}
					}
				}
			} else { //string

			}
			if (!isNumber) {
				x = x.replace(/\\/g, "");
				x = "'" + x + "'"
			}
			return x
		}

		function iSE(a, b) { //case insensitive ===
			return a.toLowerCase() === b.toLowerCase()
		}
		//setup thingies
		var output = "";
		var usemes = {isInFunction: false};
		code = code.replace(/\t/g, "")
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
					//kwArr[kwArr.length - 1] += currentChar
					kwArr[kwArr.length - 1] += currentChar
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
					} else if (kwdInd == 1) {
						output += EGCode.UVarToJS(kwd) + ")"
					} else {}
				}
				//var
				if (iSE(usemes.cmdName, "var")) {
					if (kwdInd == 0) {
						output += "var e_"
					} else if (kwdInd == 1) {
						output += EGCode.varMatch(kwd)
					} else if (kwdInd == 2) {
						if (iSE(kwd, " do")) {
							output += " = function(e_"
						} else {
							output += " = " + kwd.slice(0, kwd.length - 1)
						}
					} else {
						output += EGCode.varMatch(kwd.slice(0, kwd.length - 1)) + "){"
					}
				}
				if (usemes.cmdName == "}") {
					output += "}"
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
	clearData: 0,
	varMatch: function(test) {
		var x = test.match(/[A-z,_]/gi)
		return x.join("")
	},
	mfuns: {
		uppercase:(x)=>x.toUpperCase(),
		lowercase:(x)=>x.toLowerCase(),
		stringize:(x)=>String(x).split("").join("\\"), //not sure
		lengthof: (x)=>String(x).length,
		sqrt: (x)=>Math.sqrt(x),
	},
	funs: {
		popup:function(e, f){
			if (e == 1) {
				alert(f)
			}
		}
	}
}