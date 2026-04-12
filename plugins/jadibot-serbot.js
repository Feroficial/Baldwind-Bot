/*
⚠ PROHIBIDO EDITAR ⚠ 

El codigo de este archivo fue modificado para BALDWIND IV:
- BALDWIND IV (https://github.com/Feroficial/Baldwind-IV-Bot)

Adaptacion y edición echa por:
- 🜸 𝙇𝙮𝙤𝙣𝙣𝘿𝙚𝙫 & 𝙑𝙖𝙡𝙚𝙣𝙩𝙞𝙣𝙖𝘿𝙚𝙫 🜸

⚠ PROHIBIDO EDITAR ⚠ -- ⚠ PROHIBIDO EDITAR ⚠ -- ⚠ PROHIBIDO EDITAR ⚠
*/

import { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, Browsers } from "@whiskeysockets/baileys"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import * as ws from 'ws'
import { fileURLToPath } from 'url'
import { makeWASocket } from '../lib/simple.js'
import fetch from 'node-fetch'

const { exec } = await import('child_process')
const { CONNECTING } = ws

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"

const maxSubBots = 500
let blackJBOptions = {}

if (!global.conns) global.conns = []

// ========== CONFIGURACIÓN DEL SUB-BOT ==========
const SUB_BOT_NAME = '🜸 𝘽𝘼𝙇𝘿𝙒𝙄𝙉𝘿 𝙎𝙐𝘽-𝘽𝙊𝙏 🛸'
const SUB_BOT_BIO = '—͟͟͞͞ 🜸 𝘽𝘼𝙇𝘿𝙒𝙄𝙉𝘿 𝙄𝙑 • 𝙎𝙐𝘽-𝘽𝙊𝙏 🛸 ⌬'
const SUB_BOT_PIC = 'https://files.catbox.moe/xdpxey.jpg'

const changeSubBotName = async (sock) => {
  try {
    await sock.updateProfileName(SUB_BOT_NAME)
    console.log(chalk.bold.green(`✅ Sub-Bot renombrado a: ${SUB_BOT_NAME}`))
    return true
  } catch (e) {
    console.log(chalk.bold.red(`❌ Error al cambiar nombre: ${e.message}`))
    return false
  }
}

const changeSubBotBio = async (sock) => {
  try {
    await sock.updateProfileStatus(SUB_BOT_BIO)
    console.log(chalk.bold.green(`✅ Biografía del Sub-Bot actualizada`))
    return true
  } catch (e) {
    console.log(chalk.bold.red(`❌ Error al cambiar biografía: ${e.message}`))
    return false
  }
}

const changeSubBotProfilePic = async (sock) => {
  try {
    const imgRes = await fetch(SUB_BOT_PIC)
    if (imgRes.ok) {
      const imgBuffer = Buffer.from(await imgRes.arrayBuffer())
      await sock.updateProfilePicture(imgBuffer)
      console.log(chalk.bold.green(`✅ Foto de perfil del Sub-Bot actualizada`))
    }
    return true
  } catch (e) {
    console.log(chalk.bold.red(`❌ Error al cambiar foto: ${e.message}`))
    return false
  }
}

