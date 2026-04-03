export async function getSkins() {
    const res = await fetch(
        "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json"
    )

    if (!res.ok) {
        throw new Error("Erro ao buscar skins")
    }

    return res.json()
}
