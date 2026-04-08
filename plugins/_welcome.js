// ⚔️ Código creado por DEVLYONN 👑
// 🛡️ BALDWIND IV - BIENVENIDA AUTOMÁTICA

let handler = m => m

handler.before = async function (m, { conn, usedPrefix }) {
  // Detectar cuando alguien se une al grupo (messageStubType = 1)
  if (m.messageStubType === 1) {
    try {
      const participants = m.messageStubParameters
      const groupMetadata = await conn.groupMetadata(m.chat)
      
      for (let participant of participants) {
        const userName = await conn.getName(participant).catch(() => 'Guerrero')
        const userNumber = participant.split('@')[0]
        const totalParticipantes = groupMetadata.participants.length
        
        let text = `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n`
        text += `> 🌿 *BIENVENIDO AL REINO* 🌿\n`
        text += `> ⚔️ @${userNumber}\n`
        text += `> 📛 *Nombre:* ${userName}\n`
        text += `> 👥 *Miembros:* ${totalParticipantes}\n\n`
        text += `> 📌 Usa *${usedPrefix}menu* para ver los comandos\n`
        text += `> 👑 *Creador:* DEVLYONN\n\n`
        text += `⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ ᴄʏʙᴇʀ ᴍᴇɴᴜ 🧬`
        
        await conn.sendMessage(m.chat, { text, mentions: [participant] })
        
        // Opcional: Dar monedas de bienvenida
        if (global.db.data.users[participant]) {
          global.db.data.users[participant].coins = (global.db.data.users[participant].coins || 0) + 100
          await global.db.write()
        }
      }
    } catch (error) {
      console.error('Error en welcome:', error)
    }
  }
}

handler.group = true
export default handler