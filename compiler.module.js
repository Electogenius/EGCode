var EGCode = {
	version: 0.92,
	compileToJS: function(code) {
		if (typeof(code) !== "string") {
			throw ("JavaScript input must be of type string. Invalid code ", code)
		}
		//UVar -> js
		EGCode.UVarToJS = function(uvar) {
			if (uvar == "") return "0"
			if(typeof uvar == 'number')return String(uvar)
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
				var previousKeyword = ""
				array.forEach(keyword => {
					//filter out the type of the keyword
					if (Number.isNaN(Number(keyword))) { //non-numbers
						if ((/(\+|\-|\*|\/|\&|\||\<|\>|\=|\!|\%)/).test(keyword) && previousType != "operator" && keyword.length == 1) { //math operators
							if (keyword != "!") { result += keyword } else { keyword += "=" }
							if (/[\&\|\=]/.test(keyword)) result += keyword;
							
							previousType = "operator"
						}else if (keyword == "(" || keyword == ")") { //brackets
							//fit into previous type:
							if(previousType == "string"&&keyword=="(")result += "+"
							result += keyword
							
							previousType = "bracket"
						} else { //strings||functions
							if (keyword.endsWith("(") && (keyword == EGCode.varMatch(keyword,"p") + "(")) { //functions
								result += "EGCode.mfun('" + EGCode.varMatch(keyword,"p") + "', "
								//fit into previous type:
								if(previousKeyword == ")"||previousType=="string"||previousType=="number")keyword+="+"
								
								previousType = "mfun"
							} else if((!keyword.startsWith("$"))||EGCode.varMatch(keyword)!==keyword.slice(1)){ //strings
								if (previousType == "string") result = result.slice(0, -1)
								if (previousType == "bracket" && previousKeyword == ")") result += "+"
								if (previousType == "number") result += "+"
								result += ((previousType == "string") ? " " : (previousType == "number") ? "` " : "`") + keyword + "`"
								previousType = "string"
							}else{
								result += "EGCode.getVar('"+keyword.slice(1)+"')"
							}
						}
					} else { //numbers
						if (previousType == "string") {
							result=result.slice(0,-1)
							result += " "+keyword+"`"
							previousType = "string"
							//console.log(previousKeyword)
						} else {
							result += keyword
							previousType = "number"
						}
					}
					previousKeyword = keyword
				})
				x = result
			} else { //string
			}
			if (!isNumber) {
				//x = x.replace(/\\\\/g, "༷") 
				
				x = x.replace(/`/g, "\\`")
				x = "`" + x + "`"
			} else {
				//x = x.replace(/`/g, "\\")
			}
			x = x.replace(/\$[^\\`]+/g, function(a, b, c) {//`
				if(typeof EGCode.varsSoFar[a] !== "number"){
					return "\${EGCode.getVar('" + EGCode.varMatch(a.split(/\\/)[0]) + "')}"
				}else{
					return a
				}
			})
			x = x.replace(/\\(?=\\)/g, "\\\\");
			x = x.replace(/\\(?!\\)/g, "");
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
						output+=" "
						usemes.registerVar = "EGCode.registerVar('"
					} else if (kwdInd == 1) { //varname
						usemes.registerVar += EGCode.varMatch(kwd,"p")
					} else if (kwdInd == 2) { // = value
						usemes.registerVar += "', "
						if (iSE(kwd, " do")) { // = function(
							usemes.registerVar += "function(e_"
						} else {
							usemes.registerVar += rem() + ")"
						}
					} else {
						let paramname = EGCode.varMatch(kwd.slice(0, -1))
						usemes.registerVar += EGCode.varMatch(kwd.slice(0, -1)) + "){EGCode.newParam('"+paramname+"',e_"+paramname+")" // e){
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
				//if
				if(EGCode.varMatch(usemes.cmdName)=="if"){
					if(kwdInd==0){
						output+="if("
					}else{
						output+=EGCode.UVarToJS(kwd.slice(0,-2))+"){"
					}
				}
				//"ifn't"
				if (EGCode.varMatch(usemes.cmdName) == "ifnt") {
					if (kwdInd == 0) {
						output += "if(!("
					} else {
						output += EGCode.UVarToJS(kwd.slice(0, -2)) + ")){"
					}
				}
				//repeat
				if (EGCode.varMatch(usemes.cmdName) == "repeat") {
					if (kwdInd == 0) {
						output += "EGCode.times("
					} else {
						let paramname = kwd.slice(0,EGCode.varMatch(kwd).indexOf("_"))
						output += EGCode.UVarToJS(kwd.slice(kwd.indexOf("_")+1,-2)) + ",function(e_"+paramname+"){EGCode.newParam('"+paramname+"',e_"+paramname+")"
					}
				}
				//give (return)
				if (iSE(usemes.cmdName, "give")) {
					if (kwdInd == 0) {
						output += "return("
					} else if (kwdInd == 1) {
						output += rem() + ")"
					}
				}
				//else
				if(iSE(usemes.cmdName, "]else[")){
					output+="}else{"
				}
				//else if
				if(iSE(usemes.cmdName,"]elseif")){
					if(kwdInd==0){
						output+="}else if("
					}else{
						output+=EGCode.UVarToJS(kwd.slice(0,-2))+"){"
					}
				}
				//else ifn't
				if (iSE(usemes.cmdName, "]elseifnt")) {
					if (kwdInd == 0) {
						output += "}else if(!("
					} else {
						output += EGCode.UVarToJS(kwd.slice(0, -2)) + ")){"
					}
				}
				//a better "set variable"
				if(usemes.cmdName.startsWith("$") && commandArr[1] == " ="){
					if (kwdInd == 0) {
						output += "EGCode.setVar('" + EGCode.varMatch(kwd) + "', "
					} else if (kwdInd == 2) {
						output += rem() + ")"
					}
				}
				
				if (usemes.cmdName == "}") output += "})"
				if (usemes.cmdName == "]") output += "}"
				if (op == output && kwdInd == 1) {
					if (typeof EGCode.funs[usemes.cmdName] == "string") {
						new Function(EGCode.funs[usemes.cmdName]).call()
					} else {
						if(!commandArr[commandArr.length-1].endsWith("{")){output += "EGCode.callFunction('" + EGCode.varMatch(usemes.cmdName,"p") + "', " + rem() + ")\n"}else{
							output += "EGCode.callFunction('" + EGCode.varMatch(usemes.cmdName,"p") + "', function(e_" + EGCode.varMatch(kwd.slice(0, -1)) + "){"
						}
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
	varMatch: function(test, type) {
		var x = test.toLowerCase()
		if (type != "p") { //p = "pure"
			x = x.replace(/,,/g, ", ")
		}
		if(type==undefined){
			x=x.match(/[A-Za-z0-9_\.]/g)
		}else{
			x=x.match(/[A-Za-z0-9_]/g)
		}
		if (x === null) return "_"
		return x.join("").replace(/\[|\]/g, "")
	},
	funs: {},
	stdFuns:{
		uppercase: (x) => x.toUpperCase(),
		lowercase: (x) => x.toLowerCase(),
		stringize: (x) => String(x).split("").join("\\"), //not sure
		lengthof: (x) => String(x).length,
		sqrt: (x) => Math.sqrt(x),
		ask: (x) => prompt(x),
		n: (x)=>x.split("").join("\\"),
		_log: (x)=>Math.log(x),
		rand: (x)=>Math.round(Math.random()*x),
		run: (x)=>new Function(EGCode.compileToJS(String(x))).call(),
		eval: (x)=>new Function('return '+EGCode.UVarToJS(x)).call(),
		sin: (x)=>Math.sin(x),
		cos: (x)=>Math.cos(x),
	},
	varsSoFar: {},
	stdVars:{
		
	},
	registerVar: (name, value) => {
		if (typeof value == "function"){
			if(!(name in EGCode.funs))EGCode.funs[name] = value;
		}else{
			if(!(name in EGCode.varsSoFar))EGCode.varsSoFar[name] = value
		}
	},
	setVar: (name, value) => {
		if(!name.startsWith("_")){
			if (name in EGCode.varsSoFar) {
				EGCode.varsSoFar[name] = value
			}else if((name.slice(0,name.lastIndexOf("."))) in EGCode.varsSoFar){
				EGCode.varsSoFar[name] = value
			}
		}
	},
	resetVals: e =>{
		EGCode.varsSoFar = EGCode.stdVars
		EGCode.funs = EGCode.stdFuns
	},
	callFunction: (name, param) => {
		if(!name.startsWith("with_")){
			if (typeof EGCode.funs[name] == "function") {
				EGCode.funs[name](param)
			}
		}else{
			if(typeof param == "function"){
				name.split("_").slice(1).forEach(lib=>{
					EGCode.import(lib).then((res)=>{
						EGCode.loadlib(new Function(res.contents).call())
						param.call()
					})
				})
			}
		}
		//if (typeof EGCode.funs[name] == "string") try { eval(EGCode.funs[name]) } catch (e) {}
	},
	mfun: (fname, test) => {
		if (fname in EGCode.funs) {
			return EGCode.funs[fname](test)
		} else {
			return fname + "( " + test + " )"
		}
	},
	import: (lib)=>{
		return fetch(EGCode.cors+EGCode.library_link+lib+".js").then(e=>{if(e.ok){return e.json()}else{throw("error fetching file")}})
	},
	library_link:"https://cdn.jsdelivr.net/gh/Electogenius/EGCode@main/eglib/",
	cors: "https://api.allorigins.win/get?url=",
	loadlib: o=>{
		for (var prop in o.funs) {
			EGCode.funs[prop]=o.funs[prop]
		}
		for (var prop in o.funs) {
			EGCode.funs[prop] = o.funs[prop]
		}
	},
	getVar: name=>{
		if(EGCode.varMatch(name) in EGCode.varsSoFar){
			return EGCode.varsSoFar[EGCode.varMatch(name)]
		}else if(EGCode.varMatch(name) in EGCode.params){
			return EGCode.params[EGCode.varMatch(name)]
		}else{
			return "$"+name
		}
	},
	params: {},
	newParam:(name,val)=>{
		EGCode.params[name]=val
	},
	times: (times, callback)=>{
		for (var index = 0; index < times; index++) {
			callback(index)
		}
	},
	arr: function(text){
		let numArr=true
		text.split("_").forEach(e=>{
			if(Number.isNaN(Number(e)))numArr=false
		})
		if(numArr){
			return text.split("_")
		}else{
			return text.split(",,")
		}
	}
}
export default EGCode;
