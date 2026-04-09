// ⚔️ Código creado por 🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸
// 🛡️ BALDWIND IV - EXPULSAR DEL CLAN

let handler = async (m, { conn, usedPrefix, text, command }) => {
  let user = global.db.data.users[m.sender]
  
  if (!user.clan) {
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *NO PERTENECES A NINGÚN CLAN*\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  let mentioned = m.mentionedJid && m.mentionedJid[0]
  if (!mentioned && text) {
    mentioned = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
  }
  
  if (!mentioned) {
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 🜸 *EXPULSAR DEL CLAN*\n\n✦ 𝗨𝗦𝗢 ✦\n> 📌 *${usedPrefix + command} @tag*\n\n🎯 *Ejemplo:*\n> ${usedPrefix + command} @usuario\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  if (mentioned === m.sender) {
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *NO PUEDES EXPULSARTE A TI MISMO*\n> 📌 Usa *${usedPrefix}salirclan*\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  const clan = global.db.data.clans[user.clan]
  if (!clan) {
    user.clan = null
    await global.db.write()
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *EL CLAN YA NO EXISTE*\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  // Verificar rango (solo líder y co-líder pueden expulsar)
  const rango = user.clanRank || 'miembro'
  const rangosPermitidos = ['líder', 'co-líder']
  if (!rangosPermitidos.includes(rango)) {
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *NO TIENES PERMISO PARA EXPULSAR*\n> 📌 Solo líder y co-líder pueden expulsar\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  // Verificar que el usuario esté en el clan
  if (!clan.members.includes(mentioned)) {
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *EL USUARIO NO PERTENECE A TU CLAN*\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  // No se puede expulsar al líder
  if (mentioned === clan.leader) {
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *NO PUEDES EXPULSAR AL LÍDER DEL CLAN*\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  // Expulsar
  clan.members = clan.members.filter(m => m !== mentioned)
  const expelledUser = global.db.data.users[mentioned]
  if (expelledUser) {
    expelledUser.clan = null
    expelledUser.clanRank = null
  }
  
  await global.db.write()
  
  let textMsg = `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n`
  textMsg += `> 🚫 *USUARIO EXPULSADO* 🚫\n\n`
  textMsg += `✦ 𝗗𝗘𝗧𝗔𝗟𝗟𝗘𝗦 ✦\n`
  textMsg += `> 🏰 *Clan:* ${clan.name}\n`
  textMsg += `> 👤 *Expulsado:* @${mentioned.split('@')[0]}\n`
  textMsg += `> 👑 *Expulsado por:* @${m.sender.split('@')[0]}\n\n`
  textMsg += `⧼⋆꙳•〔 🛸 𝗕𝗔𝗟𝗗𝗪𝗜𝗡𝗗 𝗜𝗩 〕⋆꙳•⧽\n`
  textMsg += `> 👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*\n`
  textMsg += `╰⋆꙳•❅‧*₊⋆꙳︎‧*❆₊⋆╯\n`
  textMsg += `⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ ᴄʏʙᴇʀ ᴍᴇɴᴜ 🧬`
  
  await conn.sendMessage(m.chat, { text: textMsg, mentions: [m.sender, mentioned] }, { quoted: m })
}

handler.help = ['expulsar @tag']
handler.tags = ['clan']
handler.command = ['expulsar', 'kickclan']
handler.register = false

export default handler