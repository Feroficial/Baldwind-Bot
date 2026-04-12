// plugins/event-listener.js
// Este archivo se va a ejecutar cuando ocurran eventos

export async function before(m, { conn, isAdmin, isBotAdmin }) {
  // Detectar eventos de grupo
  if (m.isGroup) {
    // Verificar si es un mensaje de sistema (entrada/salida)
    if (m.messageStubType === 27) {
      console.log('🔔 Alguien se unió al grupo:', m.messageStubParameters)
      conn.sendMessage(m.chat, { text: `🔔 DEBUG: Evento ADD detectado\nParticipantes: ${JSON.stringify(m.messageStubParameters)}` })
    }
    if (m.messageStubType === 29) {
      console.log('🔔 Alguien salió del grupo:', m.messageStubParameters)
      conn.sendMessage(m.chat, { text: `🔔 DEBUG: Evento REMOVE detectado\nParticipantes: ${JSON.stringify(m.messageStubParameters)}` })
    }
  }
  return true
}

export const disabled = false