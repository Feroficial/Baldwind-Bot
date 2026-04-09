// ⚔️ Código creado por 🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸
// 🛡️ BALDWIND IV - DONAR AL CLAN

let handler = async (m, { conn, usedPrefix, text, command }) => {
  let user = global.db.data.users[m.sender]
  
  if (!user.clan) {
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *NO PERTENECES A NINGÚN CLAN*\n> 📌 Usa *${usedPrefix}clanes* para ver los clanes disponibles\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  const amount = parseInt(text)
  if (isNaN(amount) || amount <= 0) {
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 🜸 *DONAR AL CLAN*\n\n✦ 𝗨𝗦𝗢 ✦\n> 📌 *${usedPrefix + command} <cantidad>*\n\n🎯 *Ejemplo:*\n> ${usedPrefix + command} 1000\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  if ((user.coins || 0) < amount) {
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *NO TIENES SUFICIENTES MONEDAS*\n> 💰 Necesitas: ${amount} monedas\n> 🪙 Tienes: ${user.coins || 0}\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  const clan = global.db.data.clans[user.clan]
  if (!clan) {
    user.clan = null
    await global.db.write()
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *EL CLAN YA NO EXISTE*\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  // Donar
  user.coins -= amount
  clan.coins = (clan.coins || 0) + amount
  
  // Ganar EXP de clan (1 EXP por cada 10 monedas donadas)
  const expGanada = Math.floor(amount / 10)
  clan.exp = (clan.exp || 0) + expGanada
  
  // Verificar subida de nivel del clan
  let nivelUp = false
  let nivel = clan.level || 1
  let expNecesaria = nivel * 1000
  
  if (clan.exp >= expNecesaria) {
    clan.level = nivel + 1
    clan.exp = clan.exp - expNecesaria
    nivelUp = true
  }
  
  await global.db.write()
  
  let textMsg = `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n`
  textMsg += `> 💰 *DONACIÓN REALIZADA* 💰\n\n`
  textMsg += `✦ 𝗗𝗘𝗧𝗔𝗟𝗟𝗘𝗦 ✦\n`
  textMsg += `> 🏰 *Clan:* ${clan.name}\n`
  textMsg += `> 💸 *Donaste:* ${amount} monedas\n`
  textMsg += `> 📈 *EXP de clan:* +${expGanada}\n`
  textMsg += `> 💰 *Cofre del clan:* ${clan.coins} monedas\n`
  
  if (nivelUp) {
    textMsg += `\n✨ *¡EL CLAN HA SUBIDO DE NIVEL!* ✨\n`
    textMsg += `> 📊 *Nuevo nivel:* ${clan.level}\n`
    textMsg += `> 💰 *Bono monedas:* +${5 + (clan.level - 1) * 2}%\n`
    textMsg += `> 📚 *Bono EXP:* +${(clan.level - 1) * 1.5}%\n`
  }
  
  textMsg += `\n⧼⋆꙳•〔 🛸 𝗕𝗔𝗟𝗗𝗪𝗜𝗡𝗗 𝗜𝗩 〕⋆꙳•⧽\n`
  textMsg += `> 👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*\n`
  textMsg += `╰⋆꙳•❅‧*₊⋆꙳︎‧*❆₊⋆╯\n`
  textMsg += `⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ ᴄʏʙᴇʀ ᴍᴇɴᴜ 🧬`
  
  await conn.sendMessage(m.chat, { text: textMsg }, { quoted: m })
}

handler.help = ['donar <cantidad>']
handler.tags = ['clan']
handler.command = ['donar', 'donateclan']
handler.register = false

export default handler