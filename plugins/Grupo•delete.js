import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

let handler = async (m, { conn, usedPrefix, command, isAdmin, isBotAdmin }) => {
  if (!m.isGroup) return m.reply(`❌ *Este comando solo funciona en grupos*`)

  if (!isAdmin) return m.reply(`❌ *Solo los administradores pueden eliminar mensajes*`)

  if (!isBotAdmin) return m.reply(`❌ *El bot necesita ser administrador para eliminar mensajes*`)

  if (!m.quoted) return m.reply(`❌ *Responde al mensaje que quieres eliminar*\n\n📌 *Ejemplo:*\n${usedPrefix + command} (responde al mensaje)`)

  try {
    const quotedMsg = m.quoted
    const key = {
      remoteJid: m.chat,
      fromMe: false,
      id: quotedMsg.id,
      participant: quotedMsg.sender
    }

    await conn.sendMessage(m.chat, { delete: key })
    
    let confirmMsg = `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n`
    confirmMsg += `> 🗑️ *MENSAJE ELIMINADO* ✅\n\n`
    confirmMsg += `✦ 𝗗𝗘𝗧𝗔𝗟𝗟𝗘𝗦 ✦\n`
    confirmMsg += `> 👤 *Eliminado por:* @${m.sender.split('@')[0]}\n`
    confirmMsg += `> 📅 *Hora:* ${new Date().toLocaleTimeString()}\n\n`
    confirmMsg += `✦ 𝗛𝗢𝗦𝗧𝗜𝗡𝗚 𝗥𝗘𝗖𝗢𝗠𝗘𝗡𝗗𝗔𝗗𝗢 ✦\n`
    confirmMsg += `> ⚡ *SWALLOX*\n`
    confirmMsg += `> 🔗 https://dash.swallox.com\n`
    confirmMsg += `> 💬 Grupo: https://chat.whatsapp.com/Bzo7jcdivDGJc3thZrSyEC\n\n`
    confirmMsg += `👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*\n`
    confirmMsg += `⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ ᴄʏʙᴇʀ ᴍᴇɴᴜ 🧬`
    
    await conn.sendMessage(m.chat, { text: confirmMsg, mentions: [m.sender] })
    
  } catch (error) {
    console.error('Error:', error)
    m.reply(`❌ *Error al eliminar el mensaje*\n\n${error.message}`)
  }
}

handler.help = ['delete']
handler.tags = ['grupo']
handler.command = ['delete', 'del', 'borrar']
handler.group = true
handler.admin = true
handler.botAdmin = true

export dafault handler 