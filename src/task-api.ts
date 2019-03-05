import { spawnSync } from 'child_process'
import chalk from 'chalk'
import * as fs from 'fs-extra'
import * as _ from 'lodash'

function noCacheRequire(name: string) {
  try {
    delete require.cache[require.resolve(name)]
    return require(name)
  } catch (err) {
    return
  }
}

function logger({ header, message }: { header: string; message: string }) {
  console.log(`${chalk.gray(`TASK ${header} [${message}]`)}`)
  console.log(`${chalk.gray('-')}`.repeat(70))
}

function logFunction(loggerArgs: any, fn: any) {
  return function(...args: any) {
    logger({ ...loggerArgs, message: `${JSON.stringify(args, null, 2)}` })
    fn(...args)
    console.log(`\n\n`)
  }
}

function spawnInherit(command: string): string {
  const child = spawnSync('sh', ['-c', command], {
    stdio: 'inherit',
    encoding: 'utf8',
  })
  if (child.output[1]) {
    console.log(child.output[1])
  } else if (child.output[2]) {
    console.error(child.output[2])
  }
  return child.output[1] || ''
}

export const shell = logFunction({ header: 'SHELL' }, function shell(
  command: string,
) {
  spawnInherit(command)
})

export const createFile = logFunction({ header: 'CREATE FILE' }, function({
  dest,
  content,
}: {
  dest: string
  content: string
}) {
  if (fs.existsSync(dest)) {
    console.log(chalk.yellow(`${dest} already exists, file is not overriden.`))
    return
  }

  console.log(chalk.green(`Adding file -> ${dest}`))
  fs.writeFileSync(dest, content, { encoding: 'utf8' })
})

export const mergeJSON = logFunction(
  { header: 'MERGE JSON' },
  function mergeJSON({ json, dest }: { json: {}; dest: string }) {
    fs.writeFileSync(
      dest,
      JSON.stringify(_.merge(noCacheRequire(dest) || {}, json), null, '  '),
    )
  },
)
