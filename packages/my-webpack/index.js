import fs from 'fs'
import path from 'path'
import createModule from './Module'

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
    modules += `"${module.filePath}": function (exports, require) { ${module.code} },`
  }
  moduleMap += '}'
  return moduleMap
}

function addRuntime(moduleMap, entry) {
  return `
  const modules = ${moduleMap};
  const entry = "${entry}";
  function start({ modules, entry }) {
    const moduleCache = {};
    const require = moduleName => {
      if (moduleCache[moduleName]) {
        return moduleCache[moduleName];
      }
      const exports = {};
      moduleCache[moduleName] = exports;
      modules[moduleName](exports, require);
      return moduleCache[moduleName];
    }
    require(entry)
  }
  start(entry)
  `
}

function bundle(graph) {
  const flattened = flattenModules(graph)
  const moduleMap = createModuleMap(flattened)
  const bundledCode = addRuntime(moduleMap, graph.filePath)
  return [{ name: 'bundle.js', content: bundledCode }]
}

function build({ entry, outputFolder }) {
  const graph = createDependencyGraph(entry)
  const assets = build(graph)
  for (let asset of assets) {
    fs.writeFileSync(
      path.join(outputFolder, asset.name),
      asset.content,
      'utf-8'
    )
  }
}

export default build