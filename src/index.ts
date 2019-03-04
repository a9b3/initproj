import { Commander, Command } from 'commander-shepard'

const commander = new Commander({
  key: 'commander',
  packageJson: require('../package.json'),
  handler: () => {
    console.log(`here`)
  },
})

commander.start()
.catch(console.error)
