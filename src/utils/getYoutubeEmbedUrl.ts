export default function getYoutubeEmbedUrl(url?: string) {
    if (!url) return null

    const regExp =
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/

    const match = url.match(regExp)

    return match
        ? `https://www.youtube.com/embed/${match[1]}`
        : null
}