import { Commander, Command } from 'commander-shepard'
import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'

function listModules() {
  return fs.readdirSync(path.resolve(__dirname, './modules'))
}

const commander = new Commander({
  key: 'initproj',
  packageJson: require('../package.json'),
})

commander.use(
  'app',
  new Commander({
    description: 'Creates a new application',
    handler: ({ commands, flags }: any) => {
      if (!commands[0]) {
        return console.log(listModules().join('\n'))
      }
      if (!commands[1]) {
        throw new Error('No location provided.')
      }

      if (!listModules().includes(commands[0])) {
        throw new Error('No matching app provided.')
      }

      require(`./modules/${commands[0]}`).default({ commands, flags })
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

commander.start().catch((e: any) => console.log(chalk.red(e.message)))
