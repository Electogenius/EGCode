var EGCode = {
	compileToJS: function(code) {
		if (typeof(code) !== "string") {
			throw ("JavaScript input must be of type string. Invalid code ", code)
		}
		//UVar -> js
		EGCode.UVarToJS = function(uvar) {
			if (uvar == "") return "0"
			let x = uvar
			var isNumber = false
			//x = x.slice(0, x.length - 1)
			//check type:
			if (!Number.isNaN(Number(x))) { //number
				isNumber = true
			} else if (x[0] == "[" && x[x.length - 1] == "]") { //math
				isNumber = true
				x = x.slice(1, -1)
				//verboser rewrite because I didn't understand any part of what I coded like 3 months ago
				var array = x.split(" ")
				var result = ""
				var previousType = "" //type of previous keyword
				array.forEach(keyword => {
					//filter out the type of the keyword
					if (Number.isNaN(Number(keyword))) { //non-numbers
						if ((/[+\-*\/\&\|\(\)\<\>]/).test(keyword) && previousType != "operator") { //math operators
							result += keyword
							if (/[\&\|]/.test(keyword)) result += keyword
							if (keyword != "(" && keyword != ")") previousType = "operator"
						} else { //strings||functions
							if (keyword.endsWith("(") && (keyword==EGCode.varMatch(keyword))) { //functions
								result += "EGCode.mfuns['"+EGCode.varMatch(keyword)+"']("
							} else { //strings
								if (previousType == "string") { result = result.slice(0, -1) }
								result += ((previousType == "string") ? " " : "`") + keyword + "`"
								previousType = "string"
							}
						}
					} else { //numbers
						result += keyword
						previousType = "number"
					}
				})
				x = result
			} else { //string
			}
			if (!isNumber) {
				//x = x.replace(/\\\\/g, "༷") 
				x = x.replace(/\\/g, "");
				x = x.replace(/`/g, "\\`")
				x = "`" + x + "`"
			} else {
				//x = x.replace(/`/g, "\\")
			}
			return x
		}

		function iSE(a, b) { //case insensitive ===
			return a.toLowerCase() === b.toLowerCase()
		}
		//setup thingies
		var output = "EGCode.resetVals();\n";
		var usemes = { isInFunction: false };
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
			var op = output
			for (var kwdInd in commandArr) {
				var kwd = commandArr[kwdInd]
				function rem() {
					if (kwd.endsWith(")")) return EGCode.UVarToJS(kwd.slice(0, -1));
					return EGCode.UVarToJS(kwd.slice(1))
				}
				//print
				if (iSE(usemes.cmdName, "log")) {
					if (kwdInd == 0) {
						output += "console.log("
					} else if (kwdInd == 1) {
						output += rem() + ")"
					} else {}
				}
				//var
				if (iSE(usemes.cmdName, "var")) {
					if (kwdInd == 0) { //var
						usemes.registerVar = "EGCode.registerVar('"
					} else if (kwdInd == 1) { //varname
						usemes.registerVar += EGCode.varMatch(kwd)
					} else if (kwdInd == 2) { // = value
						usemes.registerVar += "', "
						if (iSE(kwd, " do")) { // = function(
							usemes.registerVar += "function(e_"
						} else {
							usemes.registerVar += rem() + ")"
						}
					} else {
						usemes.registerVar += EGCode.varMatch(kwd.slice(0, -1)) + "){" // e){
					}
					if (kwdInd == commandArr.length - 1) {
						output += usemes.registerVar
						usemes.registerVar = undefined
					}
				}
				//set
				if (iSE(usemes.cmdName, "set") || iSE(usemes.cmdName, "=")) {
					if (kwdInd == 1) {
						output += "EGCode.setVar('" + EGCode.varMatch(kwd) + "', "
					} else if (kwdInd == 2) {
						output += rem() + ")"
					}
				}
				if (usemes.cmdName == "}") output += "})"
				if (usemes.cmdName == "]") output += "}"
				if (op == output && kwdInd == 1) {
					if(typeof EGCode.funs[name] == "string"){
						eval(EGCode.funs[name])
					}else{
						output += "EGCode.callFunction('" + EGCode.varMatch(usemes.cmdName) + "', " + rem() + ")\n"
					}
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
	varMatch: function(test) {
		var x = test.toLowerCase().match(/[A-z0-9_]/g)
		if (x === null) return "-"
		return x.join("").replace(/\[|\]/g, "")
	},
	mfuns: {
		uppercase: (x) => x.toUpperCase(),
		lowercase: (x) => x.toLowerCase(),
		stringize: (x) => String(x).split("").join("\\"), //not sure
		lengthof: (x) => String(x).length,
		sqrt: (x) => Math.sqrt(x),
		ask: (x) => prompt(x),
		n: (x) => x.split("").join("\\")
	},
	funs: { //test
		alert: function(e) {
			alert(e)
		}
	},
	varsSoFar: {},
	registerVar: (name, value) => {
		if (typeof value == "function") EGCode.funs[name] = value;
		else EGCode.varsSoFar[name] = value
	},
	setVar: (name, value) => {
		if(name in EGCode.varsSoFar){
			EGCode.varsSoFar[name] = value
		}
	},
	resetVals: e => EGCode.varsSoFar = {},
	callFunction: (name, param) => {
		if (typeof EGCode.funs[name] == "function") {
			EGCode.funs[name](param)
		}
		//if (typeof EGCode.funs[name] == "string") try { eval(EGCode.funs[name]) } catch (e) {}
	}
}
export default EGCode;