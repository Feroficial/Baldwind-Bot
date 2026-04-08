// ⚔️ Código creado por DEVLYONN 👑
// 🛡️ BALDWIND IV - CERRAR GRUPO

let handler = async (m, { conn, isAdmin, isBotAdmin, usedPrefix, command }) => {
  if (!m.isGroup) return m.reply(`❌ *Este comando solo funciona en grupos*`)
  
  if (!isAdmin) return m.reply(`❌ *Solo los administradores pueden usar este comando*`)
  
  if (!isBotAdmin) return m.reply(`❌ *El bot necesita ser administrador para cerrar el grupo*`)

  try {
    await conn.groupSettingUpdate(m.chat, 'announcement')
    m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 🔒 *GRUPO CERRADO*\n> 📌 Solo los administradores pueden enviar mensajes.\n\n👑 *DEVLYONN*`)
  } catch (e) {
    m.reply(`❌ *Error:* ${e.message}`)
  }
}

handler.help = ['cerrar']
handler.command = ['cerrar', 'close']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler