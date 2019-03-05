import * as path from 'path'

import { shell, createFile } from 'task-api'
import bootstrap from 'modules/bootstrap'
import prettier from 'modules/prettier'
import typescript from 'modules/typescript'

export default function cli({ commands, flags }: any) {
  bootstrap({ commands, flags })
  prettier({ commands, flags })
  typescript({ commands, flags })

  shell(`cd ${commands[1]} && yarn add app-module-path --save`)
  shell(
    `cp -r ${path.resolve(__dirname, './templates')}/* ${path.resolve(
      process.cwd(),
      commands[1],
    )}`,
  )
}
