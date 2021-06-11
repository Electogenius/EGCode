//library for browser functions
return {
	"name": "browser",
	"funs":{
		alert: e=>alert(e),
		ask: e=>prompt(e),
		httpgettext: e=>{
			fetch(e).then(r=>r.text().then(t=>{return(t)})).catch(e=>{throw(e)})
		}
	}
}