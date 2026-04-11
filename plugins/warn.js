// ⚔️ Código creado por 🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸
// 🛡️ BALDWIND IV - SISTEMA DE ADVERTENCIAS CON RAZÓN

let handler = async (m, { conn, usedPrefix, command, text, isAdmin, isBotAdmin }) => {
  if (!m.isGroup) return m.reply(`❌ *Este comando solo funciona en grupos*`)

  if (!isAdmin) return m.reply(`❌ *Solo los administradores pueden advertir usuarios*`)

  if (!isBotAdmin) return m.reply(`❌ *El bot necesita ser administrador para expulsar*`)

  let mentioned = m.mentionedJid && m.mentionedJid[0]
  if (!mentioned) return m.reply(`❌ *Menciona al usuario que quieres advertir*\n\n📌 *Ejemplo:*\n${usedPrefix + command} @usuario razón de la advertencia`)

  if (mentioned === m.sender) return m.reply(`❌ *No puedes advertirte a ti mismo*`)

  let razon = text.replace(`@${mentioned.split('@')[0]}`, '').trim()
  if (!razon) return m.reply(`❌ *Escribe la razón de la advertencia*\n\n📌 *Ejemplo:*\n${usedPrefix + command} @usuario Spam en el grupo`)

  let user = global.db.data.users[mentioned]
  if (!user) {
    global.db.data.users[mentioned] = { warns: 0 }
    user = global.db.data.users[mentioned]
  }

  if (!user.warns) user.warns = 0

  user.warns += 1

  let warnsLeft = 3 - user.warns

  if (user.warns >= 3) {
    await conn.groupParticipantsUpdate(m.chat, [mentioned], 'remove')
    
    let kickMsg = `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n`
    kickMsg += `> 🚫 *USUARIO EXPULSADO* 🚫\n\n`
    kickMsg += `✦ 𝗗𝗘𝗧𝗔𝗟𝗟𝗘𝗦 ✦\n`
    kickMsg += `> 👤 *Usuario:* @${mentioned.split('@')[0]}\n`
    kickMsg += `> ⚠️ *Advertencias:* ${user.warns}/3\n`
    kickMsg += `> 📝 *Última razón:* ${razon}\n`
    kickMsg += `> 📌 *Motivo:* Máximo de advertencias alcanzado\n\n`
    kickMsg += `👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*\n`
    kickMsg += `⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ ᴄʏʙᴇʀ ᴍᴇɴᴜ 🧬`
    
    await conn.sendMessage(m.chat, { text: kickMsg, mentions: [mentioned] })
    
    delete user.warns
  } else {
    let warnMsg = `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n`
    warnMsg += `> ⚠️ *ADVERTENCIA* ⚠️\n\n`
    warnMsg += `✦ 𝗗𝗘𝗧𝗔𝗟𝗟𝗘𝗦 ✦\n`
    warnMsg += `> 👤 *Usuario:* @${mentioned.split('@')[0]}\n`
    warnMsg += `> 📝 *Razón:* ${razon}\n`
    warnMsg += `> 📊 *Advertencias:* ${user.warns}/3\n`
    warnMsg += `> ⚠️ *Restantes:* ${warnsLeft}\n\n`
    warnMsg += `⧼⋆꙳•〔 🛸 𝗕𝗔𝗟𝗗𝗪𝗜𝗡𝗗 𝗜𝗩 〕⋆꙳•⧽\n`
    warnMsg += `> 👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*\n`
    warnMsg += `╰⋆꙳•❅‧*₊⋆꙳︎‧*❆₊⋆╯\n`
    warnMsg += `⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ ᴄʏʙᴇʀ ᴍᴇɴᴜ 🧬`
    
    await conn.sendMessage(m.chat, { text: warnMsg, mentions: [mentioned] })
  }

  await global.db.write()
}

handler.help = ['balwind @usuario <razón>']
handler.tags = ['grupo']
handler.command = ['advertencia', 'balwind', 'advertir']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler