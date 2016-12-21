/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import test from 'ava'
import handler from './phantom'

const testUrl = 'http://google.com/'
const testOptions = {}

test('phantomjs handler()', async (t) => {
  /*try {
    await handler(testUrl, testOptions)
    t.fail('Should throw error when event name is invalid.')
  } catch (error) {
    t.pass()
  }

  try {
    await handler(testUrl, testOptions)
    t.fail('Should throw error when S3 object key is missing.')
  } catch (error) {
    t.pass()
  }
  */

  const promise = handler(testUrl, testOptions)
  t.notThrows(promise)

  const result = await promise
  console.log(result)
  //t.is(result.length, 1, 'Number of objects uploaded to S3 should match the number of outputs defined in config.')
  t.true(result.length > 0, 'Returns a file path string')
})
