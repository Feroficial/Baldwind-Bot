// ⚔️ Código creado por 🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸
// 🛡️ BALDWIND IV - RETOS DEL CLAN

let handler = async (m, { conn, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender]
  
  if (!user.clan) {
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *NO PERTENECES A NINGÚN CLAN*\n> 📌 Usa *${usedPrefix}clanes* para ver los clanes disponibles\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  const clan = global.db.data.clans[user.clan]
  if (!clan) {
    user.clan = null
    await global.db.write()
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *EL CLAN YA NO EXISTE*\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  // Aquí se pueden implementar retos diarios
  // Por ahora mostramos los retos básicos
  
  let textMsg = `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n`
  textMsg += `> ⚔️ *RETOS DEL CLAN* ⚔️\n`
  textMsg += `> 🏰 ${clan.name}\n\n`
  textMsg += `✦ 𝗥𝗘𝗧𝗢𝗦 𝗗𝗜𝗔𝗥𝗜𝗢𝗦 ✦\n`
  textMsg += `> 📌 Usar 50 comandos entre todos\n`
  textMsg += `> 📌 Recolectar 5000 monedas\n`
  textMsg += `> 📌 Tener 5 miembros activos\n`
  textMsg += `> 📌 Donar 1000 monedas al clan\n\n`
  textMsg += `✦ 𝗥𝗘𝗖𝗢𝗠𝗣𝗘𝗡𝗦𝗔𝗦 ✦\n`
  textMsg += `> 🎁 Completar retos da EXP de clan\n`
  textMsg += `> 🎁 Bonificaciones exclusivas\n\n`
  textMsg += `⧼⋆꙳•〔 🛸 𝗕𝗔𝗟𝗗𝗪𝗜𝗡𝗗 𝗜𝗩 〕⋆꙳•⧽\n`
  textMsg += `> 👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*\n`
  textMsg += `╰⋆꙳•❅‧*₊⋆꙳︎‧*❆₊⋆╯\n`
  textMsg += `⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ ᴄʏʙᴇʀ ᴍᴇɴᴜ 🧬`
  
  await conn.sendMessage(m.chat, { text: textMsg }, { quoted: m })
}

handler.help = ['retos']
handler.tags = ['clan']
handler.command = ['retos', 'clanretos']
handler.register = false

export default handler