import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import babel from '@babel/core'
import traverse from '@babel/traverse'

class Module {
  constructor(filePath) {
    this.filePath = filePath
    this.content = readFileSync(filePath, 'utf-8')
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
        const absolutePath = join(dirname(this.filePath), node.source.value)
        dependencies.push(createModule(absolutePath))
      },
    })
  }
}

function createModule(filePath) {
  return new Module(filePath)
}

export default createModule