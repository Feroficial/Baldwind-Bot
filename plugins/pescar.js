// ⚔️ Código creado por DEVLYONN 👑
// 🛡️ BALDWIND IV - SISTEMA DE PESCA

import fetch from 'node-fetch'

// Imagen del lago/agua
const LAGO_IMG = 'https://files.catbox.moe/o1q5sq.jpeg'

// Lista de peces y recursos que se pueden pescar
const peces = [
  { nombre: '🐟 Sardina', valor: 15, min: 3, max: 8, exp: 5 },
  { nombre: '🐠 Pez payaso', valor: 25, min: 2, max: 6, exp: 8 },
  { nombre: '🐡 Pez globo', valor: 40, min: 2, max: 5, exp: 10 },
  { nombre: '🦑 Calamar', valor: 60, min: 2, max: 4, exp: 12 },
  { nombre: '🐙 Pulpo', valor: 80, min: 1, max: 4, exp: 15 },
  { nombre: '🦞 Langosta', valor: 120, min: 1, max: 3, exp: 18 },
  { nombre: '🐟 Salmón', valor: 100, min: 2, max: 5, exp: 15 },
  { nombre: '🐉 Pez dragón', valor: 500, min: 1, max: 2, exp: 50 },
  { nombre: '👟 Bota vieja', valor: 1, min: 1, max: 1, exp: 1 },
  { nombre: '🪣 Cubo de agua', valor: 5, min: 1, max: 2, exp: 2 },
  { nombre: '🔮 Concha mágica', valor: 200, min: 1, max: 1, exp: 25 },
  { nombre: '💍 Anillo perdido', valor: 300, min: 1, max: 1, exp: 30 }
]

// Eventos especiales
const eventos = [
  { nombre: '🐋 Ballena gigante', perdida: false, multiplicador: 2, texto: 'Una ballena gigante revuelve el agua' },
  { nombre: '🌊 Tormenta marina', perdida: true, valor: 30, texto: 'Una tormenta arrastra parte de tu pesca' },
  { nombre: '✨ Aguas brillantes', perdida: false, multiplicador: 1.5, texto: 'El agua brilla misteriosamente' },
  { nombre: '🎣 Caña especial', perdida: false, multiplicador: 1.3, texto: 'Tu caña brilla con energía mágica' },
  { nombre: '🪝 Línea rota', perdida: true, valor: 20, texto: 'La línea de pesca se rompe' }
]

