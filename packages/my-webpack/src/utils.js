import * as path from 'path'
import * as fs from 'fs'

export function ensureDirectoryExistence(dir) {
  if (fs.existsSync(dir)) {
    return
  }
  const parentDir = path.dirname(dir)
  ensureDirectoryExistence(parentDir)
  fs.mkdirSync(dir)
}
