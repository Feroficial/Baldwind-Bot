/*
⚠ PROHIBIDO EDITAR ⚠ 
SISTEMA DE SUB-BOTS PARA BALDWIND IV
Creado por: 🜸 𝙇𝙮𝙤𝙣𝙣𝘿𝙚𝙫 & 𝙑𝙖𝙡𝙚𝙣𝙩𝙞𝙣𝙖𝘿𝙚𝙫 🜸
*/

import { useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, Browsers } from "@whiskeysockets/baileys"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import * as ws from 'ws'
import { fileURLToPath } from 'url'
import { makeWASocket } from '../lib/simple.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const maxSubBots = 500

if (!global.conns) global.conns = []

// ========== CONFIGURACIÓN DEL SUB-BOT ==========
const SUB_BOT_NAME = '🜸 𝘽𝘼𝙇𝘿𝙒𝙄𝙉𝘿 𝙎𝙐𝘽-𝘽𝙊𝙏 🛸'
const SUB_BOT_BIO = '—͟͟͞͞ 🜸 𝘽𝘼𝙇𝘿𝙒𝙄𝙉𝘿 𝙄𝙑 • 𝙎𝙐𝘽-𝘽𝙊𝙏 🛸 ⌬'
const SUB_BOT_PIC = 'https://files.catbox.moe/xdpxey.jpg'

// ========== HANDLER DEL COMANDO ==========
let handler = async (m, { conn, usedPrefix }) => {
  // Verificar si la función está activada
  if (global.db.data.settings[conn.user.jid]?.jadibotmd === false) {
    return m.reply(`❌ *El sistema de Sub-Bots está desactivado*\n\n> Usa *${usedPrefix}jadibot on* para activarlo`)
  }

  // Verificar cooldown (2 minutos)
  const user = global.db.data.users[m.sender]
  const now = Date.now()
  const cooldownTime = 120000
  
  if (user.subCooldown && now - user.subCooldown < cooldownTime) {
    const remaining = cooldownTime - (now - user.subCooldown)
    const minutes = Math.floor(remaining / 60000)
    const seconds = Math.floor((remaining % 60000) / 1000)
    return m.reply(`—͟͟͞͞   *🜸 𝘽𝘼𝙇𝘿𝙒𝙄𝙉𝘿 𝙄𝙑 🛸* —͟͟͞͞\n\n> ⏳ *Espera ${minutes}m ${seconds}s para volver a vincular*\n\n👑 *🜸 𝙇𝙮𝙤𝙣𝙣𝘿𝙚𝙫 🜸*`)
  }

  // Verificar límite de sub-bots
  const activeSubBots = global.conns.filter(c => c.user && c.ws?.socket?.readyState === ws.OPEN).length
  if (activeSubBots >= maxSubBots) {
    return m.reply(`❌ *Límite de Sub-Bots alcanzado (${maxSubBots})*`)
  }

  // Mensaje inicial
  await m.reply(`—͟͟͞͞   *🜸 𝘽𝘼𝙇𝘿𝙒𝙄𝙉𝘿 𝙄𝙑 • 𝙎𝙐𝘽-𝘽𝙊𝙏 🛸* —͟͟͞͞

> 🔮 *INICIANDO VINCULACIÓN*
> 📱 *Número:* ${m.sender.split('@')[0]}

> ⏳ *Generando código mágico...*

👑 *🜸 𝙇𝙮𝙤𝙣𝙣𝘿𝙚𝙫 🜸*`)

  // Crear carpeta para el usuario
  const userDir = path.join(process.cwd(), 'baldwind-core', 'blackJadiBot', m.sender.split('@')[0])
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true })
  }

  // Iniciar el sub-bot
  await startSubBot(m, conn, userDir)
}

handler.help = ['code', 'jadibot', 'serbot']
handler.tags = ['jadibot']
handler.command = /^(code|jadibot|serbot|subbot)$/i

export default handler

