import AWS from 'aws-sdk'
import config from './config'

const defaultParams = (config.s3 && config.s3.params) || {}

const bucket = new AWS.S3({
  params: { Bucket: config.outputBucket },
})

export async function upload (data, params = {}) {
  const s3Params = {
    ...defaultParams,
    ...params,
    Body: data,
  }

  return new Promise((resolve, reject) => {
    bucket.upload(s3Params, (error, response) => {
      if (error) {
        return reject(error)
      }

      return resolve(response)
    })
  })
}
