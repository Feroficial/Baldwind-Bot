// ⚔️ Código creado por 🜸 𝘋𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸
// 🛡️ BALDWIND IV - ACTUALIZAR REPOSITORIO

import { execSync } from 'child_process'

// ========== CONFIGURACIÓN DEL CREADOR ==========
const DEVELOPER_NUMBER = '59177474230' // Tu número sin @
const DEVELOPER_JID = '59177474230@s.whatsapp.net'

// Función para verificar si es el desarrollador
const isDeveloper = (sender) => {
  const senderNumber = sender.split('@')[0]
  return senderNumber === DEVELOPER_NUMBER
}

const handler = async (m, { conn, args }) => {
  // Verificar si quien ejecuta es el desarrollador
  if (!isDeveloper(m.sender)) {
    return conn.reply(m.chat, `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ⚙️🔒 *MÓDULO BLOQUEADO*\n\n> 🛡️ *Acceso denegado*\n> 📌 Esta función es exclusiva para *🜸 𝘋𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*\n\n👑 *BALDWIND IV*`, m)
  }

  try {
    await conn.reply(m.chat, '—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ⏳ *Actualizando el bot... Por favor espera.*', m)

    const output = execSync('git pull' + (args.length ? ' ' + args.join(' ') : '')).toString()
    const isUpdated = output.includes('Already up to date')

    const updateMsg = isUpdated
      ? `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ✅ *BALDWIND IV ya está actualizado.*\n\n👑 *🜸 𝘋𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`
      : `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ✅ *Actualización aplicada correctamente:*\n\n📦 \`${output.trim()}\`\n\n👑 *🜸 𝘋𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`

    await conn.reply(m.chat, updateMsg, m)

  } catch (error) {
    let conflictMsg = '—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *Error al actualizar el bot.*\n\n'

    try {
      const status = execSync('git status --porcelain').toString().trim()

      if (status) {
        const conflictedFiles = status
          .split('\n')
          .map(line => line.slice(3))
          .filter(file =>
            !file.startsWith('.npm/') &&
            !file.startsWith('Sessions/') &&
            !file.startsWith('node_modules/') &&
            !file.startsWith('package-lock.json') &&
            !file.startsWith('database.json') &&
            !file.startsWith('.cache/') &&
            !file.startsWith('tmp/')
          )

        if (conflictedFiles.length > 0) {
          conflictMsg += `⚠️ *Conflictos detectados:*\n\n` +
            conflictedFiles.map(f => `• ${f}`).join('\n') +
            `\n\n🔧 *Solución:* reinstala el bot o resuelve manualmente.\n\n👑 *🜸 𝘋𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`
        } else {
          conflictMsg += `⚠️ *Error desconocido al actualizar.*\n\n👑 *🜸 𝘋𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`
        }
      } else {
        conflictMsg += `⚠️ *Error desconocido al actualizar.*\n\n👑 *🜸 𝘋𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`
      }
    } catch (statusError) {
      console.error('Error:', statusError)
      conflictMsg += `⚠️ *No se pudieron verificar los conflictos.*\n\n👑 *🜸 𝘋𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`
    }

    await conn.reply(m.chat, conflictMsg, m)
  }
}

// ========== COMANDOS ==========
handler.help = ['fix', 'update', 'up']
handler.tags = ['owner']
handler.command = ['fix', 'update', 'up']

// Verificación en el comando directo
handler.rowner = false // Lo manejamos manualmente

// Handler para comandos directos
handler.all = async function (m) {
  if (!m.text || typeof m.text !== 'string') return

  // Solo el desarrollador puede usar estos comandos
  if (!isDeveloper(m.sender)) return

  const input = m.text.trim().toLowerCase()
  const commands = ['fix', 'update', 'up']

  if (commands.includes(input)) {
    return handler(m, { conn: this, args: [] })
  }
}

export default handler