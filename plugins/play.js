// ⚔️ Código creado por DEVLYONN 👑
// 🛡️ BALDWIND IV - YOUTUBE AUDIO DOWNLOADER

import yts from "yt-search"
import fetch from "node-fetch"

const handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n> 🎵 *YOUTUBE AUDIO*\n> 📌 *Ejemplo:* ${usedPrefix + command} Bad Bunny\n> 👑 *Creador:* DEVLYONN`)

  await m.react("🎵")

  try {
    let url = text.trim()
    let title = "Desconocido"
    let authorName = "Desconocido"
    let durationTimestamp = "Desconocida"
    let views = 0
    let thumbnail = ""

    const isUrl = /^https?:\/\/\S+/i.test(url)

    if (isUrl) {
      if (!isYouTubeUrl(url)) {
        return m.reply(`❌ *URL no válida*\n📌 Usa: ${usedPrefix + command} https://youtu.be/xxxx`)
      }

      const videoId = extractVideoId(url)
      if (!videoId) {
        return m.reply(`❌ *No se pudo extraer el ID del video*`)
      }

      const res = await yts({ videoId })

      if (!res) {
        return m.reply(`❌ *No se pudo obtener información del video*`)
      }

      title = res.title || title
      authorName = res.author?.name || authorName
      durationTimestamp = res.timestamp || durationTimestamp
      views = res.views || views
      thumbnail = res.thumbnail || thumbnail
      url = res.url || url
    } else {
      const res = await yts(url)

      if (!res?.videos?.length) {
        return m.reply(`❌ *No se encontraron resultados para:* ${text}`)
      }

      const video = res.videos[0]
      title = video.title || title
      authorName = video.author?.name || authorName
      durationTimestamp = video.timestamp || durationTimestamp
      views = video.views || views
      url = video.url || url
      thumbnail = video.thumbnail || thumbnail
    }

    const vistas = formatViews(views)

    const fallbackThumbRes = await fetch("https://files.catbox.moe/o1q5sq.jpeg")
    const fallbackThumb = Buffer.from(await fallbackThumbRes.arrayBuffer())

    // CORREGIDO: usar let en lugar de const para poder concatenar
    let caption = `—͟͟͞͞   *🜸 ʙᴀʟᴅᴡɪɴᴅ ɪᴠ  🛸  ᴄʏʙᴇʀ ᴄᴏʀᴇ  🜸* »\n`
    caption += `> 🎵 *INFORMACIÓN DEL AUDIO*\n\n`
    caption += `✦ 𝗗𝗘𝗧𝗔𝗟𝗟𝗘𝗦 ✦\n`
    caption += `> 🎼 *Título:* ${title}\n`
    caption += `> 📺 *Canal:* ${authorName}\n`
    caption += `> 👁️ *Vistas:* ${vistas}\n`
    caption += `> ⏱️ *Duración:* ${durationTimestamp}\n`
    caption += `> 🔗 *Enlace:* ${url}\n\n`
    caption += `✦ 𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔 ✦\n`
    caption += `> 📥 *Descargando audio...*\n\n`
    caption += `👑 *DEVLYONN*\n`
    caption += `⌬ ʙᴀʟᴅᴡɪɴᴅ ɪᴠ ᴄʏʙᴇʀ ᴍᴇɴᴜ 🧬`

    let thumb = fallbackThumb

    if (thumbnail) {
      try {
        thumb = (await conn.getFile(thumbnail)).data
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

    await downloadMedia(conn, m, url)
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

    // CORREGIDO: usar let en lugar de const
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

const isYouTubeUrl = (url) => {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(url)
}

const extractVideoId = (url) => {
  const match =
    url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:[?&/]|\b)/) ||
    url.match(/youtu\.be\/([0-9A-Za-z_-]{11})/)
  return match?.[1] || null
}

handler.command = ["play", "yt", "ytsearch", "audio"]
handler.tags = ["descargas"]
handler.register = false

export default handler