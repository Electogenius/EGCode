function dom() {
	return {
		name: "dom",
		funs: {
			node: (e) => {
				EGCode.nodes[EGCode.arr(e)[0]] = EGCode.document.createElement(EGCode.arr(e)[1])
				//console.log(EGCode.nodes);
			}
		},
		every: [
			() => {
				if (usemes.cmdName.startsWith("%")) {
					if (kwdInd == 0) {
						output += "EGCode.changeNode('" + EGCode.varMatch(kwd) + "', "
					} else if (kwdInd == 1) {
						output += rem() + ", "
					} else if (kwdInd == 2) {
						output += rem() + ")"
					}
				}
		}
		],
		onload: () => {
			EGCode.document = new DOMParser().parseFromString("", "text/html")
			EGCode.nodes = {}
			EGCode.changeNode = (name, key, val) => {
				let e = EGCode.nodes[name]
				switch (key) {
					case 'innerhtml':
						e.innerHTML = val
						break;
					case 'innertext':
						e.innerHTML = val
						break;
					case 'tagname':
						e.tagName = val
						break;
				}
			}
		}
	}
}