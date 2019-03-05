import { Commander, Command } from 'commander-shepard'
import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'

import { shell } from './task-api'

function listTemplates() {
  return fs.readdirSync(path.resolve(__dirname, '../templates'))
}

const commander = new Commander({
  key: 'initproj',
  packageJson: require('../package.json'),
})

const appCommand = new Command()
appCommand.use(
  'list',
  new Command({
    shortDescription: 'List template apps',
    handler: () => {
      console.log(listTemplates().join('\n'))
    },
  }),
)
appCommand.use(
  'create',
  new Command({
    shortDescription: 'Create template app',
    handler: ({ commands, flags }: any) => {
      const [templateName, location] = commands
      if (!templateName) {
        throw new Error('No template name provided.')
      }
      if (!location) {
        throw new Error('No location provided.')
      }

      if (!listTemplates().includes(templateName)) {
        throw new Error('No matching app provided.')
      }

      shell(
        `cp -r ${path.resolve(
          __dirname,
          '../templates/',
          templateName,
        )}/. ${location}`,
      )
      shell(`cd ${location} && yarn`)
    },
    commands: [
      {
        key: 'appName',
        shortDescription: 'Application Name',
        description: 'Application name',
      },
      {
        key: 'location',
        shortDescription: 'Location',
        description: 'Location',
      },
    ],
  }),
)
commander.use('app', appCommand)

commander.start().catch((e: any) => console.log(chalk.red(`> ${e.message}`)))
