// ⚔️ Código creado por 🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸
// 🛡️ BALDWIND IV - UNIRSE A CLAN

let handler = async (m, { conn, usedPrefix, text, command }) => {
  let user = global.db.data.users[m.sender]
  
  if (!user.registered) {
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *No estás registrado*\n> 📌 Usa: *${usedPrefix}registrar Nombre.Edad*\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  if (user.clan) {
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *YA PERTENECES A UN CLAN*\n> 📌 Usa *${usedPrefix}salirclan* primero\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  if (!text) {
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 🜸 *UNIRSE A CLAN*\n\n✦ 𝗨𝗦𝗢 ✦\n> 📌 *${usedPrefix + command} <nombre>*\n\n🎯 *Ejemplo:*\n> ${usedPrefix + command} LosDragones\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  const clanName = text.trim()
  const clan = global.db.data.clans?.[clanName]
  
  if (!clan) {
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *EL CLAN ${clanName} NO EXISTE*\n> 📌 Usa *${usedPrefix}clanes* para ver los clanes disponibles\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  // Verificar límite de miembros
  const maxMiembros = 5 + (clan.level - 1) * 2
  if (clan.members.length >= maxMiembros) {
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *EL CLAN ESTÁ LLENO*\n> 👥 Máximo: ${maxMiembros} miembros\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  // Agregar al clan
  clan.members.push(m.sender)
  user.clan = clanName
  user.clanRank = 'recluta'
  
  await global.db.write()
  
  let textMsg = `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n`
  textMsg += `> 🜸 *TE HAS UNIDO AL CLAN* 🜸\n\n`
  textMsg += `✦ 𝗗𝗘𝗧𝗔𝗟𝗟𝗘𝗦 ✦\n`
  textMsg += `> 🏰 *Clan:* ${clan.name}\n`
  textMsg += `> 👑 *Líder:* @${clan.leader.split('@')[0]}\n`
  textMsg += `> 🛡️ *Tu rango:* Recluta\n\n`
  textMsg += `📌 *Beneficios que recibirás:*\n`
  textMsg += `> 💰 +${5 + (clan.level - 1) * 2}% monedas\n`
  textMsg += `> 📚 +${(clan.level - 1) * 1.5}% EXP\n\n`
  textMsg += `⧼⋆꙳•〔 🛸 𝗕𝗔𝗟𝗗𝗪𝗜𝗡𝗗 𝗜𝗩 〕⋆꙳•⧽\n`
  textMsg += `> 👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*\n`
  textMsg += `╰⋆꙳•❅‧*₊⋆꙳︎‧*❆₊⋆╯\n`
  textMsg += `⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ ᴄʏʙᴇʀ ᴍᴇɴᴜ 🧬`
  
  await conn.sendMessage(m.chat, { text: textMsg, mentions: [clan.leader] }, { quoted: m })
}

handler.help = ['unirse <nombre>']
handler.tags = ['clan']
handler.command = ['unirse', 'joinclan']
handler.register = false

export default handler