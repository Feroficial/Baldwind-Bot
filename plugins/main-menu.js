import { xpRange } from '../lib/levelling.js'
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

const charset = { a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ꜰ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',l:'ʟ',m:'ᴍ',n:'ɴ',o:'ᴏ',p:'ᴘ',q:'ǫ',r:'ʀ',s:'ꜱ',t:'ᴛ',u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ' }
const textCyberpunk = t => t.toLowerCase().replace(/[a-z]/g, c => charset[c])

// ========= DETECCIÓN SUBBOT =========
const isSubBot = (conn) => {
  return global.conns?.some(bot => bot.user?.jid === conn.user?.jid)
}

const getBotTypeText = (conn) => {
  return isSubBot(conn)
    ? { icon: '🜸', name: 'ꜱᴜʙ-ʙᴏᴛ', status: '🟣 ᴀᴄᴛɪᴠᴏ ᴄᴏᴍᴏ ꜱᴜʙ-ʙᴏᴛ' }
    : { icon: '👑', name: 'ʙᴏᴛ ᴘʀɪɴᴄɪᴘᴀʟ', status: '🔴 ɴᴜ́ᴄʟᴇᴏ ᴘʀɪɴᴄɪᴘᴀʟ' }
}

// ========= MENÚ =========
const defaultMenu = {
  before: `
—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »
> 🪐 ɴᴏᴍʙʀᴇ   » %name
> 🌐 ᴍᴏᴅᴏ      » %mode
> ⏳ ᴀᴄᴛɪᴠᴏ   » %muptime
> 👥 ᴜꜱᴜᴀʀɪᴏꜱ » %totalreg
> 🤖 %botIcon *%botName*
> 📌 %botStatus
> 📊 ᴄᴏᴍᴀɴᴅᴏꜱ: %totalCmds

✦ 𝗕𝗔𝗟𝗗𝗪𝗜𝗡𝗗 𝗜𝗩 • 𝗘𝗟𝗜𝗧𝗘 ✦
❤️ ᴄʀᴇᴀᴅᴏʀᴇs: ✧ ʟʏᴏɴɴᴅᴇᴠ ❤️ ᴠᴀʟᴇɴᴛɪɴᴀᴅᴇᴠ ✧
%readmore
`.trimStart(),

  header: '\n⧼⋆꙳•〔 🛸 %category 〕⋆꙳•⧽',
  body: '> 🔖 %cmd',
  footer: '╰⋆꙳•❅‧*₊⋆꙳︎‧*❆₊⋆╯',

  after: `
⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ 🧬
❤️ ʟʏᴏɴɴᴅᴇᴠ × ᴠᴀʟᴇɴᴛɪɴᴀᴅᴇᴠ ❤️
`.trim()
}

// ========= ARCHIVOS =========
const menuDir = './media/menu'
fs.mkdirSync(menuDir, { recursive: true })

const getMenuMediaFile = jid =>
  path.join(menuDir, `menuMedia_${jid.replace(/[:@.]/g, '_')}.json`)

const loadMenuMedia = jid => {
  const file = getMenuMediaFile(jid)
  if (!fs.existsSync(file)) return {}
  try { return JSON.parse(fs.readFileSync(file)) } catch { return {} }
}

const fetchBuffer = async url =>
  Buffer.from(await (await fetch(url)).arrayBuffer())

const defaultVideo = await fetchBuffer('https://files.catbox.moe/jbiz6v.mp4')

// ========= HANDLER =========
let handler = async (m, { conn, usedPrefix }) => {

  await conn.sendMessage(m.chat, { react: { text: '⚔️', key: m.key } })

  const botJid = conn.user.jid
  const menuMedia = loadMenuMedia(botJid)
  const menu = global.subBotMenus?.[botJid] || defaultMenu
  const botType = getBotTypeText(conn)

  const user = global.db.data.users[m.sender] || { level: 0, exp: 0 }

  let totalComandos = 0
  let comandosPorTag = {}

  const plugins = Object.values(global.plugins || {}).filter(p => !p.disabled)

  for (const plugin of plugins) {
    const cmds = [].concat(plugin.help || [])
    const tags = [].concat(plugin.tags || [])

    totalComandos += cmds.length

    for (const tag of tags) {
      if (!comandosPorTag[tag]) comandosPorTag[tag] = []
      comandosPorTag[tag].push(...cmds)
    }
  }

  const tagsMap = {}
  for (const tag in comandosPorTag) {
    tagsMap[tag] = textCyberpunk(tag)
  }

  const replace = {
    name: await conn.getName(m.sender),
    totalreg: Object.keys(global.db.data.users).length,
    mode: global.opts.self ? 'Privado' : 'Público',
    muptime: clockString(process.uptime() * 1000),
    readmore: String.fromCharCode(8206).repeat(4001),
    botIcon: botType.icon,
    botName: botType.name,
    botStatus: botType.status,
    totalCmds: totalComandos
  }

  let text = menu.before

  for (const tag in comandosPorTag) {
    const cmds = comandosPorTag[tag]
      .map(cmd => menu.body.replace('%cmd', usedPrefix + cmd))
      .join('\n')

    text += `\n${menu.header.replace('%category', `${tagsMap[tag]} (${comandosPorTag[tag].length})`)}\n${cmds}\n${menu.footer}`
  }

  text += `\n${menu.after}`

  for (const key in replace) {
    text = text.replace(new RegExp(`%${key}`, 'g'), replace[key])
  }

  const video = menuMedia.video && fs.existsSync(menuMedia.video)
    ? fs.readFileSync(menuMedia.video)
    : defaultVideo

  await conn.sendMessage(m.chat, {
    video,
    gifPlayback: false,
    caption: text
  }, { quoted: m })
}

// ========= CONFIG =========
handler.help = ['menu', 'menú']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help', 'ayuda']
handler.register = false

export default handler

// ========= TIEMPO =========
const clockString = ms =>
  [3600000, 60000, 1000].map((v, i) =>
    String(Math.floor(ms / v) % (i ? 60 : 99)).padStart(2, '0')
  ).join(':')