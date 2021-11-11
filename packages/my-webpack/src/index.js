import { writeFileSync } from 'fs'
import { join } from 'path'
import createModule from './Module'
import { ensureDirectoryExistence } from './utils'

function createDependencyGraph(entry) {
  return createModule(entry)
}

function flattenModules(graph) {
  const modules = []
  const queue = [graph]
  while (queue.length > 0) {
    const cur = queue.pop()
    modules.push(cur)
    queue.push(...cur.dependencies)
  }
  return modules
}

function createModuleMap(modules) {
  let moduleMap = ''
  moduleMap += '{'
  for (let module of modules) {
    moduleMap += `"${module.id}": [
      function (require, module, exports) { ${module.code} },
      ${JSON.stringify(module.mapping)}
    ],`
  }
  moduleMap += '}'
  return moduleMap
}


function genCode(moduleMap) {
  return `
  (function(moduleMap) {
    function require(id) {
      const [fn, mapping] = moduleMap[id];
      function localRequire(name) {
        return require(mapping[name])
      }
      const module = { exports: {} };
      fn(localRequire, module, module.exports);
      return module.exports
    }
    require(0);
  })(${moduleMap});
  `
}

function bundle(graph) {
  const flattened = flattenModules(graph)
  const moduleMap = createModuleMap(flattened)
  const bundledCode = genCode(moduleMap)
  return [{ name: 'bundle.js', content: bundledCode }]
}

function build({ entry, outputFolder = '.' }) {
  const graph = createDependencyGraph(entry)
  const assets = bundle(graph)
  ensureDirectoryExistence(outputFolder)
  for (let asset of assets) {
    writeFileSync(
      join(outputFolder, asset.name),
      asset.content,
      'utf-8'
    )
  }
}

export default build
