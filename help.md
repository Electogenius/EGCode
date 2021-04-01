# help me
ok

most functions are case insensitive.
## print/log to console/show output

`log(text)`

text can be anything you want, '' and "" are not required.
## variable declaration
`var variablename(value)`

variable name must be letters, underscores and hyphens

## math

math stuff is marked by box brackets, `[]` anything in between it will be treated, *differently*.

```
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
seems unusual at first but actually makes sense

[what is 1 \+ 1]
[what is \1 \+ \1]
both give "what is 1 + 1"

so
log([2 + 2 - 1])
will log 3
(quick mafs)
```
## declaring/making a function
functions are declared using var.
Note: functions are not fully implemented, you can't call a function yet
```
var introduce do n{
	log(Hello World!)
}
here "n" is the parameter, functions can only have 1 input which can be an array if necessary
```
and speaking of arrays if necessary,
## arrays
[not really implemented yet]