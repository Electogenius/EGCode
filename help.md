# help me
ok

most functions are case insensitive.
## how to run/use
For small tests and stuff you can use the [online compiler](https://electogenius.github.io/electo/likes/ruining/EGCode), and to make a codepen with an EGCode template go [here](http://codepen.io/pen?template=MWpWRmx) but to run egcode yourself you need to:

1. make an variable with egcode value in it (can be imported from another file).
```js
var someCode = "log(hello world)"
```
2. get the EGCode compiler.

### if you are using deno:
```js
import egc /*or some other variable name*/ from "https://cdn.statically.io/gh/electogenius/EGCode/main/compiler.js";
egc.compileToJS(someCode)
```
well as you can see, it's very terrible and big.

### if you are using it in a website:
add a script tag with type="module" in the document's head (**note: EGCode can only be accessed in the module tag**):
```html
<script src="module">
import egc /*or some other variable name*/ from "https://cdn.statically.io/gh/electogenius/EGCode/main/compiler.js";
egc.compileToJS(someCode)
</script>
```
### if you are using nodejs:
```js
import egc /*or some other variable name*/ from "https://cdn.statically.io/gh/electogenius/EGCode/main/compiler.js"
egc.compileToJS(someCode)
```
3. compile the code
```
console.log(EGCode.compileToJS(someCode)) //
```
## print/log text to console

`log(text)`

text can be anything you want, '' and "" should not be added.
## variable declaration
`var variablename(value)`

variable name must be letters, underscores and hyphens

## math

math stuff is marked by box brackets, `[]` anything in between it will be treated, *differently*.

```egc
[1]
gives 1

[hello world]
gives "hello world"

[1 + 1]
gives 2 (SPACES ARE NECESSARY BEFORE AND AFTER FUNCTIONS)

[hello + world]
gives "helloworld"

[hello world + !]
gives "hello world!"

[hello \ + world]
gives "hello world"
the backslash helps to add a space here
NOTE: if you're using this in a js string, you need 2 backslashes because only then it won't be confused with an escape character.

[what is 1 + 1]
gives "what is 11"
seems unusual at first but actually makes sense, it adds "what is 1" and "1"

[what is 1 \+ 1]
[what is \1 \+ \1]
both give "what is 1 + 1"

so
log([2 + 2 - 1])
will log 3 to the console
```
## declaring/making a function
functions are declared using var.
Note: functions are not fully implemented, you can't call a function yet
```egc
var introduce do n{
	log(Hello World!)
}
here "n" is the parameter, functions can only have 1 input which can be an array if necessary
```
and speaking of arrays if necessary,
## arrays
[not really implemented yet]