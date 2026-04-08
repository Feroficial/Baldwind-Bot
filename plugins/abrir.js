// ⚔️ Código creado por DEVLYONN 👑
// 🛡️ BALDWIND IV - ABRIR GRUPO

let handler = async (m, { conn, isAdmin, isBotAdmin, usedPrefix, command }) => {
  if (!m.isGroup) return m.reply(`❌ *Este comando solo funciona en grupos*`)
  
  if (!isAdmin) return m.reply(`❌ *Solo los administradores pueden usar este comando*`)
  
  if (!isBotAdmin) return m.reply(`❌ *El bot necesita ser administrador para abrir el grupo*`)

  try {
    await conn.groupSettingUpdate(m.chat, 'not_announcement')
    m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 🔓 *GRUPO ABIERTO*\n> 📌 Ahora todos los miembros pueden enviar mensajes.\n\n👑 *DEVLYONN*`)
  } catch (e) {
    m.reply(`❌ *Error:* ${e.message}`)
  }
}

handler.help = ['abrir']
handler.tags = ['grupo']
handler.command = ['abrir', 'open']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler