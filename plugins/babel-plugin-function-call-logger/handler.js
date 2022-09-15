/// <reference path="./types.d.ts">
const t = require("@babel/types");
// const generate = require("@babel/generator");
const parser = require("@babel/parser");
const { safeGet } = require("./utils");
/** enums start */
const MARK = "__call__trace__";
const GLOBAL_CONFIG_MARK = MARK + "config__";
const UN_INJECTED_INIT_MARK = MARK + "uninjected__init__";
const UN_INJECTED_LOG_MARK = MARK + "uninjected__log__";
const IGNORE_FN_MARK = MARK + "ignore__fn__";
// const INJECTED_MARK = MARK + "injected__"
const ANONYMOUS_MARK = "Anonymous";
const __EnabledFuntionTypeList = [
  "normalNamed",
  "normalClassMethod",
  "normalAnonymous",
  "arrowNamedWithBody",
  "arrowNamedWithoutBody",
  "arrowClassMethodWithBody",
  "arrowClassMethodWithoutBody",
  "arrowAnonymousWithBody",
  "arrowAnonymousWithoutBody",
];

const __EnabledTypeList = {
  normal: "normal",
  arrow: "arrow",
  anonymous: "anonymous",
  reactComponent: "reactComponent",
  reactHooks: "reactHooks",
};
const EnabledFuntionType = __EnabledFuntionTypeList.reduce((acc, item) => {
  return { ...acc, [item]: item };
}, {});
/** enums end */

const checkIfHandled = (node) => {
  // inject global config in runtime
  return safeGet(node, "body.body.0.test.name") === `'${UN_INJECTED_LOG_MARK}'`
      || safeGet(node, "body.body.0.test.name") === `'${MARK}'`
      || safeGet(node, "body.body.0.expression.left.callee.object.name") === GLOBAL_CONFIG_MARK
};
const parseInsertAst = (fnName, enabledTypeList) => {
  const consoleAst = t.expressionStatement(
    t.callExpression(t.memberExpression(t.identifier("console"), t.identifier("log")), [
      t.stringLiteral(UN_INJECTED_LOG_MARK),
      t.stringLiteral(enabledTypeList.join(",")),
      t.stringLiteral(fnName),
    ])
  );
  const markAst = t.ifStatement(t.identifier(`'${UN_INJECTED_LOG_MARK}'`), t.blockStatement([consoleAst]));
  return markAst;
};
// 具名函数 / 普通函数
/**
 * @param {Path<FunctionDeclaration>} path
 * @param {State} state
 * @param {string} fnName
 */
function normalNamed(path, state) {
  const node = path.node;
  if (checkIfHandled(node)) {
    return;
  }
  const fnName = node.id.name;
  if (fnName === IGNORE_FN_MARK) {
    return;
  }
  try {
    const newNode = t.functionDeclaration(
      node.id,
      node.params,
      t.blockStatement([parseInsertAst(fnName, [__EnabledTypeList.normal]), ...node.body.body], node.body.directives),
      node.generator,
      node.async
    );
    path.replaceWith(newNode);
  } catch (error) {
    return
  }
}
/**
 * @param {Path<FunctionExpression, ClassMethod>} path
 * @param {State} state
 * @param {string} fnName
 */
// 具名函数 / 普通函数 / 类方法
function normalClassMethod(path, state) {
  const node = path.node;
  if (checkIfHandled(node)) {
    return;
  }
  const fnName = path.node.key.name;
  const newNode = t.classMethod(
    node.kind,
    node.key,
    node.params,
    t.blockStatement([parseInsertAst(fnName, [__EnabledTypeList.normal]), ...node.body.body], node.body.directives),
    node.computed,
    node._static,
    node.generator,
    node.async
  );
  path.replaceWith(newNode);
}
// 具名函数 / 箭头函数 / 有函数体
/**
 * @param {Path<ArrowFunctionExpression, VariableDeclarator>} path
 * @param {State} state
 * @param {string} fnName
 */
