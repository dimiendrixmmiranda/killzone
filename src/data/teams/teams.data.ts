import { Time } from "@/src/domain/Time";

export const teams: Time[] = [
    {
        id: "t1",
        nome: "T1",
        regiao: "AS",
        imagem: 'https://static1.squarespace.com/static/62d09f54a49d6f1c78455cce/t/678f2fd99fdde4601470ee2c/1737437145217/T1+red.png?format=1500w',
        jogoId: "lol",
        cor: ['#BF1D17']
    },

    {
        id: "legacy",
        nome: "Legacy",
        regiao: "SA",
        imagem: "https://liquipedia.net/commons/images/1/13/Legacy_full_darkmode.png",
        jogoId: "cs2",
        cor: ["#0f172a"],
        jogadorEstrela: {
            idJogador: "dumau"
        },
        historia: [
            `A Legacy é uma organização brasileira de esports que ganhou notoriedade principalmente no cenário competitivo de Counter-Strike. Fundada com o objetivo de desenvolver talentos nacionais e criar projetos competitivos sustentáveis, a Legacy surgiu como uma resposta à necessidade de renovação no cenário brasileiro, apostando em jogadores jovens e promissores, aliados a uma estrutura profissional e focada em evolução constante. Desde seus primeiros passos, a organização deixou claro que seu foco não era apenas resultados imediatos, mas a construção de um legado sólido dentro do esporte eletrônico.`,

            `O grande destaque da Legacy aconteceu no Counter-Strike, onde a equipe rapidamente chamou atenção pela disciplina tática e pelo desenvolvimento individual de seus jogadores. Diferente de organizações que buscavam estrelas já consagradas, a Legacy apostou fortemente em talentos em ascensão, oferecendo espaço, confiança e tempo para amadurecimento competitivo. Essa abordagem fez com que a equipe se tornasse conhecida como uma verdadeira formadora de jogadores, frequentemente revelando nomes que futuramente ganhariam espaço em equipes maiores do cenário internacional.`,

            `Com participações constantes em torneios regionais e internacionais de médio porte, a Legacy consolidou sua presença no cenário sul-americano. A organização passou a ser presença frequente em qualificatórias de grandes eventos, enfrentando equipes tradicionais e demonstrando que o Brasil continuava sendo uma fonte inesgotável de novos talentos. Mesmo diante de desafios financeiros e estruturais comuns a organizações emergentes, a Legacy manteve sua identidade competitiva e sua filosofia de crescimento a longo prazo.`,

            `Além do desempenho dentro do servidor, a Legacy também se preocupou em construir uma identidade própria fora dele. A organização investiu em comunicação com a comunidade, produção de conteúdo e fortalecimento de sua marca, buscando criar uma base de fãs que se identificasse com a proposta de desenvolvimento e superação. Essa proximidade com o público ajudou a consolidar a imagem da Legacy como um projeto sério e comprometido com o futuro do esports brasileiro.`,

            `Outro ponto importante na trajetória da Legacy foi sua atuação como ponte entre o cenário amador e o profissional. Muitos jogadores que passaram pela organização tiveram ali sua primeira experiência em um ambiente estruturado de alto nível competitivo. Esse papel formador se tornou um dos maiores diferenciais da equipe, reforçando seu nome como uma organização que realmente constrói carreiras, e não apenas elencos temporários.`,

            `Atualmente, a Legacy segue como uma das organizações mais respeitadas quando o assunto é desenvolvimento de talentos no Counter-Strike sul-americano. Mesmo sem o mesmo poder financeiro de gigantes do cenário, a equipe continua relevante por sua visão estratégica, capacidade de adaptação e compromisso com a evolução do jogo. A história da Legacy ainda está em construção, mas seu impacto já é sentido em toda uma geração de jogadores que encontraram na organização a oportunidade de iniciar suas trajetórias no mais alto nível competitivo.`
        ],
        modalidades: [
            "cs2"
        ]
    },
    {
        id: "liquid",
        nome: "Team Liquid",
        regiao: "NA",
        imagem: "https://upload.wikimedia.org/wikipedia/pt/4/4b/Teamliquid_logo_blue.png",
        jogoId: "cs2",
        cor: ["#0A1A2F"],
        jogadorEstrela: {
            idJogador: "naf"
        },
        historia: [
            `A Team Liquid é uma das organizações mais tradicionais e respeitadas da história dos esports mundiais. Fundada no ano 2000, inicialmente como uma comunidade dedicada a StarCraft, a Liquid rapidamente evoluiu para se tornar uma organização profissional de alto nível. Ao longo dos anos, construiu uma reputação sólida baseada em profissionalismo, inovação e excelência competitiva. Diferente de muitas equipes que surgiram já na era moderna dos esports, a Liquid acompanhou a evolução do cenário desde suas raízes, adaptando-se constantemente às mudanças e estabelecendo padrões que influenciaram toda a indústria.`,
            `No cenário de Counter-Strike, a Team Liquid teve uma trajetória marcada por altos e baixos, mas também por momentos históricos. Durante o período do CS:GO, a organização se consolidou como a principal representante da América do Norte no cenário internacional. Em 2019, a Liquid viveu seu auge ao conquistar o Intel Grand Slam em tempo recorde, dominando o cenário competitivo mundial e vencendo torneios de elite como ESL Pro League, IEM Katowice e ESL One Cologne. Esse período ficou conhecido como a “Era Liquid”, quando o time foi amplamente considerado o melhor do mundo.`,
            `A line-up histórica de 2019, com jogadores como NAF, Twistzz, EliGE, nitr0 e Stewie2K, é lembrada até hoje como uma das mais fortes da história do Counter-Strike. O estilo de jogo da Team Liquid combinava disciplina tática, profundidade estratégica e altíssimo nível mecânico. Diferente de equipes extremamente agressivas, a Liquid se destacou pela consistência e pela capacidade de adaptação durante as partidas, sendo temida especialmente em séries longas e decisões em playoffs.`,
            `Além do Counter-Strike, a Team Liquid sempre teve uma forte presença multigames. A organização é referência em modalidades como League of Legends, Dota 2, Valorant, Rainbow Six Siege e StarCraft II. No League of Legends, por exemplo, a Liquid dominou o cenário norte-americano por anos consecutivos, conquistando múltiplos títulos da LCS e se consolidando como uma potência regional. Essa diversidade de modalidades ajudou a organização a manter relevância constante, independentemente das mudanças de meta ou popularidade dos jogos.`,
            `Outro grande diferencial da Team Liquid é sua estrutura organizacional. A equipe foi uma das primeiras a investir fortemente em ciência de dados, análise de desempenho, infraestrutura de ponta e bem-estar dos atletas. Centros de treinamento modernos, equipes multidisciplinares e uma abordagem quase científica ao treinamento competitivo se tornaram marcas registradas da organização. Esse modelo profissional serviu de inspiração para diversas outras equipes ao redor do mundo.`,
            `A Team Liquid também se destacou fora dos servidores, tornando-se uma verdadeira marca global. Com forte presença nas redes sociais, produção de conteúdo de alta qualidade e parcerias com grandes patrocinadores internacionais, a organização construiu uma base de fãs global extremamente fiel. Seu cavalo azul, símbolo da equipe, tornou-se um ícone reconhecido mundialmente dentro da cultura dos esports.`,
            `Atualmente, a Team Liquid segue como uma das maiores organizações do planeta, mantendo-se competitiva em diversas modalidades e constantemente se reinventando. Sua história é um exemplo claro de longevidade e adaptação em um cenário extremamente dinâmico. Mais do que títulos, a Liquid representa tradição, inovação e excelência, sendo uma referência absoluta quando se fala em esports de alto nível.`
        ],
        modalidades: [
            "cs2",
            "lol",
            "valorant",
            "dota2"
        ]
    },
    {
        id: "imperial",
        nome: "Imperial Esports",
        regiao: "SA",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Imperial-esports-logo.png",
        jogoId: "cs2",
        cor: ['#096B35'],

        historicoDeLineups: [
            {
                jogadores: [
                    "vini",
                    "noway",
                    "chelo",
                    "decenty",
                    "levi"
                ],
                dataDeFormacao: new Date("2026-02-20"),
                dataDeTermino: new Date("9999-12-31")
            }
        ]
    },
    {
        id: "mibr",
        nome: "Made In Brazil",
        regiao: "SA",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/5/53/Made_In_Brazil_logo.png",
        jogoId: "cs2",
        cor: ['#004188'],
    },
    // pgl cluj napoca
    {
        id: "furia",
        nome: "FURIA Esports",
        regiao: "SA",
        imagem: "https://upload.wikimedia.org/wikipedia/pt/f/f9/Furia_Esports_logo.png",
        jogoId: "cs2",
        cor: ['#080808'],
        jogadorEstrela: {
            idJogador: 'fallen'
        },
        historicoDeLineups: [
            {
                jogadores: [
                    "kscerato",
                    "yuurih",
                    "FalleN",
                    "yekindar",
                    "molodoy"
                ],
                dataDeFormacao: new Date("2026-01-15"),
                dataDeTermino: new Date("9999-12-31")
            }
        ],
        forma: [
            {
                resultado: 'V',
                data: '2026-02-12',
                adversarioId: 'liquid',
                placar: '13-8',
                campeonatoId: 'pgl-cluj-napoca-2026'
            },
            {
                resultado: 'D',
                data: '2026-02-10',
                adversarioId: 'vitality',
                placar: '10-13',
                campeonatoId: 'pgl-cluj-napoca-2026'
            },
            {
                resultado: 'V',
                data: '2026-02-08',
                adversarioId: 'mouz',
                placar: '13-11',
                campeonatoId: 'pgl-cluj-napoca-2026'
            },
            {
                resultado: 'V',
                data: '2026-02-06',
                adversarioId: 'g2',
                placar: '12-11',
                campeonatoId: 'pgl-cluj-napoca-2026'
            },
            {
                resultado: 'D',
                data: '2026-02-04',
                adversarioId: 'navi',
                placar: '7-13'
                , campeonatoId: 'pgl-cluj-napoca-2026'
            }
        ],
        historia: [
            `A FURIA Esports é uma das organizações mais importantes da história recente do esporte eletrônico brasileiro. Fundada em agosto de 2017 pelos empresários André Akkari, Jaime Pádua e Cris Guedes, a instituição nasceu com um propósito claro: criar uma equipe brasileira capaz de competir de igual para igual com as maiores potências mundiais dos esports. Desde o início, a FURIA adotou uma identidade forte, representada pela famosa pantera preta, símbolo de agressividade, determinação e coragem dentro e fora dos servidores. O projeto começou pequeno, mas com uma visão extremamente profissional e ambiciosa, focada em estrutura, gestão moderna e valorização de talentos nacionais.`,
            `O primeiro grande passo da FURIA aconteceu no cenário de Counter-Strike: Global Offensive (CS:GO), modalidade que se tornaria o principal carro-chefe da organização. Com uma line-up formada por jovens promessas brasileiras, como arT, yuurih e KSCERATO, a equipe rapidamente chamou atenção pelo estilo de jogo ousado e extremamente agressivo. Diferente de outras equipes brasileiras tradicionais, a FURIA apostou em um modelo mais moderno, com treinos intensivos, acompanhamento psicológico, análise de desempenho e uma estrutura internacional. Em pouco tempo, o time saiu do anonimato para disputar grandes torneios mundiais, colocando novamente o Brasil no topo do cenário competitivo global.`,
            `Com o crescimento meteórico no CS:GO, a FURIA começou a expandir suas atividades para outras modalidades. A organização passou a investir em jogos como Rainbow Six Siege, League of Legends, Valorant, Free Fire e Rocket League, consolidando-se como uma potência multigames. Essa expansão foi estratégica: a FURIA queria ser mais do que apenas um time de sucesso em um único jogo. O objetivo era construir uma verdadeira instituição esportiva digital, com presença forte em diferentes comunidades e públicos. Em cada novo cenário que entrava, a organização levava consigo o mesmo padrão de profissionalismo e seriedade que a tornou famosa.`,
            `Além dos resultados competitivos, a FURIA também se destacou pela forma como construiu sua marca. Diferente de muitas equipes de esports, que focavam apenas nas competições, a FURIA investiu pesado em marketing, conteúdo digital e relacionamento com fãs. Criou linhas próprias de roupas, parcerias com grandes empresas, produção constante de vídeos e interação direta com a comunidade. Essa aproximação fez com que a organização se tornasse uma das mais queridas do Brasil, conquistando uma base de torcedores extremamente fiel, conhecida como “FURIA Nation”. A pantera deixou de ser apenas um logo e virou um verdadeiro símbolo cultural dentro do esports nacional.`,
            `Outro ponto fundamental na história da FURIA foi sua internacionalização. A organização rapidamente percebeu que, para competir no mais alto nível, precisava estar próxima dos grandes centros do esporte eletrônico mundial. Por isso, estabeleceu operações nos Estados Unidos e passou a disputar ligas e campeonatos fora do Brasil com frequência. Esse movimento ajudou a profissionalizar ainda mais a equipe, atrair patrocinadores globais e dar visibilidade internacional aos jogadores brasileiros. A FURIA se tornou, assim, uma das principais representantes do Brasil no exterior, levando a bandeira verde e amarela para os maiores palcos do mundo.`,
            `Ao longo dos anos, a instituição também se preocupou em desenvolver novos talentos e fortalecer a base do esports nacional. Projetos de categorias de base, academias de jogadores e investimentos em criadores de conteúdo passaram a fazer parte da estratégia da organização. Muitos atletas que começaram como promessas dentro da FURIA acabaram se tornando estrelas reconhecidas mundialmente. Esse compromisso com o futuro do cenário ajudou a consolidar a imagem da equipe não apenas como uma competidora, mas como uma verdadeira formadora de profissionais e referência de gestão no Brasil.`,
            `Hoje, a FURIA Esports é muito mais do que um simples time: é uma das maiores marcas do esporte eletrônico mundial. Sua trajetória, construída em poucos anos, é exemplo de como planejamento, paixão e profissionalismo podem transformar um sonho em realidade. A organização segue crescendo, conquistando títulos, revelando talentos e inspirando milhares de jovens brasileiros que enxergam nos esports um caminho possível. Com uma história ainda em plena construção, a FURIA continua firme em seu propósito original: mostrar ao mundo a força e o talento do Brasil dentro do cenário competitivo digital.`
        ],
        modalidades: [
            'cs2',
            'lol'
        ]
    },
    {
        id: 'vitality',
        nome: 'Team Vitality',
        regiao: 'EU',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/thumb/9/96/Team_Vitality_2023_darkmode.png/494px-Team_Vitality_2023_darkmode.png',
        cor: ['#0E0E10', '#FFD600'],

        fundadoEm: '2013',

        jogadorEstrela: {
            idJogador: 'zywoo'
        },

        modalidades: ['CS2', 'VALORANT', 'Rocket League']
    },
    {
        id: 'falcons',
        nome: 'Team Falcons',
        regiao: 'EU',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/thumb/8/83/Team_Falcons_2022_allmode.png/41px-Team_Falcons_2022_allmode.png',
        cor: ['#00A651'],

        fundadoEm: '2017',

        jogadorEstrela: {
            idJogador: 'niko'
        },

        modalidades: ['CS2', 'VALORANT', 'Rocket League', 'Fortnite']
    },
    {
        id: "navi",
        nome: "Natus Vincere",
        regiao: "EU",
        imagem: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Natus_Vincere_logo.png',
        jogoId: "cs2",
        cor: ['#F09E17']
    },
    {
        id: 'mouz',
        nome: 'MOUZ',
        regiao: 'EU',
        jogoId: 'cs2',
        imagem: 'https://upload.wikimedia.org/wikipedia/pt/7/7a/Mouz_logo.png',
        cor: ['#FFFFFF', '#DD0000'],

        fundadoEm: '2002',

        jogadorEstrela: {
            idJogador: 'xertion'
        },

        modalidades: ['CS2', 'VALORANT', 'League of Legends']
    },
    {
        id: 'faze',
        nome: 'FaZe Clan',
        regiao: 'EU',
        jogoId: 'cs2',
        imagem: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Faze_Clan.svg/250px-Faze_Clan.svg.png',
        cor: ['#E11C2A'],

        fundadoEm: '2010',

        jogadorEstrela: {
            idJogador: 'frozen'
        },

        modalidades: ['CS2', 'VALORANT', 'Call of Duty', 'Fortnite', 'Rocket League']
    },
    {
        id: 'mongolz',
        nome: 'The MongolZ',
        regiao: 'AS',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/thumb/2/2b/The_MongolZ_2024_03_allmode.png/466px-The_MongolZ_2024_03_allmode.png',
        cor: ['#E53935'],

        fundadoEm: '2015',

        jogadorEstrela: {
            idJogador: 'blitz'
        },

        modalidades: ['CS2', 'Dota 2']
    },
    {
        id: 'aurora',
        nome: 'Aurora Gaming',
        regiao: 'EU',
        jogoId: 'cs2',
        imagem: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Aurora_Gaming_logo.svg/960px-Aurora_Gaming_logo.svg.png',
        cor: ['#00B5E2'],

        fundadoEm: '2022',

        jogadorEstrela: {
            idJogador: 'deko'
        },

        modalidades: ['CS2', 'Dota 2']
    },
    {
        id: 'b8',
        nome: 'B8',
        regiao: 'EU',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/thumb/a/a6/B8_darkmode.png/600px-B8_darkmode.png',
        cor: ['#080808', '#D20C42'],

        fundadoEm: '2020',

        jogadorEstrela: {
            idJogador: 'headtr1ck'
        },

        modalidades: ['CS2', 'Dota 2']
    },
    {
        id: 'g2',
        nome: 'G2 Esports',
        regiao: 'EU',
        jogoId: 'cs2',
        imagem: 'https://upload.wikimedia.org/wikipedia/pt/2/23/G2_Esports_logo.png',
        cor: ['#F00F32'],

        fundadoEm: '2015',

        jogadorEstrela: {
            idJogador: 'm0nesy'
        },

        modalidades: ['CS2', 'VALORANT', 'League of Legends', 'Rocket League']
    },
    {
        id: 'tyloo',
        nome: 'TYLOO',
        regiao: 'AS',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/5/5f/TyLoo_2016_allmode.png',
        cor: ['#FF6A00'],

        fundadoEm: '2007',

        jogadorEstrela: {
            idJogador: 'moseyuh'
        },

        modalidades: ['CS2', 'PUBG', 'CrossFire']
    },
    {
        id: '9z',
        nome: '9z Team',
        regiao: 'SA',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/9/9b/9z_Team_2024_darkmode.png',
        cor: ['#7A3FF2'],

        fundadoEm: '2018',

        jogadorEstrela: {
            idJogador: 'dgt'
        },

        modalidades: ['CS2', 'VALORANT', 'Rocket League', 'League of Legends']
    },
    {
        id: '3dmax',
        nome: '3DMAX',
        regiao: 'EU',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/thumb/e/ee/3DMAX_2024_allmode.png/600px-3DMAX_2024_allmode.png',
        cor: ['#1F1F1F'],

        fundadoEm: '2009',

        jogadorEstrela: {
            idJogador: 'ex3rcice'
        },

        modalidades: ['CS2']
    },
    {
        id: 'astralis',
        nome: 'Astralis',
        regiao: 'EU',
        jogoId: 'cs2',
        imagem: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Astralis_logo.svg/960px-Astralis_logo.svg.png',
        cor: ['#111C2A'],

        fundadoEm: '2016',

        jogadorEstrela: {
            idJogador: 'device'
        },

        modalidades: ['CS2']
    },
    {
        id: 'parivision',
        nome: 'PARIVISION',
        regiao: 'EU',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/thumb/9/9d/PARIVISION_allmode.png/600px-PARIVISION_allmode.png',
        cor: ['#459FA6'],

        fundadoEm: '2023',

        jogadorEstrela: {
            idJogador: 'jame'
        },

        modalidades: ['CS2', 'Dota 2']
    },
    {
        id: 'heroic',
        nome: 'Heroic',
        regiao: 'EU',
        jogoId: 'cs2',
        imagem: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Heroic_2023_logo.png/250px-Heroic_2023_logo.png',
        cor: ['#A1152C'],

        fundadoEm: '2016',

        jogadorEstrela: {
            idJogador: 'sjuush'
        },

        modalidades: ['CS2']
    },
    {
        id: 'nrg',
        nome: 'NRG',
        regiao: 'NA',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/1/16/NRG_2024_allmode.png',
        cor: ['#F64312'],

        fundadoEm: '2015',

        jogadorEstrela: {
            idJogador: 'oSee'
        },

        modalidades: ['CS2']
    },
    {
        id: 'monte',
        nome: 'Monte',
        regiao: 'EU',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/2/22/Monte_2022_allmode.png',
        cor: ['#1F1F1F'],

        fundadoEm: '2022',

        jogadorEstrela: {
            idJogador: 'Woro2k'
        },

        modalidades: ['CS2']
    },
    {
        id: 'm80',
        nome: 'M80',
        regiao: 'NA',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/5/55/M80_2023_allmode.png',
        cor: ['#E78E12'],

        fundadoEm: '2022',

        jogadorEstrela: {
            idJogador: 'malbsMd'
        },

        modalidades: ['CS2']
    },
    {
        id: 'nip',
        nome: 'Ninjas in Pyjamas',
        regiao: 'EU',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/e/ec/Ninjas_in_Pyjamas_2021_full_allmode.png',
        cor: ['#080808'],

        fundadoEm: '2000',

        jogadorEstrela: {
            idJogador: 'REZ'
        },

        modalidades: ['CS2']
    },
    {
        id: 'passion-ua',
        nome: 'Passion UA',
        regiao: 'EU',
        jogoId: 'cs2',
        imagem: 'https://upload.wikimedia.org/wikipedia/uk/e/ed/3Ln7TXA0zyo4AA-RXglS8_.png',
        cor: ['#084668'],

        fundadoEm: '2023',

        jogadorEstrela: {
            idJogador: 'sdy'
        },

        modalidades: ['CS2']
    },
    {
        id: 'spirit',
        nome: 'Team Spirit',
        regiao: 'EU',
        jogoId: 'cs2',
        imagem: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Team_Spirit_new_em.svg/960px-Team_Spirit_new_em.svg.png',
        cor: ['#000000', '#ff6a00'],

        fundadoEm: '2015',

        jogadorEstrela: {
            idJogador: 'donk'
        },

        modalidades: ['CS2']
    },
    {
        id: 'semperfi',
        nome: 'SemperFi',
        regiao: 'OC',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/a/aa/SemperFI_Esports_allmode.png',
        cor: ['#080808'],

        fundadoEm: '2023',

        jogadorEstrela: {
            idJogador: 'nbk'
        },

        modalidades: ['CS2']
    },
    {
        id: 'pain',
        nome: 'paiN Gaming',
        regiao: 'SA',
        jogoId: 'cs2',
        imagem: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/PaiN_Gaming_logo.svg/250px-PaiN_Gaming_logo.svg.png',
        cor: ['#EB0F0F'],

        fundadoEm: '2010',

        jogadorEstrela: {
            idJogador: 'biguzera'
        },

        modalidades: ['CS2', 'League of Legends', 'VALORANT']
    },
    {
        id: 'fut',
        nome: 'FUT Esports',
        regiao: 'EU',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/thumb/0/08/Futbolist_2021_darkmode.png/600px-Futbolist_2021_darkmode.png',
        cor: ['#000000'],

        fundadoEm: '2017',

        jogadorEstrela: {
            idJogador: 'woxic'
        },

        modalidades: ['CS2', 'VALORANT']
    },
    {
        id: 'illwill',
        nome: 'ILLWILL',
        regiao: 'EU',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/thumb/7/76/Illwill_allmode.png/71px-Illwill_allmode.png',
        cor: ['#5C6BC0'],

        fundadoEm: '2023',

        jogadorEstrela: {
            idJogador: 'nemanha'
        },

        modalidades: ['CS2']
    },
    {
        id: 'wildcard',
        nome: 'Wildcard',
        regiao: 'NA',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/1/14/Wildcard_2024_full_darkmode.png',
        cor: ['#1E88E5'],

        fundadoEm: '2017',

        jogadorEstrela: {
            idJogador: 'phzy'
        },

        modalidades: ['CS2']
    },
    {
        id: 'genone',
        nome: 'GenOne',
        regiao: 'EU',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/a/ae/GenOne_full_darkmode.png',
        cor: ['#6D4C41'],

        fundadoEm: '2022',

        jogadorEstrela: {
            idJogador: 'wasink'
        },

        modalidades: ['CS2']
    },
    {
        id: 'sharks',
        nome: 'Sharks Esports',
        regiao: 'SA',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/b/b2/Sharks_Esports_2024_allmode.png',
        cor: ['#00A8E8'],

        fundadoEm: '2017',

        jogadorEstrela: {
            idJogador: 'gafolo'
        },

        modalidades: ['CS2']
    },
    {
        id: 'red-canids',
        nome: 'RED Canids',
        regiao: 'SA',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/3/3b/Red_Canids_allmode.png',
        cor: ['#E30613'],

        fundadoEm: '2015',

        jogadorEstrela: {
            idJogador: 'drop'
        },

        modalidades: ['CS2', 'League of Legends']
    },
    {
        id: 'oddik',
        nome: 'ODDIK',
        regiao: 'SA',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/thumb/0/03/ODDIK_allmode.png/50px-ODDIK_allmode.png',
        cor: ['#000000', '#FFFFFF'],

        fundadoEm: '2021',

        jogadorEstrela: {
            idJogador: 'wood7'
        },

        modalidades: ['CS2']
    },
    {
        id: 'gaimin-gladiators',
        nome: 'Gaimin Gladiators',
        regiao: 'SA',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/7/78/Gladiators_2022_allmode.png',
        cor: ['#D1CC08'],

        fundadoEm: '2021',

        jogadorEstrela: {
            idJogador: 'iM'
        },

        modalidades: ['CS2']
    },
    {
        id: 'gamerlegion',
        nome: 'GamerLegion',
        regiao: 'EU',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/a/ab/GamerLegion_CS_2023_allmode.png',
        cor: ['#0B3D91', '#FFFFFF'],

        fundadoEm: '2017',

        jogadorEstrela: {
            idJogador: 'snax'
        },

        modalidades: ['CS2', 'Dota 2']
    },
    {
        id: 'marsborne',
        nome: 'Marsborne',
        regiao: 'NA',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/1/1a/Marsborne_logo_allmode.png',
        cor: ['#1E1E1E', '#00BFFF'],

        fundadoEm: '2025',

        jogadorEstrela: {
            idJogador: 'cxzi'
        },

        modalidades: ['CS2']
    },
    {
        id: 'bcgame',
        nome: 'BC.Game Esports',
        regiao: 'EU',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/thumb/6/6d/BC.Game_2025_allmode.png/171px-BC.Game_2025_allmode.png',
        cor: ['#00AEEF'],

        fundadoEm: '2023',

        jogadorEstrela: {
            idJogador: 'nawwk'
        },

        modalidades: ['CS2']
    },
    {
        id: 'eyeballers',
        nome: 'EYEBALLERS',
        regiao: 'EU',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/9/99/Eyeballers_full_allmode.png',
        cor: ['#000000', '#FFD700'],

        fundadoEm: '2022',

        jogadorEstrela: {
            idJogador: 'jw'
        },

        modalidades: ['CS2']
    },
    {
        id: 'voca',
        nome: 'Voca',
        regiao: 'NA',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/thumb/2/29/Team_Voca_darkmode.png/800px-Team_Voca_darkmode.png',
        cor: ['#1E90FF'],

        fundadoEm: '2025',

        jogadorEstrela: {
            idJogador: 'nosraC'
        },

        modalidades: ['CS2']
    },
    {
        id: 'innercircle',
        nome: 'Inner Circle',
        regiao: 'EU',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/thumb/c/c6/Inner_Circle_2025_allmode.png/516px-Inner_Circle_2025_allmode.png',
        cor: ['#111111', '#FF4D4D'],

        fundadoEm: '2025',

        jogadorEstrela: {
            idJogador: 'cptkurtka023'
        },

        modalidades: ['CS2']
    },
    {
        id: 'fokus',
        nome: 'FOKUS',
        regiao: 'EU',
        jogoId: 'cs2',
        imagem: 'https://liquipedia.net/commons/images/thumb/1/12/FOKUS_allmode.png/37px-FOKUS_allmode.png',
        cor: ['#000000', '#FFFFFF'],

        fundadoEm: '2018',

        jogadorEstrela: {
            idJogador: 'ztr'
        },

        modalidades: ['CS2', 'VALORANT']
    },
];

