function run() {
  // 具名函数 / 普通函数
  function foo1(a, b) {
    return a + b;
  }
  foo1(1, 2, 3);
  function foo2(a, b) {
    const sum = a + b;
    return sum;
  }
  foo2(1, 2, 3);

  // 具名函数 / 普通函数 / 类方法
  class Clz {
    foo3() {
      return "foo3";
    }
  }
  new Clz().foo3();

  // 具名函数 / 箭头函数 / 有函数体
  const foo5 = (a, b) => {
    return a + b;
  };
  foo5(1, 2);

  // 具名函数 / 箭头函数 / 无函数体
  const foo6 = (a, b) => a + b;
  foo6(1, 2);

  // 具名函数 / 箭头函数 / 类方法 / 有函数体
  class Clz1 {
    foo7 = () => {
      return "foo7";
    };
  }
  new Clz1().foo7();

  // 具名函数 / 箭头函数 / 类方法 / 无函数体
  class Clz2 {
    foo8 = () => "foo8";
  }
  new Clz2().foo8();

  // 匿名函数 / 普通函数

  const test = (fn) => {
    fn();
  };
  test(function () {});

  // 匿名函数 / 箭头函数 / 有函数体
  const test2 = (fn) => {
    fn();
  };
  test2(() => {});

  // 匿名函数 / 箭头函数 / 无函数体
  const test3 = (fn) => {
    fn();
  };
  test3(() => 1);

  // 异步函数
  async function foo9() {}

  const foo10 = function () {};

  function ReactComponent1() {

  }
  ReactComponent1()
  const useCustomHook = () => {

  }
  useCustomHook()
  // 对象属性
  const obj = {
    foo11ObjectArrowProperty: () => {
      
    },
    foo12ObjectFunctionProperty: function() {

    }
  }
  obj.foo11ObjectArrowProperty();
  obj.foo12ObjectFunctionProperty();
  // 具名函数 / 函数表达式
  const foo13NamedFunctionExpression = function () {
    
  }

  // jsx属性
}
