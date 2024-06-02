import { FileHandle, mkdir, open } from 'node:fs/promises'
import path from 'path'

export class PoolReporter {
  dir: string
  filePositive?: FileHandle
  fileNegative?: FileHandle

  constructor(..._path: string[]) {
    this.dir = path.resolve(..._path)
    try {
      mkdir(this.dir, { recursive: true })
    } catch (_e) {
      // do nothing
    }
  }

  async _openFiles() {
    try {
      if (!this.filePositive)
        this.filePositive = await open(path.resolve(this.dir, 'whitelist'), 'w')
      if (!this.fileNegative)
        this.fileNegative = await open(path.resolve(this.dir, 'blacklist'), 'w')
    } catch (_e) {}
  }

  async reportPoolTest(
    pool: string,
    list: string,
    res: boolean,
    reason?: string,
  ) {
    await this._openFiles()
    if (res) await this.filePositive?.appendFile(`${pool}\n`)
    else {
      if (reason) {
        const len = reason.indexOf('\n')
        if (len >= 0) reason = reason.substring(0, len)
      }
      await this.fileNegative?.appendFile(`${pool} (${list}) - ${reason}\n`)
    }
  }
}
