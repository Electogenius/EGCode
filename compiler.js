function EG() {
	return {
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
					x = x.slice(1, -1)
					//verboser rewrite because I didn't understand any part of what I coded like 3 months ago
					var array = x.split(" ")
					var result = ""
					var previousType = "nil" //type of previous keyword

					array.forEach(keyword => {
						//filter out the type of the keyword
						if (Number.isNaN(Number(keyword))) { //non-numbers
							if ((/[+\-*\/\&\|\(\)\<\>]/).test(keyword) && previousType != "operator") { //math operators
								result += keyword
								if (/[\&\|]/.test(keyword)) result += keyword
								if (keyword != "(" && keyword != ")") previousType = "operator"
							} else { //strings||functions
								if ((keyword.endsWith("(")) && !(keyword.includes("\\"))) { //functions
								} else { //strings
									if (previousType == "string") { result = result.slice(0, -1) }
									result += ((previousType == "string") ? " " : "'") + keyword + "'"
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
				for (var kwdInd in commandArr) {
					var kwd = commandArr[kwdInd]

					function rem() {
						return kwd.slice(0, -1)
					}
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
							usemes.registerVar = "EGCode.registerVar("
						} else if (kwdInd == 1) {
							output += EGCode.varMatch(kwd)
						} else if (kwdInd == 2) {
							if (iSE(kwd, " do")) {
								output += " = function(e_"
							} else {
								output += " = " + rem()
							}
						} else {
							output += EGCode.varMatch(rem()) + "){"
						}
					}
					//set
					if (iSE(usemes.cmdName, "set") || iSE(usemes.cmdName, "=")) {
						if (kwdInd == 1) {
							output += "e_" + EGCode.varMatch(kwd)
						} else if (kwdInd == 2) {
							output += " = " + EGCode.UVarToJS(kwd)
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
			uppercase: (x) => x.toUpperCase(),
			lowercase: (x) => x.toLowerCase(),
			stringize: (x) => String(x).split("").join("\\"), //not sure
			lengthof: (x) => String(x).length,
			sqrt: (x) => Math.sqrt(x),
			ask: (x) => prompt(x)
		},
		funs: { //test
			alert: function(e, f) {
				if (e == 1) {
					return "alert(" + f + ")"
				}
			}
		},
		varsSoFar: {},
		registerVar: (name, value) => EGCode.varsSoFar[name] = value
	}
}