// ========== FUNCIÓN PARA ENVIAR NOTIFICACIÓN ==========
async function sendNotification(conn, chatId, text, mentions = [], quoted = null) {
  try {
    await conn.sendMessage(chatId, { text, mentions }, { quoted })
    return true
  } catch (e) {
    console.log('Error enviando notificación:', e)
    return false
  }
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!globalThis.db.data.settings[conn.user.jid].jadibotmd) {
    return m.reply(`❌ *El comando ${command} está desactivado temporalmente*`)
  }

  // Verificar cooldown
  const user = global.db.data.users[m.sender]
  const now = Date.now()
  const cooldownTime = 120000
  
  if (user.subCooldown && now - user.subCooldown < cooldownTime) {
    const remaining = cooldownTime - (now - user.subCooldown)
    const minutes = Math.floor(remaining / 60000)
    const seconds = Math.floor((remaining % 60000) / 1000)
    return conn.reply(m.chat, `—͟͟͞͞   *🜸 𝘽𝘼𝙇𝘿𝙒𝙄𝙉𝘿 𝙄𝙑 🛸* —͟͟͞͞\n\n> ⏳ *𝙀𝙨𝙥𝙚𝙧𝙖 ${minutes} 𝙢 ${seconds} 𝙨 𝙥𝙖𝙧𝙖 𝙫𝙤𝙡𝙫𝙚𝙧 𝙖 𝙫𝙞𝙣𝙘𝙪𝙡𝙖𝙧*\n\n⌬ 𝘽𝘼𝙇𝘿𝙒𝙄𝙉𝘿 𝙄𝙑 ⌬`, m)
  }

  const subBots = [...new Set(
    global.conns.filter(c =>
      c.user && c.ws.socket && c.ws.socket.readyState !== ws.CLOSED
    ).map(c => c)
  )]

  if (subBots.length >= maxSubBots) {
    return m.reply(`❌ *No hay espacios disponibles para Sub-Bots*`)
  }

  let who = m.sender
  let id = `${who.split('@')[0]}`
  let pathblackJadiBot = path.join(process.cwd(), 'baldwind-core', 'blackJadiBot', id)

  if (!fs.existsSync(pathblackJadiBot)) {
    fs.mkdirSync(pathblackJadiBot, { recursive: true })
  }

  blackJBOptions.pathblackJadiBot = pathblackJadiBot
  blackJBOptions.m = m
  blackJBOptions.conn = conn
  blackJBOptions.args = args
  blackJBOptions.usedPrefix = usedPrefix
  blackJBOptions.command = command
  blackJBOptions.fromCommand = true
  blackJBOptions.sender = m.sender

  await blackJadiBot(blackJBOptions)
}

handler.help = ['code']
handler.tags = ['serbot']
handler.command = ['code']

export default handler

