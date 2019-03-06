// This script should be used as a one-off for example
// NODE_PATH=./src ts-node ./src/mongodb/populate.ts

import config from 'config'
import * as fs from 'fs'
import * as mongoose from 'mongoose'
import * as path from 'path'

function createDataMap(dir: string) {
  return fs.readdirSync(dir).reduce((obj: any, file) => {
    try {
      const modelName = path.basename(file, '.json')
      obj[modelName] = require(path.resolve(__dirname, './fixtures', file))
    } catch (err) {
      console.error(err)
      return obj
    }
    return obj
  }, {})
}

async function populateDB(dataMap: any) {
  const entries = Object.entries(dataMap)
  for (const entry of entries) {
    const [key, value] = entry

    try {
      const Model = require(`./models/${key}`).default
      console.log(`Removing and populating ${key} collection...`)
      await Model.remove({})
      if (Array.isArray(value)) {
        await Promise.all(value.map(async v => new Model(v).save()))
      } else {
        await new Model(value).save()
      }
    } catch (err) {
      console.error(err)
    }
  }
}

async function populate(dir: string) {
  await mongoose.connect(
    `mongodb://${config.MONGO_HOST}:${config.MONGO_PORT}/${
      config.MONGO_DB_NAME
    }`,
    {
      auth: config.MONGO_USER &&
        config.MONGO_PASS && {
          password: config.MONGO_PASS,
          user: config.MONGO_USER,
        },
      useNewUrlParser: true,
    },
  )
  const dataMap = createDataMap(dir)
  await populateDB(dataMap)

  const User = require('./models/user').default
  if (!(await User.findOne({ email: 'asd@asd' }))) {
    console.log(`Creating fake user`)
    console.log(`email: asd@asd`)
    console.log(`password: asdasd`)
    await User.createUser(new User({ email: 'asd@asd', password: 'asdasd' }))
  }
}

populate(path.resolve(__dirname, './fixtures'))
  .then(() => process.exit())
  .catch(console.log)
