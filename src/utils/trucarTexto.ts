export default function truncarTexto(texto: string, limite = 12) {
    if (texto.length <= limite) return texto
    return texto.slice(0, limite) + "..."
}