// ========== FUNCIÓN PRINCIPAL DEL SUB-BOT ==========
async function startSubBot(m, mainConn, sessionPath) {
  try {
    const { version } = await fetchLatestBaileysVersion()
    const msgRetryCache = new NodeCache()
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath)

    const sock = makeWASocket({
      logger: pino({ level: "silent" }),
      printQRInTerminal: false,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
      },
      browser: Browsers.macOS("Desktop"),
      version: version,
      generateHighQualityLinkPreview: false,
      defaultQueryTimeoutMs: undefined,
      keepAliveIntervalMs: 30000
    })

    let codeSent = false
    let pairingComplete = false
    let isConnected = false
    
    // Guardar dueño del sub-bot
    sock.subBotOwner = m.sender
    sock.subBotOwnerName = m.pushName || 'Anónimo'
    sock.subBotChatId = m.chat

    // ========== PRIMERO: SOLICITAR EL CÓDIGO INMEDIATAMENTE ==========
    // No esperar a connection.update, hacerlo directamente
    const userNumber = m.sender.split('@')[0]
    
    // Esperar un poco para que el socket se inicialice
    setTimeout(async () => {
      if (!codeSent && !state.creds.registered) {
        codeSent = true
        try {
          console.log(chalk.bold.yellow(`🔑 Solicitando código para: ${userNumber}`))
          
          // Solicitar código de pareja
          const code = await sock.requestPairingCode(userNumber)
          const formattedCode = code.match(/.{1,4}/g)?.join("-") || code
          
          // Enviar el código al usuario
          await mainConn.sendMessage(m.chat, {
            text: `—͟͟͞͞   *🜸 𝘽𝘼𝙇𝘿𝙒𝙄𝙉𝘿 𝙄𝙑 • 𝙎𝙐𝘽-𝘽𝙊𝙏 🛸* —͟͟͞͞

> 🜲 *TU CÓDIGO ESPIRITUAL*

> 🔢 *${formattedCode}*

> ⚠️ *Ingresa este código en:*
> 📲 WhatsApp > Dispositivos vinculados > Vincular con número de teléfono

> ⏳ *El código expira en 5 minutos*

> 🛡️ *100% ANTI-BAN • CUENTA PRINCIPAL*

👑 *🜸 𝙇𝙮𝙤𝙣𝙣𝘿𝙚𝙫 🜸*`,
            mentions: [m.sender]
          })
          
          console.log(chalk.bold.green(`✅ Código enviado a ${userNumber}: ${formattedCode}`))
        } catch (e) {
          console.log(chalk.bold.red(`❌ Error al generar código: ${e.message}`))
          await mainConn.sendMessage(m.chat, {
            text: `❌ *Error al generar el código*\n> ${e.message}\n\n> ⚠️ *Asegúrate de que el número sea correcto*\n> 📱 *Tu número:* ${userNumber}\n\n🛸 *BALDWIND IV*`,
            mentions: [m.sender]
          })
          codeSent = false
        }
      }
    }, 3000) // Esperar 3 segundos para que el socket se inicialice

    // Evento de actualización de conexión
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update
      const statusCode = lastDisconnect?.error?.output?.statusCode

      // Si hay QR, también lo mostramos como fallback
      if (qr && !codeSent && !state.creds.registered) {
        console.log(chalk.bold.yellow(`📱 QR generado para ${userNumber}, pero se prefiere código`))
      }

      // ========== CONEXIÓN EXITOSA ==========
      if (connection === 'open' && state.creds.registered && !pairingComplete) {
        pairingComplete = true
        isConnected = true
        
        // Configurar el sub-bot
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        try {
          await sock.updateProfileName(SUB_BOT_NAME)
          await sock.updateProfileStatus(SUB_BOT_BIO)
          const imgRes = await fetch(SUB_BOT_PIC)
          if (imgRes.ok) {
            const imgBuffer = Buffer.from(await imgRes.arrayBuffer())
            await sock.updateProfilePicture(imgBuffer)
          }
        } catch(e) {}
        
        // Guardar cooldown
        const user = global.db.data.users[m.sender]
        if (user) user.subCooldown = Date.now()
        
        // Agregar a la lista de sub-bots activos
        global.conns.push(sock)
        
        console.log(chalk.bold.green(`✅ Sub-Bot conectado: ${m.sender.split('@')[0]}`))
        
        // ========== NOTIFICACIÓN DE CONEXIÓN EXITOSA ==========
        await mainConn.sendMessage(m.chat, {
          text: `—͟͟͞͞   *🜸 𝘽𝘼𝙇𝘿𝙒𝙄𝙉𝘿 𝙄𝙑 • 𝙎𝙐𝘽-𝘽𝙊𝙏 🛸* —͟͟͞͞

> 🟢 *¡VINCULACIÓN EXITOSA!*

> ⚔️ *@${m.sender.split('@')[0]} ahora es un Sub-Bot de BALDWIND IV*

> 🜸 *Nombre:* ${SUB_BOT_NAME}
> 📊 *Estado:* 🟢 CONECTADO
> ⏰ *Hora:* ${new Date().toLocaleTimeString()}

> 🛡️ *100% ANTI-BAN*

> ⚠️ *Recuerda: Los Sub-Bots son simples peones al servicio del Reino*

👑 *🜸 𝙇𝙮𝙤𝙣𝙣𝘿𝙚𝙫 🜸*`,
          mentions: [m.sender]
        })

        // Enviar mensaje privado al dueño
        try {
          await mainConn.sendMessage(m.sender, {
            text: `—͟͟͞͞   *🜸 𝘽𝘼𝙇𝘿𝙒𝙄𝙉𝘿 𝙄𝙑 🛸* —͟͟͞͞

> 🟢 *TU SUB-BOT ESTÁ ACTIVO*

> ⚔️ *¡Bienvenido al ejército de BALDWIND IV!*

> 📌 *Comandos disponibles:*
> • *#menusub* - Ver menú de sub-bot
> • *#infosub* - Información del sub-bot

👑 *🜸 𝙇𝙮𝙤𝙣𝙣𝘿𝙚𝙫 🜸*`
          })
        } catch(e) {}
      }

      // ========== DESCONEXIÓN ==========
      if (connection === 'close') {
        isConnected = false
        
        if (statusCode === 401 || statusCode === 405 || statusCode === 403) {
          console.log(chalk.bold.red(`❌ Sub-Bot eliminado: ${m.sender.split('@')[0]}`))
          
          await mainConn.sendMessage(m.chat, {
            text: `—͟͟͞͞   *🜸 𝘽𝘼𝙇𝘿𝙒𝙄𝙉𝘿 𝙄𝙑 • 𝙎𝙐𝘽-𝘽𝙊𝙏 🛸* —͟͟͞͞

> 🔴 *SUB-BOT DESVINCULADO*

> ⚔️ *@${m.sender.split('@')[0]} ya no es Sub-Bot*

> 📌 *Motivo:* Sesión cerrada permanentemente

> 💫 *Puedes volver a vincular con #code*

👑 *🜸 𝙇𝙮𝙤𝙣𝙣𝘿𝙚𝙫 🜸*`,
            mentions: [m.sender]
          })
          
          fs.rmSync(sessionPath, { recursive: true, force: true })
          const index = global.conns.indexOf(sock)
          if (index !== -1) global.conns.splice(index, 1)
          
        } else if (statusCode === 428 || statusCode === 408 || statusCode === 500) {
          console.log(chalk.bold.yellow(`⚠️ Sub-Bot desconectado, reconectando...`))
          
          await mainConn.sendMessage(m.chat, {
            text: `—͟͟͞͞   *🜸 𝘽𝘼𝙇𝘿𝙒𝙄𝙉𝘿 𝙄𝙑 • 𝙎𝙐𝘽-𝘽𝙊𝙏 🛸* —͟͟͞͞

> 🟡 *SUB-BOT DESCONECTADO*

> ⚔️ *@${m.sender.split('@')[0]}*

> 📌 *Motivo:* Pérdida de conexión
> 🔄 *Reconectando automáticamente...*

> ⏰ *Hora:* ${new Date().toLocaleTimeString()}

👑 *🜸 𝙇𝙮𝙤𝙣𝙣𝘿𝙚𝙫 🜸*`,
            mentions: [m.sender]
          })
        } else {
          console.log(chalk.bold.yellow(`⚠️ Sub-Bot desconectado: ${m.sender.split('@')[0]}`))
          
          await mainConn.sendMessage(m.chat, {
            text: `—͟͟͞͞   *🜸 𝘽𝘼𝙇𝘿𝙒𝙄𝙉𝘿 𝙄𝙑 • 𝙎𝙐𝘽-𝘽𝙊𝙏 🛸* —͟͟͞͞

> 🟠 *SUB-BOT DESCONECTADO*

> ⚔️ *@${m.sender.split('@')[0]}*

> 📌 *Motivo:* Conexión cerrada

> 💫 *Usa #code para volver a vincular*

👑 *🜸 𝙇𝙮𝙤𝙣𝙣𝘿𝙚𝙫 🜸*`,
            mentions: [m.sender]
          })
        }
      }

      // ========== RECONEXIÓN EXITOSA ==========
      if (connection === 'open' && !isConnected && pairingComplete) {
        isConnected = true
        console.log(chalk.bold.green(`✅ Sub-Bot reconectado: ${m.sender.split('@')[0]}`))
        
        await mainConn.sendMessage(m.chat, {
          text: `—͟͟͞͞   *🜸 𝘽𝘼𝙇𝘿𝙒𝙄𝙉𝘿 𝙄𝙑 • 𝙎𝙐𝘽-𝘽𝙊𝙏 🛸* —͟͟͞͞

> 🟢 *SUB-BOT RECONECTADO*

> ⚔️ *@${m.sender.split('@')[0]}*

> 📌 *Conexión restablecida exitosamente*
> ⏰ *Hora:* ${new Date().toLocaleTimeString()}

> 🛡️ *Servicio restaurado*

👑 *🜸 𝙇𝙮𝙤𝙣𝙣𝘿𝙚𝙫 🜸*`,
          mentions: [m.sender]
        })
      }
    })

    // Guardar credenciales
    sock.ev.on('creds.update', saveCreds)

  } catch (e) {
    console.log(chalk.bold.red(`❌ Error en Sub-Bot: ${e.message}`))
    await mainConn.sendMessage(m.chat, {
      text: `❌ *Error al iniciar Sub-Bot*\n> ${e.message}`,
      mentions: [m.sender]
    })
  }
}