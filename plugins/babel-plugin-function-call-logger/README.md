## babel-plugin-function-call-logger
### Named Function
#### Normal Function
##### Normal
> before:
```js
function foo() {
  return 'foo'
}
```
> after
```js
function foo() {
  console.log('__call_trace__', 'foo')
  return 'foo'
}
```
##### Class Method
> before
```js
class Person {
  foo() {
    return 'foo'
  }
}
```
> after
```js
class Person {
  foo() {
    console.log('__call_trace__', 'foo')
    return 'foo'
  }
}
```
#### Arrow Function
##### With Block
> before:
```js
const foo = () => {
  return 'foo'
}
```
> after
```js
const foo = () => {
  console.log('__call_trace__', 'foo')
  return 'foo'
}
```
##### No Block
> before:
```js
const foo = () => {
  return 'foo'
}
```
> after
```js
const foo = () => {
  console.log('__call_trace__', 'foo')
  return 'foo'
}
```
### Anonymous Function
#### Normal Function
##### Normal
> before:
```js
foo(function() {
  return 'Any Return'
})
```
> after
```js
foo(function() {
  console.log('__call_trace__', 'Anonymous')
  return 'Any Return'
})
```
#### Arrow Function
##### With Block
> before:
```js
foo(() => {
  return 'Any Return'
})
```
> after
```js
foo(() => {
  console.log('__call_trace__', 'Anonymous')
  return 'Any Return'
})
```
##### No Block
> before:
```js
foo(() => 'Any Return')
```
> after
```js
foo(() => {
  console.log('__call_trace__', 'Anonymous')
  return 'Any Return'
})
```

### Options
```js
// plugin options
const options = {
    // enable: ['Function', 'Arrow', 'ReactComponent', 'ReactHooks', 'Anonymous'], // These types' functions will be included
    // diable: ['Anonymous'], // These types' functions will be ignored
    localStorageKey: '__call_trace_key__', // your config key
}

// the config you can set in runtime's localStorage
localStorage.setItem('__call_trace_key__', JSON.stringify({
    disableType: ['Function', 'Arrow', 'Anonymous', 'ReactComponent', 'ReactHooks'] // The function type you list will not be logged.
    blackList: [ // The specific functions you list will not be logged
      { filename: './src/file1.js' } // This file's functions will not be logged
      // or
      { filename: './src/file1.js', functionName: '' }, // Disable the specific function
      // or
      { filename: './src/file1.js', disableType: ['Anonymous'] }, // Disable the specific function type
    ],
    throttle: false, // If one function called many times in short time, you can set it log once. Note: this config will make it logged only once.
    logTime: false, // Append time to log info
    logLevel: 'log', // 'log' | 'info' | 'warn' | 'error',
    logParames: false // If you want to log the function's params.
}))
```

### Best Practice
1. If you think `Anonymous Functions` is not important, you can disable it in `diable` list, like
```js
const options = {
    diable: ['Anonymous'], // These types' functions will be ignored
}
```
2. You can save the config in localStorage

```js
// 具名函数 / 普通函数
// 具名函数 / 箭头函数 / 有函数体
// 具名函数 / 箭头函数 / 无函数体
// 具名函数 / 箭头函数 / 类方法 / 有函数体
// 具名函数 / 箭头函数 / 类方法 / 无函数体

// 匿名函数 / 普通函数
// 匿名函数 / 箭头函数 / 有函数体
// 匿名函数 / 箭头函数 / 无函数体
```
