// plugin.js
console.log(1111)
console.log(22222)
const a = 1
const b = 2
const c = a + b
module.exports = function({ types: babelTypes }) {
  return {
    name: "deadly-simple-plugin-example",
    visitor: {
      Identifier(path, state) {
        let name = path.node.name;
        if (state.opts[name]) {
          path.node.name = state.opts[name];
        }
      }
    }
  };
};
