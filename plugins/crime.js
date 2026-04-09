// ⚔️ Código creado por 🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸
// 🛡️ BALDWIND IV - SISTEMA DE CRIMEN

let handler = async (m, { conn, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender]
  
  // Verificar si está registrado
  if (!user.registered) {
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *No estás registrado*\n> 📌 Usa: *${usedPrefix}registrar Nombre.Edad*\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  // Cooldown de 3 minutos
  const cooldown = 3 * 60 * 1000
  const now = Date.now()
  
  if (user.crimeCooldown && now - user.crimeCooldown < cooldown) {
    const remaining = cooldown - (now - user.crimeCooldown)
    const minutes = Math.floor(remaining / 60000)
    const seconds = Math.floor((remaining % 60000) / 1000)
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ⏳ *ESPERA PARA VOLVER A DELINQUIR*\n> 📌 Vuelve en *${minutes}m ${seconds}s*\n\n👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*`)
  }
  
  // Lista de crímenes
  const crimenes = [
    { nombre: '🏦 Robo al banco real', gananciaMin: 800, gananciaMax: 2000, expMin: 40, expMax: 80, riesgo: 50 },
    { nombre: '💎 Robo de joyas del reino', gananciaMin: 500, gananciaMax: 1200, expMin: 30, expMax: 60, riesgo: 40 },
    { nombre: '🚗 Robo de carruaje real', gananciaMin: 300, gananciaMax: 800, expMin: 20, expMax: 40, riesgo: 30 },
    { nombre: '🏠 Robo a mansión noble', gananciaMin: 200, gananciaMax: 600, expMin: 15, expMax: 30, riesgo: 25 },
    { nombre: '💰 Carterista en el mercado', gananciaMin: 100, gananciaMax: 400, expMin: 10, expMax: 20, riesgo: 20 },
    { nombre: '🔮 Robo de artefactos mágicos', gananciaMin: 600, gananciaMax: 1500, expMin: 35, expMax: 70, riesgo: 45 },
    { nombre: '⚔️ Asalto a caravana', gananciaMin: 400, gananciaMax: 1000, expMin: 25, expMax: 50, riesgo: 35 }
  ]
  
  // Elegir crimen según nivel
  const nivel = user.level || 1
  let crimenIndex = Math.min(Math.floor(nivel / 5), crimenes.length - 1)
  const crimen = crimenes[crimenIndex]
  
  // Calcular ganancia
  const ganancia = Math.floor(Math.random() * (crimen.gananciaMax - crimen.gananciaMin + 1) + crimen.gananciaMin)
  const expGanada = Math.floor(Math.random() * (crimen.expMax - crimen.expMin + 1) + crimen.expMin)
  
  // Sistema de riesgo (puedes fallar)
  const suerte = Math.floor(Math.random() * 100) + 1
  const exito = suerte > crimen.riesgo
  
  // Bonus por nivel
  const bonusNivel = Math.floor(nivel / 4)
  
  // Mensajes de éxito/fracaso
  const mensajesExito = [
    `Lograste infiltrarte sin ser detectado`,
    `Los guardias te persiguieron pero escapaste con el botín`,
    `Usaste magia oscura para completar el golpe`,
    `Nadie sospechó de ti, fue un golpe perfecto`,
    `La suerte estuvo de tu lado esta vez`
  ]
  
  const mensajesFracaso = [
    `Fuiste atrapado por los guardias reales`,
    `La alarma se activó y tuviste que huir con las manos vacías`,
    `Un hechizo de protección te impidió robar`,
    `Testigos alertaron a las autoridades`,
    `El objetivo estaba protegido por magia antigua`
  ]
  
  let resultado = ''
  let gananciaFinal = 0
  let expFinal = 0
  let textoEvento = ''
  
  if (exito) {
    gananciaFinal = ganancia + bonusNivel
    expFinal = expGanada + bonusNivel
    resultado = mensajesExito[Math.floor(Math.random() * mensajesExito.length)]
    textoEvento = `✅ *GOLPE EXITOSO*`
  } else {
    gananciaFinal = 0
    expFinal = Math.floor(expGanada / 3)
    resultado = mensajesFracaso[Math.floor(Math.random() * mensajesFracaso.length)]
    textoEvento = `❌ *GOLPE FALLIDO*`
  }
  
  // Aplicar cambios
  user.coins = (user.coins || 0) + gananciaFinal
  user.exp = (user.exp || 0) + expFinal
  user.crimeCooldown = now
  
  // Verificar subida de nivel
  let nivelUp = false
  const nextExp = (user.level || 1) * 100
  if (user.exp >= nextExp) {
    user.level = (user.level || 1) + 1
    user.exp = user.exp - nextExp
    user.strength = (user.strength || 5) + 2
    user.defense = (user.defense || 3) + 1
    nivelUp = true
  }
  
  await global.db.write()
  
  // Construir mensaje
  let text = `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n`
  text += `> 🔪 *${textoEvento}* 🔪\n\n`
  text += `✦ 𝗗𝗘𝗧𝗔𝗟𝗟𝗘𝗦 𝗗𝗘𝗟 𝗚𝗢𝗟𝗣𝗘 ✦\n`
  text += `> 🎯 *Crimen:* ${crimen.nombre}\n`
  text += `> 📝 *Resultado:* ${resultado}\n`
  text += `> 💰 *Ganancia:* +${gananciaFinal} monedas\n`
  text += `> 📚 *Experiencia:* +${expFinal}\n`
  
  if (bonusNivel > 0 && exito) {
    text += `> ✨ *Bonus nivel:* +${bonusNivel}\n`
  }
  
  text += `\n✦ 𝗘𝗦𝗧𝗔𝗗𝗢 𝗔𝗖𝗧𝗨𝗔𝗟 ✦\n`
  text += `> 🪙 *Monedas:* ${user.coins}\n`
  text += `> 📚 *Experiencia:* ${user.exp}/${nextExp}\n`
  text += `> ⚡ *Nivel:* ${user.level || 1}\n`
  
  if (nivelUp) {
    text += `\n✨ *¡SUBISTE DE NIVEL!* ✨\n`
    text += `> 💪 *Fuerza:* ${user.strength}\n`
    text += `> 🛡️ *Defensa:* ${user.defense}\n`
  }
  
  text += `\n⧼⋆꙳•〔 🛸 𝗕𝗔𝗟𝗗𝗪𝗜𝗡𝗗 𝗜𝗩 〕⋆꙳•⧽\n`
  text += `> 👑 *🜸 𝘿𝙀𝙑𝙇𝙔𝙊𝙉𝙉 🜸*\n`
  text += `╰⋆꙳•❅‧*₊⋆꙳︎‧*❆₊⋆╯\n`
  text += `⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ ᴄʏʙᴇʀ ᴍᴇɴᴜ 🧬`
  
  await conn.sendMessage(m.chat, { text: text }, { quoted: m })
}

handler.help = ['crime']
handler.tags = ['rpg']
handler.command = ['crime', 'robar', 'delinquir']
handler.register = false

export default handler