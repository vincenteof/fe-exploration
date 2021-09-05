#!/usr/bin/env node

import build from './index'

const [, , args] = process.argv

const entry = args[0]
const outputFolder = args[1]

try {
  build({ entry, outputFolder })
  console.log('building successfully')
  process.exitCode = 0
} catch (err) {
  console.error(err)
  process.exitCode = 1
}
