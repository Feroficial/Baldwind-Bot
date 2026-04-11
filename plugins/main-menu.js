import { xpRange } from '../lib/levelling.js'
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

const charset = { a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ꜰ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',l:'ʟ',m:'ᴍ',n:'ɴ',o:'ᴏ',p:'ᴘ',q:'ǫ',r:'ʀ',s:'ꜱ',t:'ᴛ',u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ' }
const textCyberpunk = t => t.toLowerCase().replace(/[a-z]/g, c => charset[c])

// Función para detectar si es Sub-Bot
const isSubBot = (conn) => {
  if (global.conns && Array.isArray(global.conns)) {
    return global.conns.some(bot => bot.user?.jid === conn.user?.jid)
  }
  return false
}

// Función para obtener el tipo de bot
const getBotType = (conn) => {
  const subBot = isSubBot(conn)
  if (subBot) {
    return { icon: '🜸', name: 'ꜱᴜʙ-ʙᴏᴛ', color: '🟣' }
  } else {
    return { icon: '👑', name: 'ʙᴏᴛ ᴘʀɪɴᴄɪᴘᴀʟ', color: '🔴' }
  }
}

const defaultMenu = {
  before: `
—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »
> 🪐 ɴᴏᴍʙʀᴇ   » %name
> 🌐 ᴍᴏᴅᴏ      » %mode
> ⏳ ᴀᴄᴛɪᴠᴏ   » %muptime
> 👥 ᴜꜱᴜᴀʀɪᴏꜱ » %totalreg
> 🤖 %botIcon *%botName*
> 📊 ᴄᴏᴍᴀɴᴅᴏꜱ: %totalCmds

✦  𝗕𝗔𝗟𝗗𝗪𝗜𝗡𝗗 𝗜𝗩  •  𝗘𝗟𝗜𝗧𝗘 𝗠𝗘𝗡𝗨  ✦
👑  ᴄʀᴇᴀᴅᴏʀ:  ★  ᴅᴇᴠʟʏᴏɴɴ  ★
%readmore
`.trimStart(),
  header: '\n⧼⋆꙳•〔 🛸 %category (%count) 〕⋆꙳•⧽',
  body: '> 🔖 %cmd',
  footer: '╰⋆꙳•❅‧*₊⋆꙳︎‧*❆₊⋆╯',
  after: '\n⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ ᴄʏʙᴇʀ ᴍᴇɴᴜ 🧬 - ᴄᴏɴᴇᴄᴛᴀᴅᴏ ᴘᴏʀ: ᴅᴇᴠʟʏᴏɴɴ'
}

const menuDir = './media/menu'
if (!fs.existsSync(menuDir)) {
  fs.mkdirSync(menuDir, { recursive: true })
}

const getMenuMediaFile = jid =>
  path.join(menuDir, `menuMedia_${jid.replace(/[:@.]/g, '_')}.json`)

const loadMenuMedia = jid => {
  try {
    const file = getMenuMediaFile(jid)
    if (!fs.existsSync(file)) return {}
    return JSON.parse(fs.readFileSync(file))
  } catch (e) {
    return {}
  }
}

const fetchBuffer = async (url) => {
  try {
    const res = await fetch(url)
    return Buffer.from(await res.arrayBuffer())
  } catch (e) {
    console.log('Error cargando video:', e.message)
    return null
  }
}

// Video opcional (si falla, no afecta el menú)
let defaultVideo = null
try {
  defaultVideo = await fetchBuffer('https://files.catbox.moe/acpp5g.mp4')
} catch (e) {
  console.log('Video no disponible')
}