let handler = async (m, { conn, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender]
  
  // Verificar si está registrado
  if (!user.registered) {
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ❌ *No estás registrado*\n> 📌 Usa: *${usedPrefix}registrar Nombre.Edad*\n\n👑 *DEVLYONN*`)
  }
  
  // Cooldown de 20 minutos
  const cooldown = 20 * 60 * 1000
  const now = Date.now()
  
  if (user.fishCooldown && now - user.fishCooldown < cooldown) {
    const remaining = cooldown - (now - user.fishCooldown)
    const minutes = Math.floor(remaining / 60000)
    const seconds = Math.floor((remaining % 60000) / 1000)
    return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> ⏳ *LAGO TRANQUILO*\n> 📌 Vuelve en *${minutes}m ${seconds}s*\n\n👑 *DEVLYONN*`)
  }
  
  // Calcular suerte y nivel del pescador
  const suerte = Math.floor(Math.random() * 100) + 1
  const nivel = user.level || 1
  
  // Seleccionar pez según suerte
  let pezIndex = 0
  if (suerte > 95) pezIndex = 7 // Pez dragón
  else if (suerte > 85) pezIndex = 10 // Concha mágica
  else if (suerte > 75) pezIndex = 11 // Anillo perdido
  else if (suerte > 65) pezIndex = 6 // Salmón
  else if (suerte > 55) pezIndex = 5 // Langosta
  else if (suerte > 45) pezIndex = 4 // Pulpo
  else if (suerte > 35) pezIndex = 3 // Calamar
  else if (suerte > 25) pezIndex = 2 // Pez globo
  else if (suerte > 15) pezIndex = 1 // Pez payaso
  else if (suerte > 5) pezIndex = 0 // Sardina
  else if (suerte > 2) pezIndex = 8 // Bota vieja
  else pezIndex = 9 // Cubo de agua
  
  const pez = peces[pezIndex]
  const cantidad = Math.floor(Math.random() * (pez.max - pez.min + 1) + pez.min)
  
  // Evento aleatorio (15% de probabilidad)
  const tieneEvento = Math.random() < 0.15
  let evento = null
  let gananciaTotal = pez.valor * cantidad
  let expGanada = pez.exp * cantidad
  
  if (tieneEvento) {
    evento = eventos[Math.floor(Math.random() * eventos.length)]
    if (evento.perdida) {
      gananciaTotal = Math.max(1, gananciaTotal - evento.valor)
      expGanada = Math.max(1, expGanada - 5)
    } else if (evento.multiplicador) {
      gananciaTotal = Math.floor(gananciaTotal * evento.multiplicador)
      expGanada = Math.floor(expGanada * evento.multiplicador)
    }
  }
  
  // Bonus por nivel
  const bonusNivel = Math.floor(nivel / 5)
  gananciaTotal += bonusNivel
  expGanada += bonusNivel
  
  user.coins = (user.coins || 0) + gananciaTotal
  user.exp = (user.exp || 0) + expGanada
  user.fishCooldown = now
  
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
  
  // Agregar al inventario si tiene sistema de inventario
  if (user.inventory) {
    user.inventory.push({ 
      name: pez.nombre, 
      quantity: cantidad, 
      type: 'pescado',
      date: new Date().toISOString()
    })
  }
  
  await global.db.write()
  
  // Descargar imagen del lago
  let lagoImg = null
  try {
    const imgRes = await fetch(LAGO_IMG)
    if (imgRes.ok) lagoImg = Buffer.from(await imgRes.arrayBuffer())
  } catch (e) {}
  
  // Construir mensaje
  let text = `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n`
  text += `> 🎣 *PESCA EXITOSA* 🎣\n\n`
  text += `✦ 𝗥𝗘𝗖𝗨𝗥𝗦𝗢 𝗢𝗕𝗧𝗘𝗡𝗜𝗗𝗢 ✦\n`
  text += `> 🐟 *Captura:* ${pez.nombre}\n`
  text += `> 📦 *Cantidad:* ${cantidad}\n`
  text += `> 💰 *Valor unitario:* ${pez.valor} monedas\n`
  text += `> 💎 *Ganancia:* +${gananciaTotal} monedas\n`
  text += `> 📚 *Experiencia:* +${expGanada}\n`
  
  if (bonusNivel > 0) {
    text += `> ✨ *Bonus nivel:* +${bonusNivel}\n`
  }
  
  if (evento) {
    text += `\n✦ 🌊 *EVENTO* 🌊\n`
    text += `> ${evento.texto}\n`
    if (evento.perdida) {
      text += `> 💔 *Has perdido:* ${evento.valor} monedas\n`
    } else if (evento.multiplicador) {
      text += `> 📈 *Multiplicador x${evento.multiplicador}*\n`
    }
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
  text += `> 👑 *DEVLYONN*\n`
  text += `╰⋆꙳•❅‧*₊⋆꙳︎‧*❆₊⋆╯\n`
  text += `⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ ᴄʏʙᴇʀ ᴍᴇɴᴜ 🧬`
  
  await conn.sendMessage(m.chat, {
    image: lagoImg,
    caption: text,
    mentions: [m.sender]
  }, { quoted: m })
}

handler.help = ['pescar']
handler.tags = ['rpg']
handler.command = ['pescar', 'fish']
handler.register = false

export default handler