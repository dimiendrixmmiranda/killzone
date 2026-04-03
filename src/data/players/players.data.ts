import { NextResponse } from "next/server";
import { Jogador } from "@/src/domain/Jogador";

export const players: Jogador[] = [
    // furia
    {
        id: "FalleN",
        nome: "Gabriel Toledo",
        apelido: "FalleN",
        pais: "br",
        status: "ativo",
        sinergia: 97,
        jogoId: "cs2",
        highlights: 'https://www.youtube.com/watch?v=poTRUphIZyQ',
        timeAtual: "furia",
        imagem: "https://static.cdnlive.com.br/uploads/602/etc/16883982877481.png?ims=fit-in/800x",

        forma: [
            {
                resultado: 'V',
                rating: 1.21,
                data: '2026-02-12',
                adversarioId: 'liquid',
                campeonatoId: 'iem-katowice-2026',
                placar: '13-7'
            },
            {
                resultado: 'V',
                rating: 1.08,
                data: '2026-02-10',
                adversarioId: 'complexity',
                campeonatoId: 'iem-katowice-2026',
                placar: '13-7'
            },
            {
                resultado: 'D',
                rating: 0.89,
                data: '2026-02-08',
                adversarioId: 'vitality',
                campeonatoId: 'iem-katowice-2026',
                placar: '7-13'
            },
            {
                resultado: 'V',
                rating: 1.34,
                data: '2026-02-05',
                adversarioId: 'navi',
                campeonatoId: 'blast-premier-spring-groups-2026',
                placar: '13-7'
            },
            {
                resultado: 'V',
                rating: 1.17,
                data: '2026-02-03',
                adversarioId: 'g2',
                campeonatoId: 'blast-premier-spring-groups-2026',
                placar: '13-7'
            }
        ],


        papel: "igl",
        estilo: "controlado",

        historicoTimes: [
            { timeId: "imperial", inicio: "2016-01-01", fim: "2018-06-01" },
            { timeId: "mibr", inicio: "2018-06-01", fim: "2023-06-01" },
            { timeId: "furia", inicio: "2024-01-01" },
        ],

        // Dados Brutos
        estatisticasCombate: {
            partidas: 6000,
            kills: 21000,
            deaths: 20000,
            assists: 5200,
            damageTotal: 1500000,
            headshots: 8200,
            roundsJogadas: 20000,
            roundsVencidas: 11200,
        },
        estatisticasImpacto: {
            firstKills: 3100,
            firstDeaths: 2800,
            clutchTentativas: 900,
            clutchVitorias: 320,
            multikills: {
                double: 1800,
                triple: 420,
                quad: 95,
                ace: 18,
            },
        },
        estatisticasPorMapa: [
            {
                mapa: "Inferno",
                imagem: "/jogos/cs2/mapas/inferno.jpg",
                partidasJogadas: 420,
                partidasVencidas: 245,
                partidasPerdidas: 175,
                roundsJogadas: 5200,
                roundsVencidas: 3000,
                kills: 6200,
                deaths: 5800,
                clutchVitorias: 110,
            },
            {
                mapa: "Mirage",
                imagem: "/jogos/cs2/mapas/inferno.jpg",
                partidasJogadas: 390,
                partidasVencidas: 210,
                partidasPerdidas: 180,
                roundsJogadas: 4900,
                roundsVencidas: 2650,
                kills: 5800,
                deaths: 5600,
                clutchVitorias: 95,
            },
            {
                mapa: "Nuke",
                imagem: "/jogos/cs2/mapas/inferno.jpg",
                partidasJogadas: 310,
                partidasVencidas: 205,
                partidasPerdidas: 105,
                roundsJogadas: 4100,
                roundsVencidas: 2450,
                kills: 5000,
                deaths: 4600,
                clutchVitorias: 130,
            },
            {
                mapa: "Overpass",
                imagem: "/jogos/cs2/mapas/inferno.jpg",
                partidasJogadas: 280,
                partidasVencidas: 150,
                partidasPerdidas: 130,
                roundsJogadas: 3800,
                roundsVencidas: 1950,
                kills: 4600,
                deaths: 4400,
                clutchVitorias: 88,
            },
            {
                mapa: "Ancient",
                imagem: "/jogos/cs2/mapas/inferno.jpg",
                partidasJogadas: 190,
                partidasVencidas: 92,
                partidasPerdidas: 98,
                roundsJogadas: 2600,
                roundsVencidas: 1250,
                kills: 3100,
                deaths: 3300,
                clutchVitorias: 54,
            },
        ],

        // Conteudo estático
        conquistas: [
            {
                nome: "IEM Katowice",
                ano: 2017,
                timeId: "furia",
                trofeuCompeticao: "/default/trofeu/trofeu.png",
            },
            {
                nome: "Major Legends Stage",
                ano: 2022,
                timeId: "furia",
                trofeuCompeticao: "/default/trofeu/trofeu.png",
            },
        ],

        // Configurações
        mouseSettings: {
            dpi: 400,
            sensitivity: 2.2,
            hz: 1000,
            zoomSensitivity: 1.0,
            windowsSensitivity: 6,
        },
        videoSettings: {
            resolution: "1024x768",
            aspectRatio: "4:3",
            scalingMode: "Stretched",
            displayMode: "Fullscreen",
            brightness: "93%",
            refreshRate: "359Hz",
        },
        crosshairCodes: [
            "CSGO-EFyBb-4Ubiz-QBpBi-JDRWV-WrybE",
            "CSGO-TpORA-p9Ley-TLQ3P-HzXJY-U9z6A",
            "CSGO-JKyBM-UYLuG-bUyuL-uPkEJ-CuSyL",
        ],
        viewmodel:
            "viewmodel_fov 60; viewmodel_offset_x 1; viewmodel_offset_y 1; viewmodel_offset_z -1; viewmodel_presetpos 1;",
        hud:
            "cl_allow_animated_avatars 0; cl_drawhud 1; cl_hud_color 10.000; cl_show_clan_in_death_notice 1; cl_showfps 0; cl_showloadout 0; cl_teamcounter_playercount_instead_of_avatars 0; hud_scaling 0.950; hud_showtargetid 1; safezonex 1; safezoney 1",
        radar:
            "cl_drawhud_force_radar 0; cl_hud_radar_scale 1; cl_radar_always_centered 1; cl_radar_icon_scale_min 0.6; cl_radar_rotate 1; cl_radar_scale 0.7; cl_radar_square_with_scoreboard 1; cl_teammate_colors_show 1",
        lounchOptions:
            "-w 1024 -h 768 -tickrate 128 -refresh 240 -novid",
        advancedSettings: {
            boostPlayerContrast: "Enabled",
            waitForVerticalSync: "Disabled",
            NVIDIAGSync: "Disabled",
            NVIDIAReflexLowLatency: "Enabled + Boost",
            maxFPSinGame: "999",
            multisampling: "4x MSAA",
            globalShadowQuality: "High",
            dynamicShadows: "All",
            modelTextureDetail: "Low",
            textureFilteringMode: "Trilinear",
            shaderDetail: "Low",
            particleDetail: "Low",
            ambientOcclusion: "Disabled",
            highDynamicRange: "Quality",
            fidelityFXSuperResolution: "Disabled",
        },
    },
    {
        id: "kscerato",
        nome: "Kaike Cerato",
        apelido: "KSCERATO",
        pais: "br",
        imagem: "https://img-cdn.hltv.org/playerbodyshot/kscerato.png",
        jogoId: "cs2",
        timeAtual: "furia",
        status: "ativo",
        sinergia: 92,
        highlights: "https://www.youtube.com/watch?v=kscerato-highlights",

        papel: "rifler",
        estilo: "controlado"
    },
    {
        id: "yuurih",
        nome: "Yuri Santos",
        apelido: "yuurih",
        pais: "br",
        imagem: "",
        jogoId: "cs2",
        timeAtual: "furia",
        status: "ativo",
        sinergia: 91,
        highlights: "https://www.youtube.com/watch?v=yuurih-highlights",

        papel: "rifler",
        estilo: "híbrido"
    },
    {
        id: "yekindar",
        nome: "Mareks Gaļinskis",
        apelido: "YEKINDAR",
        pais: "lv",
        imagem: "https://img-cdn.hltv.org/playerbodyshot/yekindar.png",
        jogoId: "cs2",
        timeAtual: "furia",
        status: "ativo",
        sinergia: 88,
        highlights: "https://www.youtube.com/watch?v=yekindar",

        papel: "entry",
        estilo: "agressivo"
    },
    {
        id: "molodoy",
        nome: "Danil Golubenko",
        apelido: "molodoy",
        pais: "kz",
        imagem: "",
        jogoId: "cs2",
        timeAtual: "furia",
        status: "ativo",
        sinergia: 84,
        highlights: "https://www.youtube.com/watch?v=molodoy",

        papel: "awper",
        estilo: "agressivo"
    },
    // imperial
    {
        id: "vini",
        nome: "Vinicius Figueiredo",
        apelido: "VINI",
        pais: "br",
        imagem: "https://img-cdn.hltv.org/playerbodyshot/vini.png",
        jogoId: "cs2",
        timeAtual: "imperial",
        status: "ativo",
        sinergia: 88,
        highlights: "https://www.youtube.com/watch?v=8yqKX9pKfXk",

        papel: "igl",
        estilo: "controlado"
    },
    {
        id: "noway",
        nome: "Kaiky Santos",
        apelido: "noway",
        pais: "br",
        imagem: "https://img-cdn.hltv.org/playerbodyshot/noway.png",
        jogoId: "cs2",
        timeAtual: "imperial",
        status: "ativo",
        sinergia: 84,
        highlights: "https://www.youtube.com/watch?v=RjC2cs2noway",

        papel: "rifler",
        estilo: "agressivo"
    },
    {
        id: "chelo",
        nome: "Marcelo Cespedes",
        apelido: "chelo",
        pais: "br",
        imagem: "https://img-cdn.hltv.org/playerbodyshot/chelo.png",
        jogoId: "cs2",
        timeAtual: "imperial",
        status: "ativo",
        sinergia: 86,
        highlights: "https://www.youtube.com/watch?v=chelocs2highlight",

        papel: "entry",
        estilo: "agressivo"
    },
    {
        id: "decenty",
        nome: "Lucas Bacelar",
        apelido: "decenty",
        pais: "br",
        imagem: "https://img-cdn.hltv.org/playerbodyshot/decenty.png",
        jogoId: "cs2",
        timeAtual: "imperial",
        status: "ativo",
        sinergia: 82,
        highlights: "https://www.youtube.com/watch?v=decentycs2",

        papel: "rifler",
        estilo: "híbrido"
    },
    {
        id: "levi",
        nome: "Guilherme Gustavo Godoy",
        apelido: "levi",
        pais: "br",
        imagem: "https://img-cdn.hltv.org/playerbodyshot/levi.png",
        jogoId: "cs2",
        timeAtual: "imperial",
        status: "ativo",
        sinergia: 84,
        highlights: "https://www.youtube.com/watch?v=cs2levi",

        papel: "awper",
        estilo: "controlado"
    },

    // aleatorios
    {
        id: "makazze",
        nome: "Maksim Karpovich",
        apelido: "makazze",
        pais: "ru",
        imagem: "https://ggscore.com/media/logo/p121947.png?879",
        jogoId: "cs2",
        timeAtual: "navi",
        status: "ativo",
        sinergia: 88,
        highlights: "https://www.youtube.com/watch?v=makkazze-highlights",

        papel: "rifler",
        estilo: "agressivo"
    },
]
