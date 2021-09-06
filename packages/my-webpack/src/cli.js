#!/usr/bin/env node

import { resolve } from 'path'
import build from './index'

const [, , ...args] = process.argv

const entry = args[0]
const outputFolder = args[1]

console.log('input entry: ', entry)
console.log('outputFolder: ', outputFolder)

try {
  const absoluteEntry = resolve(entry)
  build({ entry: absoluteEntry, outputFolder })
  console.log('building successfully')
  process.exitCode = 0
} catch (err) {
  console.error(err)
  process.exitCode = 1
}