let handler = async (m, { conn, usedPrefix }) => {
  try {
    await conn.sendMessage(m.chat, { react: { text: '⚔️', key: m.key } })

    const botJid = conn.user.jid
    const menuMedia = loadMenuMedia(botJid)
    const menu = global.subBotMenus?.[botJid] || defaultMenu
    
    const botType = getBotType(conn)
    
    const user = global.db?.data?.users?.[m.sender] || { level: 0, exp: 0 }
    const { min, xp } = xpRange(user.level || 0, global.multiplier || 1)

    // ========== CONTADOR DE COMANDOS ==========
    let totalComandos = 0
    let comandosPorTag = new Map()
    
    const help = Object.values(global.plugins || {})
      .filter(p => p && !p.disabled)
      .map(p => ({
        help: [].concat(p.help || []),
        tags: [].concat(p.tags || []),
        prefix: 'customPrefix' in p
      }))

    // Contar comandos totales y por tag
    for (const plugin of help) {
      const cmdCount = plugin.help.length
      totalComandos += cmdCount
      
      for (const tag of plugin.tags) {
        if (tag) {
          if (!comandosPorTag.has(tag)) {
            comandosPorTag.set(tag, 0)
          }
          comandosPorTag.set(tag, comandosPorTag.get(tag) + cmdCount)
        }
      }
    }

    // Traducir tags
    const tagsMap = { main: 'ꜱɪꜱᴛᴇᴍᴀ', group: 'ɢʀᴜᴘᴏꜱ', serbot: 'ꜱᴜʙ ʙᴏᴛꜱ' }
    for (const { tags: tg } of help) {
      for (const t of tg) {
        if (t && !tagsMap[t]) tagsMap[t] = textCyberpunk(t)
      }
    }

    const replace = {
      name: await conn.getName(m.sender).catch(() => 'Anónimo'),
      level: user.level || 0,
      exp: (user.exp || 0) - (min || 0),
      maxexp: xp || 1,
      totalreg: Object.keys(global.db?.data?.users || {}).length || 0,
      mode: global.opts?.self ? 'Privado' : 'Público',
      muptime: clockString(process.uptime() * 1000),
      readmore: String.fromCharCode(8206).repeat(4001),
      botIcon: botType.icon,
      botName: botType.name,
      totalCmds: totalComandos
    }

    // Construir menú con contadores por categoría
    const text = [
      menu.before,
      ...Object.keys(tagsMap).map(tag => {
        const cmds = help
          .filter(p => p.tags && p.tags.includes(tag))
          .flatMap(p => p.help.map(c =>
            menu.body.replace('%cmd', p.prefix ? c : usedPrefix + c)
          )).join('\n')
        if (!cmds) return ''
        const cmdCount = comandosPorTag.get(tag) || 0
        return `${menu.header.replace('%category', tagsMap[tag]).replace('%count', cmdCount)}\n${cmds}\n${menu.footer}`
      }).filter(t => t),
      menu.after
    ].join('\n').replace(/%(\w+)/g, (_, k) => replace[k] ?? '')

    const video = (menuMedia.video && fs.existsSync(menuMedia.video))
      ? fs.readFileSync(menuMedia.video)
      : defaultVideo

    // SOLO BOTÓN PEDIR CODE
    const messageOptions = {
      caption: text,
      footer: '🧠 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ • ᴄʏʙᴇʀ ꜱʏꜱᴛᴇᴍ ☘️',
      buttons: [
        { buttonId: `${usedPrefix}code`, buttonText: { displayText: '🕹 PEDIR CODE' }, type: 1 }
      ],
      contextInfo: {
        externalAdReply: {
          title: 'ʙᴀʟᴅᴡɪɴᴅ ɪᴠ | ᴄʏʙᴇʀ ᴠᴇʀꜱɪᴏɴ',
          body: '┊࣪ ˖ ᴄʀᴇᴀᴅᴏ ʙʏ • ᴅᴇᴠʟʏᴏɴɴ ♱',
          thumbnail: null,
          sourceUrl: 'https://github.com/Feroficial/Baldwind-IV-Bot.git',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }

    if (video && video.length > 1000) {
      await conn.sendMessage(m.chat, { video, gifPlayback: false, ...messageOptions }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, { text: text, ...messageOptions }, { quoted: m })
    }

  } catch (error) {
    console.error('Error en menu:', error)
    await conn.sendMessage(m.chat, { 
      text: `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ⚠️ *Error al cargar el menú*\n> 📌 Usa *${usedPrefix}help* para ver comandos\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*` 
    }, { quoted: m })
  }
}

handler.help = ['menu', 'menú']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help', 'ayuda']
handler.register = true

export default handler

const clockString = ms => {
  if (!ms || isNaN(ms)) return '00:00:00'
  return [3600000, 60000, 1000].map((v, i) =>
    String(Math.floor(ms / v) % (i ? 60 : 99)).padStart(2, '0')
  ).join(':')
}
