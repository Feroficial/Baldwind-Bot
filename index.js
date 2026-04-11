import { join, dirname } from 'path'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import { existsSync, writeFileSync } from 'fs'
import cfonts from 'cfonts'
import { createInterface } from 'readline'
import chalk from 'chalk'

console.log(chalk.bold.hex('#00FFFF')('\n✞─ Iniciando BALDWIND IV ─✞'))

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)
require(join(__dirname, './package.json'))

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

async function barraCarga() {
  const frames = [
    '[⏳] Iniciando BALDWIND IV...',
    '[🜸] Reuniendo maná primitivo...',
    '[🛸] Cargando hechizos prohibidos...',
    '[⚡] Sincronizando con demonios...',
    '[🔥] Fusión de magia negra...',
    '[🌌] Apertura del Reino Oscuro...',
    '[✅] BALDWIND IV 100% OPERATIVO.'
  ]
  for (let frame of frames) {
    process.stdout.write('\r' + chalk.cyanBright(frame))
    await new Promise(res => setTimeout(res, 350))
  }
  console.log()
}

async function animacionInicio() {
  const frames = [
chalk.hex('#555555')(`
 ╭━┳━╭━╭━╮╮
 ┃   ┣▅╋▅┫┃
 ┃ ┃ ╰━╰━━━━━━╮
 ╰┳╯       ◢▉◣
  ┃        ▉▉▉
  ┃        ◥▉◤
  ┃    ╭━┳━━━━╯
  ┣━━━━━━┫  INICIANDO PROTOCOLO
`),

chalk.hex('#FF0000')(`
 ╭━┳━╭━╭━╮╮
 ┃   ┣▅╋▅┫┃
 ┃ ┃ ╰━╰━━━━━━╮
 ╰┳╯       ◢▉◣
  ┃        ▉▉▉
  ┃        ◥▉◤
  ┃    ╭━┳━━━━╯
  ┣━━━━━━┫  ANTIMAGIA DETECTADA
`),

chalk.hex('#FFD700')(`
　　　　　⣀⠤⠖⠒⠒⠒⠢⠤⣀   
　　　⣠⠊⠁ ⣀　⣀　　⠈⠑⡄ 
　　⢠⠃⣰⠁⠈⣀⣤⣤⡑　⣢⣭⢉⣿ 
　　⢸ ⡏ ⢰⣿⣿⣿⡜　⣿⣿⡇⣿ 
　　⠈⣆⡇ ⠘⠿⣿⡿⠎⣀⡙⠿⠓⢙⡄
　　　⠈⠳⢄⣀⠠⡒⠁⠐⠚⠃ ⢶⠋ 
　　　　　　⢸ ⢇⣮⣥⠼⢬⠼⠞  
　　　　⣠⠶⣮⡆⢸⣟⣀⣐⣺⡆   
`),

chalk.hex('#FF00FF')(`
─────█─▄▀█──█▀▄─█─────
────▐▌──────────▐▌────
────█▌▀▄──▄▄──▄▀▐█────
───▐██──▀▀──▀▀──██▌───
──▄████▄──▐▌──▄████▄──
        NÚCLEO DESPIERTO
`)
  ]

  const duracionTotal = 3000
  const delay = Math.floor(duracionTotal / frames.length)

  for (let i = 0; i < frames.length; i++) {
    console.clear()
    console.log(frames[i])
    await new Promise(res => setTimeout(res, delay))
  }
}

async function iniciarBaldwind() {
  console.clear()

  console.log(chalk.bold.cyanBright('\n⟦ ⌬ ACCESO CONCEDIDO | BALDWIND IV V.777 ⟧'))
  console.log(chalk.gray('⌬ Canalizando acceso mágico...'))
  await new Promise(res => setTimeout(res, 600))

  await animacionInicio()

  await barraCarga()
  await new Promise(res => setTimeout(res, 500))

  console.log(chalk.redBright('\n☰✦☰═☰  B  A  L  D  W  I  N  D    I  V  ☰═☰✦☰'))
  await new Promise(res => setTimeout(res, 700))

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
  console.log(chalk.bold.white('      SISTEMA CREADO POR: ') + chalk.bold.hex('#FFD700')('DEVLYONN 👑'))
  console.log(chalk.bold.hex('#FF00FF')('⌬═══════════════════════⌬\n'))

  await new Promise(res => setTimeout(res, 1200))
}

let isRunning = false
function start(file) {
  if (isRunning) return
  isRunning = true
  
  // ========== CAMBIADO: núcleo•clover → baldwind-core ==========
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