function arrowNamedWithBody(path, state, fnName) {
  const node = path.node;
  if (checkIfHandled(node)) {
    return;
  }
  const newNode = t.arrowFunctionExpression(
    node.params,
    t.blockStatement([parseInsertAst(fnName, [__EnabledTypeList.arrow]), ...node.body.body], node.body.directives),
    node.async
  );
  path.replaceWith(newNode);
}
// 具名函数 / 箭头函数 / 无函数体
/**
 * @param {Path<ArrowFunctionExpression, VariableDeclarator>} path
 * @param {State} state
 * @param {string} fnName
 */
function arrowNamedWithoutBody(path, state, fnName) {
  const node = path.node;
  if (checkIfHandled(node)) {
    return;
  }
  const newNode = t.arrowFunctionExpression(
    node.params,
    t.blockStatement([parseInsertAst(fnName, [__EnabledTypeList.arrow]), t.returnStatement(node.body)], node.body.directives),
    node.async
  );
  path.replaceWith(newNode);
}
// 具名函数 / 箭头函数 / 类方法 / 有函数体
/**
 * @param {Path<ArrowFunctionExpression, ClassProperty>} path
 * @param {State} state
 * @param {string} fnName
 */
function arrowClassMethodWithBody(path, state) {
  const node = path.node;
  if (checkIfHandled(node)) {
    return;
  }
  const fnName = path.parentPath.node.key.name;
  const newNode = t.arrowFunctionExpression(
    node.params,
    t.blockStatement([parseInsertAst(fnName, [__EnabledTypeList.arrow]), ...node.body.body], node.body.directives),
    node.async
  );
  path.replaceWith(newNode);
}
// 具名函数 / 箭头函数 / 类方法 / 无函数体
/**
 * @param {Path<ArrowFunctionExpression, ClassProperty>} path
 * @param {State} state
 * @param {string} fnName
 */
function arrowClassMethodWithoutBody(path, state, fnName) {
  const node = path.node;
  if (checkIfHandled(node)) {
    return;
  }
  const newNode = t.arrowFunctionExpression(
    node.params,
    t.blockStatement([parseInsertAst(fnName, [__EnabledTypeList.arrow]), t.returnStatement(node.body)], node.body.directives),
    node.async
  );
  path.replaceWith(newNode);
}
// 匿名函数 / 普通函数
/**
 * @param {Path<FunctionExpression>} path
 * @param {State} state
 * @param {string} fnName
 */
function normalAnonymous(path, state, fnName) {
  try {
    const node = path.node;
    if (checkIfHandled(node)) {
      return;
    }
    if (fnName === IGNORE_FN_MARK) {
      return;
    }
    const newNode = t.functionExpression(
      node.id,
      node.params,
      t.blockStatement([parseInsertAst(fnName || ANONYMOUS_MARK, [__EnabledTypeList.normal, __EnabledTypeList.anonymous]), ...node.body.body], node.body.directives),
      node.generator,
      node.async
    );
    path.replaceWith(newNode);
  } catch (error) {
    return
  }
}
// 匿名函数 / 箭头函数 / 有函数体
/**
 * @param {Path<ArrowFunctionExpression>} path
 * @param {State} state
 * @param {string} fnName
 */
function arrowAnonymousWithBody(path, state, fnName) {
  const node = path.node;
  if (checkIfHandled(node)) {
    return;
  }
  const newNode = t.arrowFunctionExpression(
    node.params,
    t.blockStatement([parseInsertAst(ANONYMOUS_MARK, [__EnabledTypeList.arrow, __EnabledTypeList.anonymous]), ...node.body.body], node.body.directives),
    node.async
  );
  path.replaceWith(newNode);
}
// 匿名函数 / 箭头函数 / 无函数体
function arrowAnonymousWithoutBody(path, state, fnName) {
  const node = path.node;
  if (checkIfHandled(node)) {
    return;
  }
  const newNode = t.arrowFunctionExpression(
    node.params,
    t.blockStatement([parseInsertAst(ANONYMOUS_MARK, [__EnabledTypeList.arrow, __EnabledTypeList.anonymous]), t.returnStatement(node.body)], node.body.directives),
    node.async
  );
  path.replaceWith(newNode);
}

