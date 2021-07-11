return {
	name: "canvas",
	every: [],
	onload: () => {
		EGCode.context = canvas.getContext('2d')
	},
	funs: {
		"cset": (property, value) => {
			EGCode.context[property] = value
		},
		"cdo": (thing, ...e) => {
			EGCode.context[thing](...e)
		}
	}
}