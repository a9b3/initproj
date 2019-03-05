import * as path from 'path'
import { shell, createFile } from 'task-api'

export default function bootstrap({ commands, flags }: any) {
  shell(`git init ${commands[1]}`)
  shell(`cd ${commands[1]} && yarn init`)

  createFile({
    dest: path.resolve(process.cwd(), commands[1], '.gitignore'),
    content: ['node_modules', 'build'].join('\n'),
  })

  createFile({
    dest: path.resolve(process.cwd(), commands[1], 'README.md'),
    content: ['# Read Me'].join('\n'),
  })
}
