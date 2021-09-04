import fs from 'fs'
import path from 'path'
import babel from '@babel/core'
import traverse from '@babel/traverse'

export class Module {
  constructor(filePath) {
    this.filePath = filePath
    this.content = fs.readFileSync(filePath, 'utf-8')
    this.ast = babel.parseSync(this.content)
    this.dependencies = this.findDependencies()
    this.code = babel.transformFromAst(this.ast, null, {
      presets: ['env'],
    })
  }

  findDependencies() {
    const dependencies = []
    traverse(this.ast, {
      ImportDeclaration: ({ node }) => {
        const absolutePath = path.join(path.dirname(this.filePath), node.source.value)
        dependencies.push(createModule(absolutePath))
      },
    })
  }
}

export default function createModule(filePath) {
  return new Module(filePath)
}