// 初始化运行时配置代码
/**
 * @param {Path<Program>} path
 * @param {State} state
 * @param {string} fnName
 */
function injectInitConfig(path, state) {
  if (safeGet(path, "node.body.0.test.name") === MARK) {
    return;
  }
  const markAst = t.ifStatement(t.identifier(`'${UN_INJECTED_INIT_MARK}'`), t.blockStatement([]));
  path.unshiftContainer("body", markAst);
}
// 注入运行时配置代码
/**
 * @param {Path<IfStatement>} path
 * @param {State} state
 * @param {string} fnName
 */
function injectRuntimeConfig(path, state) {
  const replaceMark = safeGet(path, "node.test.name");
  if (![`'${UN_INJECTED_LOG_MARK}'`, `'${UN_INJECTED_INIT_MARK}'`].includes(replaceMark)) {
    return;
  }
  // 每个文件的初始化代码
  if (replaceMark === `'${UN_INJECTED_INIT_MARK}'`) {
    const injectedCode = `
      if ('${MARK}') {
        try {
          if (!window.${GLOBAL_CONFIG_MARK}) {
            window.${GLOBAL_CONFIG_MARK} = JSON.parse(window.localStorage.getItem('${GLOBAL_CONFIG_MARK}') || "{}");
            function ${IGNORE_FN_MARK}(fnName, typesStr) {
              try {
                const types = typesStr.split(',');
                const configList = ${GLOBAL_CONFIG_MARK}.enabledList || [];
                if (fnName && !configList.includes('reactComponent') && fnName.charCodeAt(0) >= 65 && fnName.charCodeAt(0) <= 95) {
                  return false;
                }
                if (fnName && !configList.includes('reactHooks') && fnName.startsWith('use')) {
                  return false;
                }
                for (let item of types) {
                  if (!configList.includes(item)) {
                    return false;
                  }
                }
                return true;
              } catch(error) {
                return false
              }
            }
            ${GLOBAL_CONFIG_MARK}.canLog = ${IGNORE_FN_MARK}
          }
        } catch(error) {}
      }
    `;
    path.replaceWith(parser.parse(injectedCode).program.body[0]);
    // 函数内打印代码
  } else if (replaceMark === `'${UN_INJECTED_LOG_MARK}'`) {
    const [markNode, functionTypeArgNode, functionNameArgNode] = path.node.consequent.body[0].expression.arguments;
    // const injectedCode = `${GLOBAL_CONFIG_MARK}.canLog('${functionNameArgNode.value}', '${functionTypeArgNode.value}') && console.log('${MARK}', '${functionNameArgNode.value}');`;
    // path.replaceWith(parser.parse(injectedCode).program.body[0]);
    path.replaceWith(
      t.expressionStatement(
        t.logicalExpression(
          "&&",
          t.callExpression(
            t.memberExpression(
              t.identifier(GLOBAL_CONFIG_MARK),
              t.identifier('canLog')
            ),
            [t.identifier(`'${functionNameArgNode.value}'`), t.identifier(`'${functionTypeArgNode.value}'`)],
          ),
          t.callExpression(
            t.memberExpression(
              t.identifier('console'),
              t.identifier('log'),
            ),
            [t.identifier(`'${MARK}'`), t.identifier(`'${functionNameArgNode.value}'`)]
          )
        )
      )
    )
  }
  path.skip();
}

const handler = {
  normalNamed,
  normalClassMethod,
  normalAnonymous,
  arrowNamedWithBody,
  arrowNamedWithoutBody,
  arrowClassMethodWithBody,
  arrowClassMethodWithoutBody,
  arrowAnonymousWithBody,
  arrowAnonymousWithoutBody,

  injectInitConfig,
  injectRuntimeConfig,
};
module.exports = handler;
