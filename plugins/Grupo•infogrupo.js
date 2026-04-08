// ⚔️ Código creado por DEVLYONN 👑
// 🛡️ BALDWIND IV - INFORMACIÓN DEL GRUPO

let handler = async (m, { conn, usedPrefix, command, isAdmin, isBotAdmin }) => {
  if (!m.isGroup) return m.reply(`❌ *Este comando solo funciona en grupos*`)

  try {
    // Obtener metadata del grupo
    const groupMetadata = await conn.groupMetadata(m.chat)
    const participants = groupMetadata.participants
    const groupAdmins = participants.filter(p => p.admin).map(p => p.id)
    const botJid = conn.user.jid
    const isBotAdmin = groupAdmins.includes(botJid)
    
    // Identificar al creador del grupo (el primer administrador que creó el grupo)
    // En WhatsApp, el creador es el admin con el rango 'superadmin' o el primero en la lista
    let groupOwner = groupMetadata.owner || groupMetadata.creator || groupAdmins[0] || participants[0]?.id
    let ownerName = 'Desconocido'
    
    try {
      ownerName = await conn.getName(groupOwner)
    } catch (e) {}
    
    // Contar miembros por tipo
    const totalMembers = participants.length
    const adminCount = groupAdmins.length
    const regularMembers = totalMembers - adminCount
    
    // Obtener foto del grupo
    let groupIcon = null
    try {
      const ppUrl = await conn.profilePictureUrl(m.chat, 'image')
      const ppRes = await fetch(ppUrl)
      if (ppRes.ok) groupIcon = Buffer.from(await ppRes.arrayBuffer())
    } catch (e) {
      groupIcon = null
    }
    
    // Obtener fecha de creación
    const creationDate = new Date(groupMetadata.creation * 1000 || Date.now())
    const fechaCreacion = creationDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    // Configuración del grupo
    const isLocked = groupMetadata.announce === true
    const isRestrict = groupMetadata.restrict === true
    const isEphemeral = groupMetadata.ephemeralDuration > 0
    
    // Lista de administradores
    const adminList = groupAdmins.map(admin => {
      const name = conn.getName(admin) || admin.split('@')[0]
      const isCreator = admin === groupOwner
      return `> ${isCreator ? '👑' : '⚔️'} @${admin.split('@')[0]} (${name})${isCreator ? ' [CREADOR]' : ''}`
    }).join('\n')
    
    // Construir mensaje
    let caption = `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n`
    caption += `> 📊 *INFORMACIÓN DEL REINO*\n\n`
    
    caption += `✦ 𝗗𝗔𝗧𝗢𝗦 𝗚𝗘𝗡𝗘𝗥𝗔𝗟𝗘𝗦 ✦\n`
    caption += `> 🏰 *Nombre:* ${groupMetadata.subject || 'Sin nombre'}\n`
    caption += `> 🆔 *ID:* ${m.chat}\n`
    caption += `> 📝 *Descripción:* ${groupMetadata.desc?.toString() || 'Sin descripción'}\n`
    caption += `> 📅 *Creado:* ${fechaCreacion}\n`
    caption += `> 👑 *Creador:* @${groupOwner.split('@')[0]} (${ownerName})\n\n`
    
    caption += `✦ 𝗠𝗜𝗘𝗠𝗕𝗥𝗢𝗦 ✦\n`
    caption += `> 👥 *Total:* ${totalMembers}\n`
    caption += `> 👑 *Administradores:* ${adminCount}\n`
    caption += `> 🛡️ *Miembros:* ${regularMembers}\n\n`
    
    caption += `✦ 𝗔𝗗𝗠𝗜𝗡𝗜𝗦𝗧𝗥𝗔𝗗𝗢𝗥𝗘𝗦 ✦\n`
    caption += `${adminList}\n\n`
    
    caption += `✦ 𝗖𝗢𝗡𝗙𝗜𝗚𝗨𝗥𝗔𝗖𝗜𝗢́𝗡 ✦\n`
    caption += `> 🔒 *Grupo cerrado:* ${isLocked ? '✅ Sí' : '❌ No'}\n`
    caption += `> 🛡️ *Restringido:* ${isRestrict ? '✅ Sí' : '❌ No'}\n`
    caption += `> 🕒 *Modo efímero:* ${isEphemeral ? '✅ Sí' : '❌ No'}\n`
    caption += `> 🤖 *Bot admin:* ${isBotAdmin ? '✅ Sí' : '❌ No'}\n\n`
    
    caption += `✦ 𝗘𝗦𝗧𝗔𝗗𝗢 𝗗𝗘𝗟 𝗕𝗢𝗧 ✦\n`
    caption += `> 📌 *Prefijo:* ${usedPrefix}\n`
    caption += `> 📋 *Comandos:* ${usedPrefix}menu\n\n`
    
    caption += `⧼⋆꙳•〔 🛸 𝗕𝗔𝗟𝗗𝗪𝗜𝗡𝗗 𝗜𝗩 〕⋆꙳•⧽\n`
    caption += `> 👑 🜸 𝘋𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸\n`
    caption += `╰⋆꙳•❅‧*₊⋆꙳︎‧*❆₊⋆╯\n`
    caption += `⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ ᴄʏʙᴇʀ ᴍᴇɴᴜ 🧬`
    
    // Menciones: creador + administradores
    const mentions = [groupOwner, ...groupAdmins]
    
    // Enviar mensaje con foto del grupo (si tiene)
    if (groupIcon) {
      await conn.sendMessage(m.chat, {
        image: groupIcon,
        caption: caption,
        mentions: mentions
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        text: caption,
        mentions: mentions
      }, { quoted: m })
    }
    
  } catch (error) {
    console.error('Error en infogrupo:', error)
    m.reply(`❌ *Error al obtener información del grupo*\n\n🛸 *BALDWIND IV*`)
  }
}

handler.help = ['infogrupo']
handler.tags = ['grupo']
handler.command = ['infogrupo', 'groupinfo', 'grupoinfo']
handler.group = true

export default handler