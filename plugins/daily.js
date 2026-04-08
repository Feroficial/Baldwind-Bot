// ⚔️ Código creado por DEVLYONN 👑

let handler = async (m, { conn, usedPrefix }) => {
  // Inicializar usuario si no existe
  if (!global.db.data.users[m.sender]) {
    global.db.data.users[m.sender] = { registered: false, coins: 0, bank: 0, dailyClaim: 0 }
  }
  
  let user = global.db.data.users[m.sender]
  
  if (!user.registered) {
    return m.reply(`❌ *No estás registrado*\n📌 Usa: *${usedPrefix}registrar Nombre.Edad*`)
  }

  let now = Date.now()
  let dailyCooldown = 24 * 60 * 60 * 1000

  if (user.dailyClaim && now - user.dailyClaim < dailyCooldown) {
    let remaining = dailyCooldown - (now - user.dailyClaim)
    let hours = Math.floor(remaining / (60 * 60 * 1000))
    let minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))
    return m.reply(`⏳ *Ya reclamaste tu recompensa*\n📌 Espera *${hours}h ${minutes}m*`)
  }

  let reward = 500
  user.coins = (user.coins || 0) + reward
  user.dailyClaim = now
  
  await global.db.write()

  m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 📅 *RECOMPENSA DIARIA*\n> 💰 *+${reward} monedas*\n\n> 🪙 *Monedas:* ${user.coins}\n> 🏦 *Banco:* ${user.bank}`)
}

handler.help = ['daily']
handler.tags = ['rpg']
handler.command = ['daily', 'reclamar']
export default handler