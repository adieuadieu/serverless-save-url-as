import childProcess from 'child_process'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import phantomjs from 'phantomjs-prebuilt'

export default async function handler (url, options = {}) {
  const outputFormat = 'pdf'
  const filePath = `/tmp/${crypto.randomBytes(20).toString('hex')}.${outputFormat}`
  const childArgs = [
    '--ignore-ssl-errors=true',
    '--web-security=false',
    '--load-images=true',
    '--disk-cache=false',
    '--max-disk-cache-size=0',
    path.join(__dirname, `/phantomjs-${outputFormat}.js`),
    url,
    filePath,
    '1120px*800px',
  ]

console.log('the phantomjs script path:', path.join(__dirname, `/phantomjs-${outputFormat}.js`))

  return new Promise((resolve, reject) => {
    childProcess.execFile(phantomjs.path, childArgs, (error, stdout, stderr) => {
      console.log('stdout:', stdout)
      console.log('stderr:', stderr)

      if (error) {
        console.log('childProcess error:', error)
        console.log('stdout:', stdout)
        console.log('stderr:', stderr)
        fs.unlink(filePath, console.error)
        return reject(error)
      }

      return resolve(filePath)
    })
  })
}
