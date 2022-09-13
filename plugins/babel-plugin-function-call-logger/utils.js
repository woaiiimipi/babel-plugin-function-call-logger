const t = require('@babel/types')
function safeGet(obj, propertyPath = "") {
  let cur = obj;
  for (const propertyName of propertyPath.split(".")) {
    if (cur[propertyName] == null) {
      return undefined;
    }
    cur = cur[propertyName];
  }
  return cur;
}
function isArrowClassMethod(path) {
  return t.isClassProperty(path.parentPath.node)
}
function isArrowJsxProperty(path) {
  return t.isJSXExpressionContainer(path.parentPath.node)
}
function hasBody(t, path) {
  return t.isBlockStatement(path.node.body);
}
function convertJsonStringToAstCode(jsonStr) {
  const json = JSON.parse(jsonStr);
  const convert = (curNode) => {
    const tokenType = curNode.type
    const params = Object.keys(curNode)
      .filter(key => !['type', 'start', 'end'].includes(key))
      .map(key => curNode(key))
      .map(value => {
        if (Array.isArray(value)) {
          return value.map(item => {
            if (typeof item === "object") {
              return convert(item)
            }
            return value
          })
        }
        return value
      })
    t[tokenType](params)
  }
  return convert(json)
}
const utils = { safeGet, isArrowClassMethod, hasBody };
module.exports = utils;
