const plugins = [
	require.resolve("./index.js")
]

const presets = [
	["@babel/preset-env", { useBuiltIns: "entry", corejs: { version: "3.10", proposals: true }, debug: false, modules: "auto" }],
	["@babel/preset-typescript", { allowNamespaces: true, allowDeclareFields: true }],
	["@babel/preset-react"],
]

module.exports = {
	plugins,
	presets,
}
