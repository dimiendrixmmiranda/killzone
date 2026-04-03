interface SobreOJogo {
    titulo: string
    conteudo: string[]
}

export interface Noticia {
    id: string
    slug: string
    titulo: string
    resumo: string
    thumbnail: string
    dataPublicacao: string
    autor: string
    conteudo?: string[]
    sobreOJogo?: SobreOJogo[]

    jogoId?: string
    timesIds?: string[]
    jogadoresIds?: string[]
    campeonatoId?: string
    partidaId?: string
    tags?: string[]

    timesRelacionados?: string[]
}