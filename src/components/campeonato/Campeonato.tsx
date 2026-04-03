import { getSituacaoCampeonato } from "@/src/services/campeonato.service"
import CardCompeticao from "../cardCompeticao/CardCompeticao"
import { useEffect, useState } from "react"
import { FaRegCalendarAlt } from "react-icons/fa"

interface CampeonatoProps {
    containerCampeonato: string
    containerMeses: string
}

export default function Campeonato({ containerCampeonato, containerMeses }: CampeonatoProps) {

    const [campeonatos, setCampeonatos] = useState<any[]>([])

    useEffect(() => {
        async function fetchCampeonatos() {
            const res = await fetch("/api/campeonatos")
            const data = await res.json()
            setCampeonatos(data)
        }

        fetchCampeonatos()
    }, [])

    // const campeonatos = getAllCampeonatos()
    const ORDEM_SITUACAO = {
        ocorrendo: 1,
        futuro: 2,
        encerrado: 3
    }
    const meses = [
        'todos',
        'jan',
        'fev',
        'mar',
        'abr',
        'mai',
        'jun',
        'jul',
        'ago',
        'set',
        'out',
        'nov',
        'dez'
    ]
    const mapaMesNumeroParaNome = [
        'jan',
        'fev',
        'mar',
        'abr',
        'mai',
        'jun',
        'jul',
        'ago',
        'set',
        'out',
        'nov',
        'dez'
    ]

    const [mesSelecionado, setMesSelecionado] = useState<string | null>(null)

    useEffect(() => {
        const mesAtual = new Date().getMonth() // 0-11
        setMesSelecionado(mapaMesNumeroParaNome[mesAtual])
    }, [])


    const mapaMeses = {
        jan: 0,
        fev: 1,
        mar: 2,
        abr: 3,
        mai: 4,
        jun: 5,
        jul: 6,
        ago: 7,
        set: 8,
        out: 9,
        nov: 10,
        dez: 11
    }

    const campeonatosFiltrados = campeonatos.filter((campeonato) => {

        if (mesSelecionado === 'todos') return true

        const mesDoCampeonato = new Date(campeonato.inicio).getMonth()

        return mesDoCampeonato === mapaMeses[mesSelecionado as keyof typeof mapaMeses]
    })

    const campeonatosOrdenados = [...campeonatosFiltrados].sort((a, b) => {
        const situacaoA = getSituacaoCampeonato(a.inicio, a.fim)
        const situacaoB = getSituacaoCampeonato(b.inicio, b.fim)

        return ORDEM_SITUACAO[situacaoA] - ORDEM_SITUACAO[situacaoB]
    })

    return (
        <div className="flex flex-col gap-6">

            <ul className={containerMeses}>
                {
                    meses.map((mes, i) => (
                        <li key={i}>
                            <button
                                onClick={() => setMesSelecionado(mes)}
                                className={`px-2 py-1 w-full capitalize rounded text-base cursor-pointer ${mesSelecionado === mes ? 'bg-orange-600 text-white' : 'bg-zinc-950'
                                    }`}
                                style={{ textShadow: '1px 1px 2px black' }}
                            >
                                {
                                    mes != 'todos' ? (
                                        <p className="flex items-center justify-center gap-1">
                                            <FaRegCalendarAlt />
                                            {mes}
                                        </p>
                                    ) : (
                                        <span>{mes}</span>
                                    )
                                }
                            </button>
                        </li>
                    ))
                }
            </ul>

            <ul className={containerCampeonato}>
                {
                    campeonatosOrdenados.length > 0 ? (
                        campeonatosOrdenados.map((campeonato, i) => {
                            const situacao = getSituacaoCampeonato(
                                campeonato.inicio,
                                campeonato.fim
                            )

                            console.log(situacao)
                            return (
                                <CardCompeticao campeonato={campeonato} key={i} />
                            )
                        })
                    ) : (
                        <div className="w-full col-start-1 col-end-6 text-white">
                            <h2 className="font-heading text-4xl text-center">Nenhum Campeonato Encontrado!</h2>
                        </div>
                    )
                }
            </ul>
        </div>
    )
}