export async function blackJadiBot(options) {
  let { pathblackJadiBot, m, conn, args, usedPrefix, command, sender } = options
  
  const pathCreds = path.join(pathblackJadiBot, "creds.json")
  if (!fs.existsSync(pathblackJadiBot)) {
    fs.mkdirSync(pathblackJadiBot, { recursive: true })
  }
  
  const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")

  global.conns = global.conns || []

  exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
    const { version } = await fetchLatestBaileysVersion()
    const msgRetry = () => { }
    const msgRetryCache = new NodeCache()
    const { state, saveCreds } = await useMultiFileAuthState(pathblackJadiBot)

    const connectionOptions = {
      logger: pino({ level: "fatal" }),
      printQRInTerminal: false,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
      msgRetry,
      msgRetryCache,
      browser: Browsers.macOS("Desktop"),
      version: version,
      generateHighQualityLinkPreview: false
    }

    let sock = makeWASocket(connectionOptions)
    sock.isInit = false
    let isInit = true
    let codeSent = false
    let pairingRequestSent = false

    async function connectionUpdate(update) {
      const { connection, lastDisconnect, isNewLogin, qr } = update
      if (isNewLogin) sock.isInit = false
      
      // ========== SOLICITAR CÓDIGO DE PAREJA ==========
      if (connection === 'open' && !pairingRequestSent && !state.creds.registered) {
        pairingRequestSent = true
        const userNumber = (sender || m.sender).split('@')[0]
        
        // Notificar que se está generando el código
        await sendNotification(conn, m.chat, `—͟͟͞͞   *🜸 𝘽𝘼𝙇𝘿𝙒𝙄𝙉𝘿 𝙄𝙑 • 𝙎𝙐𝘽-𝘽𝙊𝙏 𝙎𝙄𝙎𝙏𝙀𝙈 🛸* —͟͟͞͞\n\n> 🔮 *𝙎𝙊𝙇𝙄𝘾𝙄𝙏𝙐𝘿 𝘿𝙀 𝙑𝙄𝙉𝘾𝙐𝙇𝘼𝘾𝙄𝙊́𝙉*\n> 📱 *𝙉𝙪́𝙢𝙚𝙧𝙤:* @${userNumber}\n> 🛡️ *𝙈𝙤𝙙𝙤:* 100% 𝘼𝙣𝙩𝙞-𝘽𝙖𝙣\n\n> ⏳ *𝙂𝙚𝙣𝙚𝙧𝙖𝙣𝙙𝙤 𝙘𝙤́𝙙𝙞𝙜𝙤...*\n\n👑 *🜸 𝙇𝙮𝙤𝙣𝙣𝘿𝙚𝙫 & 𝙑𝙖𝙡𝙚𝙣𝙩𝙞𝙣𝙖𝘿𝙚𝙫 🜸*`, [m.sender], m)
        
        try {
          // Esperar a que el socket esté listo
          await new Promise(resolve => setTimeout(resolve, 5000))
          
          // Solicitar código de pareja
          const code = await sock.requestPairingCode(userNumber)
          const formattedCode = code.match(/.{1,4}/g)?.join("-") || code
          
          // Enviar el código al usuario
          await sendNotification(conn, m.chat, `—͟͟͞͞   *🜸 𝘽𝘼𝙇𝘿𝙒𝙄𝙉𝘿 𝙄𝙑 • 𝙎𝙐𝘽-𝘽𝙊𝙏 𝙎𝙄𝙎𝙏𝙀𝙈 🛸* —͟͟͞͞\n\n> 🜲 *𝙏𝙐 𝘾Ó𝘿𝙄𝙂𝙊 𝙀𝙎𝙋𝙄𝙍𝙄𝙏𝙐𝘼𝙇*\n\n> 🔢 *${formattedCode}*\n\n> ⚠️ *𝙄𝙣𝙜𝙧𝙚𝙨𝙖 𝙚𝙨𝙩𝙚 𝙘ó𝙙𝙞𝙜𝙤 𝙚𝙣:*\n> 📲 𝙒𝙝𝙖𝙩𝙨𝘼𝙥𝙥 > 𝘿𝙞𝙨𝙥𝙤𝙨𝙞𝙩𝙞𝙫𝙤𝙨 𝙫𝙞𝙣𝙘𝙪𝙡𝙖𝙙𝙤𝙨 > 𝙑𝙞𝙣𝙘𝙪𝙡𝙖𝙧 𝙘𝙤𝙣 𝙣𝙪́𝙢𝙚𝙧𝙤 𝙙𝙚 𝙩𝙚𝙡𝙚́𝙛𝙤𝙣𝚘\n\n> 🛡️ *100% 𝘼𝙉𝙏𝙄-𝘽𝘼𝙉 • 𝘾𝙐𝙀𝙉𝙏𝘼 𝙋𝙍𝙄𝙉𝘾𝙄𝙋𝘼𝙇*\n\n👑 *🜸 𝙇𝙮𝙤𝙣𝙣𝘿𝙚𝙫 & 𝙑𝙖𝙡𝙚𝙣𝙩𝙞𝙣𝙖𝘿𝙚𝙫 🜸*`, [m.sender], m)
          
          console.log(chalk.bold.yellow(`📱 Código generado para ${userNumber}: ${formattedCode}`))
        } catch (e) {
          console.log(chalk.bold.red(`❌ Error al generar código: ${e.message}`))
          await sendNotification(conn, m.chat, `❌ *Error al generar el código*\n> ${e.message}\n\n🛸 *BALDWIND IV*`, [m.sender], m)
          pairingRequestSent = false
        }
      }

      const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
      if (connection === 'close') {
        if (reason === 428 || reason === 408) {
          console.log(chalk.bold.magentaBright(`\n│ La conexión (+${path.basename(pathblackJadiBot)}) fue cerrada. Reintentando...`))
          await creloadHandler(true).catch(console.error)
        }
        if (reason == 405 || reason == 401) {
          console.log(chalk.bold.magentaBright(`\n│ Sesión (+${path.basename(pathblackJadiBot)}) cerrada.`))
          fs.rmSync(pathblackJadiBot, { recursive: true, force: true })
        }
        if (reason === 500) {
          console.log(chalk.bold.magentaBright(`\n│ Conexión perdida (+${path.basename(pathblackJadiBot)})`))
          return creloadHandler(true).catch(console.error)
        }
        if (reason === 403) {
          console.log(chalk.bold.magentaBright(`\n│ Sesión cerrada (+${path.basename(pathblackJadiBot)})`))
          fs.rmSync(pathblackJadiBot, { recursive: true, force: true })
        }
      }
      
      if (connection == 'open' && state.creds.registered) {
        let userName = sock.authState.creds.me?.name || 'Anónimo'

        await new Promise(resolve => setTimeout(resolve, 3000))

        await changeSubBotName(sock)
        await changeSubBotBio(sock)
        await changeSubBotProfilePic(sock)

        // Activar cooldown
        if (sender) {
          const userData = global.db.data.users[sender]
          if (userData) {
            userData.subCooldown = Date.now()
          }
        }

        console.log(
          chalk.bold.cyanBright(
            `\n❒────────────【• SUB-BOT BALDWIND IV •】────────────❒\n│\n│ 🟢 ${userName} (+${path.basename(pathblackJadiBot)}) conectado.\n│ 👑 Creadores: LyonnDev & ValentinaDev\n│ 📛 Nuevo nombre: ${SUB_BOT_NAME}\n│\n❒────────────【• CONECTADO •】────────────❒`
          )
        )
        sock.isInit = true
        global.conns.push(sock)

        if (m?.chat) {
          await sendNotification(conn, m.chat, `—͟͟͞͞   *🜸 𝘽𝘼𝙇𝘿𝙒𝙄𝙉𝘿 𝙄𝙑 • 𝙎𝙐𝘽-𝘽𝙊𝙏 𝙎𝙄𝙎𝙏𝙀𝙈 🛸* —͟͟͞͞\n\n> 🟢 *@${(sender || m.sender).split('@')[0]}*\n\n> ⚔️ *¡𝙂𝙚𝙣𝙞𝙖𝙡! 𝙔𝙖 𝙚𝙧𝙚𝙨 𝙥𝙖𝙧𝙩𝙚 𝙙𝙚 𝙡𝙖 𝙛𝙖𝙢𝙞𝙡𝙞𝙖 𝘽𝘼𝙇𝘿𝙒𝙄𝙉𝘿*\n\n> 🜸 *𝙏𝙪 𝙣𝙪𝙚𝙫𝙤 𝙣𝙤𝙢𝙗𝙧𝙚 𝙚𝙨:* ${SUB_BOT_NAME}\n\n> 🛡️ *100% 𝘼𝙉𝙏𝙄-𝘽𝘼𝙉 • 𝘾𝙐𝙀𝙉𝙏𝘼 𝙋𝙍𝙄𝙉𝘾𝙄𝙋𝘼𝙇*\n\n> ⚠️ *𝙍𝙚𝙘𝙪𝙚𝙧𝙙𝙖:* 𝙇𝙤𝙨 𝙎𝙪𝙗-𝘽𝙤𝙩𝙨 𝙨𝙤𝙣 𝙨𝙞𝙢𝙥𝙡𝙚𝙨 𝙥𝙞𝙤𝙣𝙚𝙨 𝙖𝙡 𝙨𝙚𝙧𝙫𝙞𝙘𝙞𝙤 𝙙𝙚𝙡 𝙍𝙚𝙞𝙣𝙤*\n\n👑 *🜸 𝙇𝙮𝙤𝙣𝙣𝘿𝙚𝙫 & 𝙑𝙖𝙡𝙚𝙣𝙩𝙞𝙣𝙖𝘿𝙚𝙫 🜸*`, [m.sender], m)
        }
      }
    }

    setInterval(async () => {
      if (!sock.user) {
        try { sock.ws?.close() } catch { }
        sock.ev.removeAllListeners()
        let i = global.conns.indexOf(sock)
        if (i < 0) return
        delete global.conns[i]
        global.conns.splice(i, 1)
      }
    }, 60000)

    let handler = await import('../baldwind-core/handler.js')
    
    let creloadHandler = async function (restatConn) {
      try {
        const Handler = await import(`../baldwind-core/handler.js?update=${Date.now()}`).catch(console.error)
        if (Object.keys(Handler || {}).length) handler = Handler
      } catch (e) { }
      if (restatConn) {
        const oldChats = sock.chats
        try { sock.ws?.close() } catch { }
        sock.ev.removeAllListeners()
        sock = makeWASocket(connectionOptions, { chats: oldChats })
        isInit = true
      }
      if (!isInit) {
        sock.ev.off("messages.upsert", sock.handler)
        sock.ev.off("connection.update", sock.connectionUpdate)
        sock.ev.off('creds.update', sock.credsUpdate)
      }
      sock.handler = handler.handler.bind(sock)
      sock.connectionUpdate = connectionUpdate.bind(sock)
      sock.credsUpdate = saveCreds.bind(sock)
      sock.ev.on("messages.upsert", sock.handler)
      sock.ev.on("connection.update", sock.connectionUpdate)
      sock.ev.on("creds.update", sock.credsUpdate)
      isInit = false
      return true
    }
    creloadHandler(false)
  })
}