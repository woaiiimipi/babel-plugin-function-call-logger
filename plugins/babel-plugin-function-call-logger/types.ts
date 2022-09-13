import types from "@babel/types"
declare global {
  export type Path<TNode = any, TParentNode = any> = {
    node: TNode,
    parentPath: Path<TParentNode>,
    replaceWith: (TNode) => void
    replaceWithSourceString: (src: string) => void
    skip: Function
  }
  export type State = {
    
  }
  export type FunctionDeclaration = types.FunctionDeclaration
  export type FunctionExpression = types.FunctionExpression
  export type ClassMethod = types.ClassMethod
  export type ArrowFunctionExpression = types.ArrowFunctionExpression
  export type VariableDeclarator  = types.VariableDeclarator 
  export type ClassProperty  = types.ClassProperty 
  export type ExpressionStatement  = types.ExpressionStatement 
  export type IfStatement  = types.IfStatement 
  export type Program  = types.Program 
}