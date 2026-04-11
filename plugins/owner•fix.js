// ⚔️ Código creado por 🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸
// 🛡️ BALDWIND IV - ACTUALIZAR REPOSITORIO

import { execSync } from 'child_process'

// ========== TU NÚMERO AQUÍ ==========
const MI_NUMERO = '59177474230'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  // Verificación directa con tu número
  const senderNumber = m.sender.split('@')[0]
  
  if (senderNumber !== MI_NUMERO) {
    return conn.reply(m.chat, `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ⚙️🔒 *MÓDULO BLOQUEADO*\n\n> 🛡️ *Acceso denegado*\n> 📌 Esta función es exclusiva para *🜸 𝘋𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*\n\n👑 *BALDWIND IV*`, m)
  }

  try {
    await conn.reply(m.chat, '—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ⏳ *Actualizando el bot...*', m)

    // Guardar cambios locales antes de actualizar
    try {
      execSync('git stash', { stdio: 'pipe' })
    } catch (e) {}

    const output = execSync('git pull' + (args.length ? ' ' + args.join(' ') : '')).toString()
    
    // Restaurar cambios guardados
    try {
      execSync('git stash pop', { stdio: 'pipe' })
    } catch (e) {}

    const isUpdated = output.includes('Already up to date')

    const updateMsg = isUpdated
      ? `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ✅ *BALDWIND IV ya está actualizado.*\n\n👑 *🜸 𝘋𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`
      : `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ✅ *Actualización aplicada:*\n\n📦 \`${output.trim()}\`\n\n👑 *🜸 𝘋𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`

    await conn.reply(m.chat, updateMsg, m)

  } catch (error) {
    // Si hay error, restaurar cambios
    try {
      execSync('git stash pop', { stdio: 'pipe' })
    } catch (e) {}

    await conn.reply(m.chat, `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *Error al actualizar:*\n> ${error.message}\n\n👑 *🜸 𝘋𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`, m)
  }
}

handler.help = ['fix', 'update', 'actualizar']
handler.tags = ['owner']
handler.command = ['fix', 'update', 'actualizar']
handler.rowner = false

export default handler