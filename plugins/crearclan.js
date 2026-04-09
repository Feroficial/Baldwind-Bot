// ⚔️ Código creado por 🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸
// 🛡️ BALDWIND IV - CREAR CLAN

let handler = async (m, { conn, usedPrefix, text, command }) => {
  let user = global.db.data.users[m.sender]
  
  // Verificar si está registrado
  if (!user.registered) {
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *No estás registrado*\n> 📌 Usa: *${usedPrefix}registrar Nombre.Edad*\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  // Verificar si ya tiene clan
  if (user.clan) {
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *YA PERTENECES A UN CLAN*\n> 📌 Usa *${usedPrefix}salirclan* primero\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  if (!text) {
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 🜸 *CREAR CLAN*\n\n✦ 𝗨𝗦𝗢 ✦\n> 📌 *${usedPrefix + command} <nombre>*\n> 💰 *Costo:* 5000 monedas\n> 👑 *Máximo 20 caracteres*\n\n🎯 *Ejemplo:*\n> ${usedPrefix + command} LosDragones\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  let clanName = text.trim().substring(0, 20)
  
  // Verificar si el nombre ya existe
  if (global.db.data.clans && global.db.data.clans[clanName]) {
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *YA EXISTE UN CLAN CON ESE NOMBRE*\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  // Verificar si tiene suficientes monedas
  if ((user.coins || 0) < 5000) {
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *NO TIENES SUFICIENTES MONEDAS*\n> 💰 Necesitas: 5000 monedas\n> 🪙 Tienes: ${user.coins || 0}\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  // Crear clan
  if (!global.db.data.clans) global.db.data.clans = {}
  
  global.db.data.clans[clanName] = {
    name: clanName,
    leader: m.sender,
    members: [m.sender],
    level: 1,
    exp: 0,
    coins: 0,
    createdAt: Date.now(),
    description: 'Un nuevo clan ha surgido en el reino de BALDWIND IV',
    rank: {}
  }
  
  // Asignar clan al usuario
  user.clan = clanName
  user.clanRank = 'líder'
  user.coins -= 5000
  
  await global.db.write()
  
  let textMsg = `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n`
  textMsg += `> 🜸 *CLAN CREADO EXITOSAMENTE* 🜸\n\n`
  textMsg += `✦ 𝗗𝗘𝗧𝗔𝗟𝗟𝗘𝗦 𝗗𝗘𝗟 𝗖𝗟𝗔𝗡 ✦\n`
  textMsg += `> 🏰 *Nombre:* ${clanName}\n`
  textMsg += `> 👑 *Líder:* @${m.sender.split('@')[0]}\n`
  textMsg += `> 📊 *Nivel:* 1\n`
  textMsg += `> 📈 *EXP:* 0/1000\n`
  textMsg += `> 💰 *Monedas gastadas:* 5000\n\n`
  textMsg += `✦ 𝗕𝗘𝗡𝗘𝗙𝗜𝗖𝗜𝗢𝗦 𝗔𝗖𝗧𝗨𝗔𝗟𝗘𝗦 ✦\n`
  textMsg += `> 💰 *Bono monedas:* +5%\n`
  textMsg += `> 📚 *Bono EXP:* +0%\n\n`
  textMsg += `⧼⋆꙳•〔 🛸 𝗕𝗔𝗟𝗗𝗪𝗜𝗡𝗗 𝗜𝗩 〕⋆꙳•⧽\n`
  textMsg += `> 👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*\n`
  textMsg += `╰⋆꙳•❅‧*₊⋆꙳︎‧*❆₊⋆╯\n`
  textMsg += `⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ ᴄʏʙᴇʀ ᴍᴇɴᴜ 🧬`
  
  await conn.sendMessage(m.chat, { text: textMsg, mentions: [m.sender] }, { quoted: m })
}

handler.help = ['crearclan <nombre>']
handler.tags = ['clan']
handler.command = ['crearclan', 'crearclanes']
handler.register = false

export default handler