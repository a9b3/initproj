import * as path from 'path'
import { shell, mergeJSON } from 'task-api'

export default function typescript({ commands, flags }: any) {
  shell(`cd ${commands[1]} && yarn add --dev typescript tsc ts-node tslib`)

  mergeJSON({
    dest: path.resolve(process.cwd(), commands[1], 'tsconfig.json'),
    json: require('./tsconfig.json'),
  })
}
