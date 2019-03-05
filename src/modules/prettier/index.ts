import * as path from 'path'
import * as fs from 'fs'
import { shell, createFile } from 'task-api'

export default function prettier({ commands, flags }: any) {
  shell(`cd ${commands[1]} && yarn add prettier --dev`)

  createFile({
    dest: path.resolve(process.cwd(), commands[1], '.prettierrc'),
    content: fs.readFileSync(path.resolve(__dirname, './prettierrc'), 'utf8'),
  })
}
