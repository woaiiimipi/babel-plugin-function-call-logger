const fs = require("xl-fs");
const handler = require("./handler");
const utils = require("./utils");
module.exports = ({ types: t }) => {
  return {
    visitor: {
      // 函数声明
      FunctionDeclaration(path, state) {
        handler.normalNamed(path, state);
      },
      // 函数表达式
      FunctionExpression(path, state) {
        const fnName = utils.safeGet(path, "parentPath.node.id.name")
        handler.normalAnonymous(path, state, fnName);
      },
      ClassMethod(path, state) {
        handler.normalClassMethod(path, state);
      },
      // 箭头函数体
      ArrowFunctionExpression(path, state) {
        const fnName = utils.safeGet(path, "parentPath.node.id.name");
        const methodName = utils.safeGet(path, "parentPath.node.key.name");
        // const jsxPropertyName = (() => {
        //   if (utils.isArrowJsxProperty) {

        //   }
        // })()
        const isClassMethod = utils.isArrowClassMethod(path);
        const hasBody = t.isBlockStatement(path.node.body);
        // 具名
        if (fnName || methodName) {
          if (hasBody) {
            if (isClassMethod) {
              handler.arrowClassMethodWithBody(path, state, methodName);
            } else {
              handler.arrowNamedWithBody(path, state, fnName || methodName);
            }
          } else {
            if (isClassMethod) {
              handler.arrowClassMethodWithoutBody(path, state, methodName);
            } else {
              handler.arrowNamedWithoutBody(path, state, fnName || methodName);
            }
          }
          // 匿名
        } else {
          if (hasBody) {
            handler.arrowAnonymousWithBody(path, state);
          } else {
            handler.arrowAnonymousWithoutBody(path, state);
          }
        }
      },
      // 注入配置代码
      IfStatement(path, state) {
        handler.injectRuntimeConfig(path, state);
      },
      Program(path, state) {
        handler.injectInitConfig(path, state);
      },
    },
  };
};
