// ⚔️ Código creado por 🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸
// 🛡️ BALDWIND IV - MENCIONAR A TODOS

let handler = async (m, { conn, text, usedPrefix, command, isAdmin, isBotAdmin }) => {
  // Verificar que sea en un grupo
  if (!m.isGroup) return m.reply(`❌ *Este comando solo funciona en grupos*`)

  // Verificar que el usuario sea administrador
  if (!isAdmin) return m.reply(`❌ *Solo los administradores pueden usar este comando*`)

  // Verificar que el bot sea administrador
  if (!isBotAdmin) return m.reply(`❌ *El bot necesita ser administrador para mencionar a todos*`)

  // Obtener el mensaje personalizado (si no hay, usar uno por defecto)
  let mensaje = text.trim()
  if (!mensaje) mensaje = "¡ATENCIÓN GUERREROS!"

  try {
    // Obtener metadata del grupo
    const groupMetadata = await conn.groupMetadata(m.chat)
    const participants = groupMetadata.participants
    const groupName = groupMetadata.subject || 'el grupo'
    
    // Crear lista de menciones
    let mentions = []
    let mentionText = ''
    
    for (let participant of participants) {
      const userJid = participant.id
      mentions.push(userJid)
      mentionText += `@${userJid.split('@')[0]}\n`
    }
    
    // Mensaje decorado
    let textMsg = `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n`
    textMsg += `> 📢 *${mensaje.toUpperCase()}* 📢\n\n`
    textMsg += `✦ 𝗚𝗥𝗨𝗣𝗢: ${groupName}\n`
    textMsg += `✦ 𝗠𝗜𝗘𝗠𝗕𝗥𝗢𝗦: ${participants.length}\n`
    textMsg += `✦ 𝗠𝗘𝗡𝗦𝗔𝗝𝗘:\n`
    textMsg += `> ${mensaje}\n\n`
    textMsg += `✦ 𝗠𝗘𝗡𝗖𝗜𝗢𝗡𝗘𝗦:\n`
    textMsg += `${mentionText}\n`
    textMsg += `⧼⋆꙳•〔 🛸 𝗕𝗔𝗟𝗗𝗪𝗜𝗡𝗗 𝗜𝗩 〕⋆꙳•⧽\n`
    textMsg += `> 👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*\n`
    textMsg += `╰⋆꙳•❅‧*₊⋆꙳︎‧*❆₊⋆╯\n`
    textMsg += `⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ ᴄʏʙᴇʀ ᴍᴇɴᴜ 🧬`
    
    await conn.sendMessage(m.chat, { text: textMsg, mentions: mentions })
    
  } catch (error) {
    console.error('Error en tagall:', error)
    m.reply(`❌ *Error al mencionar a todos*\n\n${error.message}`)
  }
}

handler.help = ['tagall <mensaje>']
handler.tags = ['grupo']
handler.command = ['tagall', 'todos', 'mentionall']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler