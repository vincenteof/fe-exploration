import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { parseSync, transformFromAst } from '@babel/core'
import traverse from '@babel/traverse'

let ID = 0
class Module {
  constructor(filePath, id) {
    this.filePath = filePath
    this.content = readFileSync(filePath, 'utf-8')
    this.ast = parseSync(this.content)
    this.mapping = {}
    this.dependencies = this.findDependencies()
    const { code, ast } = transformFromAst(this.ast, null, {
      presets: ["@babel/preset-env"],
    })
    this.code = code
    this.ast = ast
    this.id = id
  }

  findDependencies() {
    const dependencies = []
    traverse(this.ast, {
      ImportDeclaration: ({ node }) => {
        const absolutePath = join(dirname(this.filePath), node.source.value)
        const depModule = createModule(absolutePath)
        this.addMapping(node.source.value, depModule.id)
        dependencies.push(depModule)
      },
    })
    return dependencies
  }

  addMapping(relativePath, id) {
    this.mapping[relativePath] = id
  }
}

function createModule(filePath) {
  const curId = ID
  ID += 1
  return new Module(filePath, curId)
}

export default createModule
