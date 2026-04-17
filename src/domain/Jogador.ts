import ConquistasJogagor from "./ConquistasJogador";

export interface Jogador {
    id: string
    nome: string
    apelido: string
    pais: string
    imagem: string
    jogoId: string
    timeAtual: string  // acho que tem que sair e pegar pelas transferencias
    status: "ativo" | "banco" | "inativo" | "stand-in" | "default"
    sinergia: number
    highlights: string
    papel: string
    estilo: string
    categoria: string | null
    
    forma?: {
        resultado: 'V' | 'D' | 'E'
        rating: number
        data: string
        adversarioId: string
        campeonatoId: string
        placar: string
    }[]

    // 🔹 DADOS BRUTOS (fonte da verdade)
    estatisticasCombate?: {
        partidas: number
        kills: number
        deaths: number
        assists: number
        damageTotal: number
        headshots: number
        roundsJogadas: number
        roundsVencidas: number
    }

    estatisticasImpacto?: {
        firstKills: number
        firstDeaths: number
        clutchTentativas: number
        clutchVitorias: number
        multikills: {
            double: number
            triple: number
            quad: number
            ace: number
        }
    }

    estatisticasPorMapa?: {
        mapa: string
        imagem: string
        partidasJogadas: number
        partidasVencidas: number
        partidasPerdidas: number
        roundsJogadas: number
        roundsVencidas: number
        kills: number
        deaths: number
        clutchVitorias: number
    }[]

    estatisticasPorTime?: {
        timeId: string
        inicio: string
        fim?: string
        kills: number
        deaths: number
        roundsJogadas: number
        titulos: number
    }[]

    historicoTimes?: {
        timeId: string
        inicio: string
        fim?: string
    }[]

    // 🔹 CONTEÚDO (ok armazenar)
    conquistas?: ConquistasJogagor[]

    redesSociais?: {
        twitter?: string
        twitch?: string
        instagram?: string
    }

    // 🔹 SETTINGS (ok armazenar)
    mouseSettings?: {
        dpi: number
        sensitivity: number
        hz: number
        zoomSensitivity: number
        windowsSensitivity: number
    }

    videoSettings?: {
        resolution: string
        aspectRatio: string
        scalingMode: string
        displayMode: string
        brightness: string
        refreshRate: string
    }

    crosshairCodes?: string[]
    viewmodel?: string
    hud?: string
    radar?: string
    lounchOptions?: string

    advancedSettings?: {
        boostPlayerContrast: string
        waitForVerticalSync: string
        NVIDIAGSync: string
        NVIDIAReflexLowLatency: string
        maxFPSinGame: string
        multisampling: string
        globalShadowQuality: string
        dynamicShadows: string
        modelTextureDetail: string
        textureFilteringMode: string
        shaderDetail: string
        particleDetail: string
        ambientOcclusion: string
        highDynamicRange: string
        fidelityFXSuperResolution: string
    }
}
