// ⚔️ Código creado por DEVLYONN 👑
// 🛡️ BALDWIND IV - SISTEMA BANCARIO

let handler = async (m, { conn, usedPrefix, command, text }) => {
  // Inicializar usuario
  if (!global.db.data.users[m.sender]) {
    global.db.data.users[m.sender] = { registered: false, coins: 0, bank: 0 }
  }
  
  let user = global.db.data.users[m.sender]
  
  if (!user.registered) {
    return m.reply(`❌ *Ignora este mensaje*\n📌 ignora: *${usedPrefix}ignora*`)
  }

  const accion = command.toLowerCase()

  // Ver balance
  if (accion === 'balance' || accion === 'bal') {
    let text = `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n`
    text += `> 🏦 *ESTADO DE CUENTA*\n\n`
    text += `✦ 𝗗𝗜𝗡𝗘𝗥𝗢 𝗘𝗡 𝗠𝗔𝗡𝗢 ✦\n`
    text += `> 🪙 *Monedas:* ${user.coins || 0}\n\n`
    text += `✦ 𝗗𝗜𝗡𝗘𝗥𝗢 𝗘𝗡 𝗕𝗔𝗡𝗖𝗢 ✦\n`
    text += `> 💰 *Banco:* ${user.bank || 0}\n\n`
    text += `✦ 𝗧𝗢𝗧𝗔𝗟 ✦\n`
    text += `> 💎 *Patrimonio:* ${(user.coins || 0) + (user.bank || 0)}\n\n`
    text += `⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ ᴄʏʙᴇʀ ᴍᴇɴᴜ 🧬`
    return m.reply(text)
  }

  // Depositar o retirar
  let amount = parseInt(text)
  if (isNaN(amount) || amount <= 0) {
    return m.reply(`❌ *Cantidad inválida*\n📌 *Ejemplos:*\n${usedPrefix}deposit 100\n${usedPrefix}withdraw 50`)
  }

  // Depositar
  if (accion === 'deposit' || accion === 'dep') {
    if ((user.coins || 0) < amount) {
      return m.reply(`❌ *No tienes suficientes monedas*\n💰 Tienes: ${user.coins || 0}\n📌 Necesitas: ${amount}`)
    }
    
    user.coins = (user.coins || 0) - amount
    user.bank = (user.bank || 0) + amount
    
    await global.db.write()
    
    m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 💰 *DEPÓSITO EXITOSO*\n> 📥 *+${amount} monedas al banco*\n\n> 🪙 *Monedas restantes:* ${user.coins}\n> 🏦 *Banco:* ${user.bank}\n\n⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ ᴄʏʙᴇʀ ᴍᴇɴᴜ 🧬`)
  }

  // Retirar
  if (accion === 'withdraw' || accion === 'with') {
    if ((user.bank || 0) < amount) {
      return m.reply(`❌ *No tienes suficientes monedas en el banco*\n🏦 Banco: ${user.bank || 0}\n📌 Necesitas: ${amount}`)
    }
    
    user.bank = (user.bank || 0) - amount
    user.coins = (user.coins || 0) + amount
    
    await global.db.write()
    
    m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 💰 *RETIRO EXITOSO*\n> 📤 *-${amount} monedas del banco*\n\n> 🪙 *Monedas actuales:* ${user.coins}\n> 🏦 *Banco:* ${user.bank}\n\n⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ ᴄʏʙᴇʀ ᴍᴇɴᴜ 🧬`)
  }
}

handler.help = ['balance', 'deposit <cantidad>', 'withdraw <cantidad>']
handler.tags = ['rpg']
handler.command = ['balance', 'bal', 'deposit', 'dep', 'withdraw', 'retirar']
handler.register = false
export default handler