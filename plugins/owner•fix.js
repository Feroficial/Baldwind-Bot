// ⚔️ Código creado por DEVLYONN 👑
// 🛡️ BALDWIND IV - ACTUALIZAR REPOSITORIO

import { execSync } from 'child_process'

let handler = async (m, { conn, usedPrefix, command, text }) => {
  let rwait = '⏳'
  let done = '✅'
  let error = '❌'

  try {
    await m.react(rwait)
    
    if (conn.user.jid == conn.user.jid) {
      // Verificar si hay cambios locales
      let statusOutput = ''
      try {
        statusOutput = execSync('git status --porcelain').toString()
      } catch (e) {}
      
      let resultado = ''
      
      if (statusOutput.length > 0) {
        // Hay cambios locales, hacer stash primero
        resultado += '📦 *Cambios locales detectados, guardando...*\n'
        execSync('git stash push -m "BALDWIND IV - Backup automático"')
        resultado += '✅ *Cambios guardados temporalmente*\n\n'
      }
      
      // Hacer git pull
      let pullOutput = execSync('git pull' + (text ? ' ' + text : '')).toString()
      resultado += `🔄 *ACTUALIZACIÓN COMPLETADA*\n📦 \`${pullOutput.trim()}\``
      
      // Restaurar stash si había
      if (statusOutput.length > 0) {
        try {
          execSync('git stash pop')
          resultado += '\n\n📂 *Cambios locales restaurados*'
        } catch (e) {
          resultado += '\n\n⚠️ *No se pudieron restaurar los cambios locales*'
        }
      }
      
      let caption = `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n`
      caption += `> 🔄 *ACTUALIZACIÓN*\n\n`
      caption += `✦ 𝗥𝗘𝗦𝗨𝗟𝗧𝗔𝗗𝗢 ✦\n`
      caption += `${resultado}\n\n`
      caption += `👑 *DEVLYONN*\n`
      caption += `⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ ᴄʏʙᴇʀ ᴍᴇɴᴜ 🧬`
      
      await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
      await m.react(done)
    }
  } catch (e) {
    await m.react(error)
    
    let errorMsg = e.message || ''
    let solucion = ''
    
    if (errorMsg.includes('conflict')) {
      solucion = '\n\n📌 *Para resolver manualmente:*\n1. Ejecuta: *git reset --hard HEAD*\n2. Luego: *git pull*\n3. Reinicia el bot'
    } else if (errorMsg.includes('uncommitted')) {
      solucion = '\n\n📌 *Para resolver:*\n1. Ejecuta: *git stash*\n2. Luego: *git pull*\n3. Ejecuta: *git stash pop*'
    } else {
      solucion = '\n\n📌 Para actualizar manualmente:\n*git reset --hard HEAD && git pull*'
    }
    
    await m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *ERROR EN ACTUALIZACIÓN*\n\n> ⚠️ *${errorMsg.split('\n')[0]}*\n${solucion}\n\n👑 *DEVLYONN*`)
  }
}

handler.help = ['fix', 'update', 'actualizar']
handler.tags = ['owner']
handler.command = ['fix', 'update', 'actualizar']
handler.rowner = true

export default handler