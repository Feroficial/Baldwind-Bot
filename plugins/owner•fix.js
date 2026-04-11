// ⚔️ Código creado por 🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸
// 🛡️ BALDWIND IV - ACTUALIZAR REPOSITORIO

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

// ========== TU NÚMERO AQUÍ ==========
const MI_NUMERO = '59177474230'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  // Verificación directa con tu número
  const senderNumber = m.sender.split('@')[0]
  
  if (senderNumber !== MI_NUMERO) {
    return conn.reply(m.chat, `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ⚙️🔒 *MÓDULO BLOQUEADO*\n\n> 🛡️ *Acceso denegado*\n> 📌 Esta función es exclusiva para *🜸 𝘋𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*\n\n👑 *BALDWIND IV*`, m)
  }

  await conn.reply(m.chat, '—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ⏳ *Actualizando el bot...*', m)

  try {
    // Método 1: Intentar git pull normal
    try {
      const output = execSync('git pull', { encoding: 'utf-8' })
      await conn.reply(m.chat, `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ✅ *Actualización completada:*\n\n📦 \`${output.trim()}\`\n\n👑 *🜸 𝘋𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`, m)
      return
    } catch (gitError) {
      // Si hay conflicto, forzar reset
      if (gitError.message.includes('Your local changes')) {
        await conn.reply(m.chat, '—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ⚠️ *Conflictos detectados, forzando actualización...*', m)
        
        // Forzar reset del config.js
        execSync('git checkout -- núcleo•clover/config.js', { stdio: 'pipe' })
        execSync('git pull', { stdio: 'pipe' })
        
        await conn.reply(m.chat, `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ✅ *Actualización forzada completada*\n> 📌 Reinicia el bot para aplicar cambios.\n\n👑 *🜸 𝘋𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`, m)
        return
      }
      throw gitError
    }
  } catch (error) {
    // Mensaje de error simple
    await conn.reply(m.chat, `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *Error al actualizar:*\n> ${error.message.split('\n')[0]}\n\n📌 *Solución manual:*\n1. Borra la carpeta del bot\n2. Clona de nuevo el repositorio\n3. Restaura database.json y sesión\n\n👑 *🜸 𝘋𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`, m)
  }
}

handler.help = ['fix', 'update', 'actualizar']
handler.tags = ['owner']
handler.command = ['fix', 'update', 'actualizar']
handler.rowner = false

export default handler