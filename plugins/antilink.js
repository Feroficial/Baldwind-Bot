// ⚔️ Código creado por 🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸
// 🛡️ BALDWIND IV - SISTEMA ANTILINK

let handler = async (m, { conn, usedPrefix, text, isAdmin }) => {
  if (!m.isGroup) return m.reply(`❌ *Este comando solo funciona en grupos*`)
  
  if (!isAdmin) return m.reply(`❌ *Solo los administradores pueden usar este comando*`)
  
  // Inicializar chat si no existe
  if (!global.db.data.chats[m.chat]) {
    global.db.data.chats[m.chat] = {}
  }
  
  let chat = global.db.data.chats[m.chat]

  if (text === 'on') {
    chat.antiLink = true
    m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 🛡️ *ANTILINK ACTIVADO*\n> 📌 Los enlaces prohibidos serán eliminados y el usuario expulsado.\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  } else if (text === 'off') {
    chat.antiLink = false
    m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 🛡️ *ANTILINK DESACTIVADO*\n> 📌 Los enlaces ya no serán bloqueados.\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  } else {
    m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 🛡️ *ANTILINK*\n> 📌 *Uso:*\n> ${usedPrefix}antilink on - Activar\n> ${usedPrefix}antilink off - Desactivar\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
}

handler.help = ['antilink']
handler.tags = ['grupo']
handler.command = ['antilink']
handler.group = true
handler.admin = true

export default handler
