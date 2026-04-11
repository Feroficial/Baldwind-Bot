import { join, dirname } from 'path'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import { existsSync, writeFileSync } from 'fs'
import cfonts from 'cfonts'
import chalk from 'chalk'

console.log(chalk.bold.hex('#00FFFF')('\n✞─ Iniciando BALDWIND IV ─✞'))

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)
require(join(__dirname, './package.json'))

async function iniciarBaldwind() {
  console.clear()

  console.log(chalk.bold.cyanBright('\n⟦ ⌬ BALDWIND IV V.777 ⟧'))
  console.log(chalk.gray('⌬ Iniciando sistema...'))
  await new Promise(res => setTimeout(res, 800))

  cfonts.say('BALDWIND IV', {
    font: 'block',
    align: 'center',
    colors: ['#00FFFF', '#FF00FF', '#FFD700'],
    letterSpacing: 1
  })

  console.log(chalk.bold.hex('#00FFFF')(`
█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█
█░░╦─╦╔╗╦─╔╗╔╗╔╦╗╔╗░░█
█░░║║║╠─║─║─║║║║║╠─░░█
█░░╚╩╝╚╝╚╝╚╝╚╝╩─╩╚╝░░█
█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█
        [ ACCESO CONCEDIDO ]
  `))

  await new Promise(res => setTimeout(res, 800))

  console.log(chalk.bold.hex('#FF00FF')('\n⌬═════════════════════⌬'))
  console.log(chalk.bold.white('      SISTEMA CREADO POR: ') + chalk.bold.hex('#FFD700')('🜸 DEVLYONN 🜸'))
  console.log(chalk.bold.white('      BALDWIND IV - CYBER CORE EDITION'))
  console.log(chalk.bold.hex('#FF00FF')('⌬═══════════════════════⌬\n'))

  await new Promise(res => setTimeout(res, 1200))
}

let isRunning = false
function start(file) {
  if (isRunning) return
  isRunning = true
  
  let args = [join(__dirname, 'baldwind-core', file), ...process.argv.slice(2)]
  
  setupMaster({ exec: args[0], args: args.slice(1) })
  let p = fork()
  p.on('exit', (_, code) => {
    isRunning = false
    if (code !== 0) start(file)
  })
}

const archivoArranque = './.arranque-ok'
if (!existsSync(archivoArranque)) {
  await iniciarBaldwind()
  writeFileSync(archivoArranque, 'DEVLYONN_FINAL')
}

start('start.js')
