// ⚔️ Código creado por DEVLYONN 👑
// 🛡️ BALDWIND IV - YOUTUBE AUDIO DOWNLOADER

import fetch from "node-fetch"

const handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 🎵 *YOUTUBE AUDIO*\n> 📌 *Ejemplo:* ${usedPrefix + command} Bad Bunny\n> 👑 *Creador:* DEVLYONN`)

  await m.react("🎵")

  try {
    let query = text.trim()
    let title = "Desconocido"
    let authorName = "Desconocido"
    let durationTimestamp = "Desconocida"
    let views = 0
    let thumbnail = ""
    let videoUrl = ""

    // Verificar si es URL o búsqueda
    const isUrl = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(query)

    if (isUrl) {
      // Si es URL directa, usarla para descargar
      videoUrl = query
      title = "Procesando..."
      authorName = "YouTube"
      durationTimestamp = "?"
      views = 0
      thumbnail = "https://files.catbox.moe/o1q5sq.jpeg"
    } else {
      // Usar API de Gohan para buscar
      const searchUrl = `https://api-gohan.onrender.com/search/youtube?q=${encodeURIComponent(query)}`
      const searchRes = await fetch(searchUrl)
      const searchData = await searchRes.json()

      if (!searchData.status || !searchData.result || searchData.result.length === 0) {
        return m.reply(`❌ *No se encontraron resultados para:* ${query}`)
      }

      const video = searchData.result[0]
      title = video.title || title
      authorName = video.channel || authorName
      durationTimestamp = video.duration || durationTimestamp
      views = video.views || views
      thumbnail = video.thumbnail || thumbnail
      videoUrl = video.url || videoUrl
    }

    const vistas = formatViews(views)

    const fallbackThumbRes = await fetch("https://files.catbox.moe/o1q5sq.jpeg")
    const fallbackThumb = Buffer.from(await fallbackThumbRes.arrayBuffer())

    let caption = `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n`
    caption += `> 🎵 *INFORMACIÓN DEL AUDIO*\n\n`
    caption += `✦ 𝗗𝗘𝗧𝗔𝗟𝗟𝗘𝗦 ✦\n`
    caption += `> 🎼 *Título:* ${title}\n`
    caption += `> 📺 *Canal:* ${authorName}\n`
    caption += `> 👁️ *Vistas:* ${vistas}\n`
    caption += `> ⏱️ *Duración:* ${durationTimestamp}\n`
    caption += `> 🔗 *Enlace:* ${videoUrl}\n\n`
    caption += `✦ 𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔 ✦\n`
    caption += `> 📥 *Descargando audio...*\n\n`
    caption += `👑 *DEVLYONN*\n`
    caption += `⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ ᴄʏʙᴇʀ ᴍᴇɴᴜ 🧬`

    let thumb = fallbackThumb
    if (thumbnail && thumbnail !== "https://files.catbox.moe/o1q5sq.jpeg") {
      try {
        const thumbRes = await fetch(thumbnail)
        if (thumbRes.ok) thumb = Buffer.from(await thumbRes.arrayBuffer())
      } catch {
        thumb = fallbackThumb
      }
    }

    await conn.sendMessage(
      m.chat,
      {
        image: thumb,
        caption: caption,
        mentions: [m.sender]
      },
      { quoted: m }
    )

    await downloadMedia(conn, m, videoUrl)
    await m.react("✅")
  } catch (e) {
    console.error(e)
    await m.reply(`❌ *Error:* ${e.message}\n\n🛸 *BALDWIND IV*`)
    await m.react("⚠️")
  }
}

const downloadMedia = async (conn, m, url) => {
  try {
    const sent = await conn.sendMessage(
      m.chat,
      { text: `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 🎵 *DESCARGANDO AUDIO...*\n> ⏳ *Esto puede tomar unos segundos*` },
      { quoted: m }
    )

    const apiUrl = `https://api-gohan.onrender.com/download/ytaudio?url=${encodeURIComponent(url)}`
    const r = await fetch(apiUrl)

    if (!r.ok) {
      return m.reply(`❌ *Error HTTP ${r.status} al obtener el audio*`)
    }

    const data = await r.json()

    if (!data?.status || !data?.result?.download_url) {
      return m.reply(`❌ *No se pudo obtener el audio*`)
    }

    const fileUrl = data.result.download_url
    const fileTitle = cleanName(data.result.title || "audio")

    let caption = `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n`
    caption += `> 🎵 *DESCARGA COMPLETADA*\n\n`
    caption += `✦ 𝗗𝗘𝗧𝗔𝗟𝗟𝗘𝗦 ✦\n`
    caption += `> 🎼 *Título:* ${fileTitle}\n`
    caption += `> 🎧 *Calidad:* 128kbps\n\n`
    caption += `👑 *DEVLYONN*\n`
    caption += `⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ ᴄʏʙᴇʀ ᴍᴇɴᴜ 🧬`

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: fileUrl },
        mimetype: "audio/mpeg",
        fileName: `${fileTitle}.mp3`,
        ptt: false,
        caption: caption
      },
      { quoted: m }
    )

    try {
      await conn.sendMessage(
        m.chat,
        {
          text: `✅ *Descarga completada*\n\n🎼 *Título:* ${fileTitle}`,
          edit: sent.key
        }
      )
    } catch {
      await m.reply(`✅ *Descarga completada*\n\n🎼 *Título:* ${fileTitle}`)
    }
  } catch (e) {
    console.error(e)
    await m.reply(`❌ *Error:* ${e.message}`)
    await m.react("💀")
  }
}

const cleanName = (name) =>
  String(name).replace(/[^\w\s._-]/gi, "").substring(0, 50)

const formatViews = (views) => {
  const n = Number(views)
  if (!n || Number.isNaN(n)) return "No disponible"
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return n.toString()
}

handler.command = ["play", "ytaudio", "ytsearch", "audio"]
handler.tags = ["descargas"]
handler.register = false

export default handler