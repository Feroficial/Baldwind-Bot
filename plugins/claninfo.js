// ⚔️ Código creado por 🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸
// 🛡️ BALDWIND IV - INFORMACIÓN DEL CLAN

let handler = async (m, { conn, usedPrefix, text, command }) => {
  let user = global.db.data.users[m.sender]
  
  let clanName = text || user.clan
  
  if (!clanName) {
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *NO PERTENECES A NINGÚN CLAN*\n> 📌 Usa *${usedPrefix}clanes* para ver los clanes disponibles\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  if (!global.db.data.clans) global.db.data.clans = {}
  const clan = global.db.data.clans[clanName]
  
  if (!clan) {
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *EL CLAN ${clanName} NO EXISTE*\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  // Calcular niveles y bonos
  const nivel = clan.level || 1
  const nextExp = nivel * 1000
  const bonoMonedas = 5 + (nivel - 1) * 2
  const bonoExp = (nivel - 1) * 1.5
  const maxMiembros = 5 + (nivel - 1) * 2
  
  // Obtener información del líder
  let leaderName = 'Desconocido'
  try {
    leaderName = await conn.getName(clan.leader)
  } catch (e) {}
  
  // Lista de miembros (primeros 10)
  let miembrosLista = ''
  const miembrosMostrar = clan.members.slice(0, 10)
  for (let member of miembrosMostrar) {
    let memberName = 'Desconocido'
    try {
      memberName = await conn.getName(member)
    } catch (e) {}
    const isLeader = member === clan.leader
    miembrosLista += `> ${isLeader ? '👑' : '⚔️'} @${member.split('@')[0]} (${memberName})${isLeader ? ' [LÍDER]' : ''}\n`
  }
  
  if (clan.members.length > 10) {
    miembrosLista += `> ... y ${clan.members.length - 10} miembros más\n`
  }
  
  let textMsg = `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n`
  textMsg += `> 🏰 *INFORMACIÓN DEL CLAN* 🏰\n\n`
  textMsg += `✦ 𝗗𝗔𝗧𝗢𝗦 𝗚𝗘𝗡𝗘𝗥𝗔𝗟𝗘𝗦 ✦\n`
  textMsg += `> 📛 *Nombre:* ${clan.name}\n`
  textMsg += `> 👑 *Líder:* @${clan.leader.split('@')[0]} (${leaderName})\n`
  textMsg += `> 📊 *Nivel:* ${nivel}\n`
  textMsg += `> 📈 *EXP:* ${clan.exp || 0}/${nextExp}\n`
  textMsg += `> 👥 *Miembros:* ${clan.members.length}/${maxMiembros}\n`
  textMsg += `> 💰 *Cofre:* ${clan.coins || 0} monedas\n`
  textMsg += `> 📝 *Descripción:* ${clan.description || 'Sin descripción'}\n\n`
  
  textMsg += `✦ 𝗕𝗘𝗡𝗘𝗙𝗜𝗖𝗜𝗢𝗦 ✦\n`
  textMsg += `> 💰 *Bono monedas:* +${bonoMonedas}%\n`
  textMsg += `> 📚 *Bono EXP:* +${bonoExp.toFixed(1)}%\n\n`
  
  textMsg += `✦ 𝗠𝗜𝗘𝗠𝗕𝗥𝗢𝗦 ✦\n`
  textMsg += `${miembrosLista}\n`
  
  textMsg += `⧼⋆꙳•〔 🛸 𝗕𝗔𝗟𝗗𝗪𝗜𝗡𝗗 𝗜𝗩 〕⋆꙳•⧽\n`
  textMsg += `> 👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*\n`
  textMsg += `╰⋆꙳•❅‧*₊⋆꙳︎‧*❆₊⋆╯\n`
  textMsg += `⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ ᴄʏʙᴇʀ ᴍᴇɴᴜ 🧬`
  
  const mentions = [clan.leader, ...clan.members.slice(0, 10)]
  await conn.sendMessage(m.chat, { text: textMsg, mentions: mentions }, { quoted: m })
}

handler.help = ['claninfo']
handler.tags = ['clan']
handler.command = ['claninfo', 'clan']
handler.register = false

export default handler