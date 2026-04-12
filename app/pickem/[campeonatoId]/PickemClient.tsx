"use client"

import { useEffect, useState } from "react"
import Template from "@/src/components/template/Template"

import {
    DndContext,
    useDraggable,
    useDroppable,
    DragEndEvent
} from "@dnd-kit/core"
import { getTeamById } from "@/src/services/team.service"
import Image from "next/image"
import { IMAGEM_TIME_DEFAULT } from "@/src/assets/imagens"
import { getClassificacaoFinalSuica, getClassificacaoPlayoffs, getSituacaoCampeonato, SituacaoCampeonato } from "@/src/services/campeonato.service"
import { Campeonato } from "@/src/domain/Campeonato"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"

type TimeID = string

type SlotTipo =
    | "time"
    | "3-0"
    | "0-3"
    | "advance"

interface Slot {
    id: string
    tipo: SlotTipo
    timeId?: TimeID
}

interface RedondoState {
    timesDisponiveis: TimeID[]
    slots: Slot[]
}

interface Resultado {
    partidas: number
    encerrouParticipacao: boolean
    resultadoSuica: string
    timeId: string
    posicao: number
}

type ResultadoPickem = {
    pontos: number
    acertou3x0: boolean
    acertou0x3: boolean
    acertosAvancar: number

    // 🔥 o que você pediu
    timesAcertados3x0: string[]
    timesAcertados0x3: string[]
    timesAcertadosAvancar: string[]
}

function getCorCard(timeId: string, tipo: SlotTipo, resultado: ResultadoPickem) {
    if (tipo === '3-0') {
        return resultado.timesAcertados3x0.includes(timeId)
            ? 'bg-green-600'
            : 'bg-red-600'
    }

    if (tipo === '0-3') {
        return resultado.timesAcertados0x3.includes(timeId)
            ? 'bg-green-600'
            : 'bg-red-600'
    }

    if (tipo === 'advance') {
        return resultado.timesAcertadosAvancar.includes(timeId)
            ? 'bg-green-600'
            : 'bg-red-600'
    }

    return 'bg-zinc-800'
}
// Time Arrastavel
function TimeDraggable({
    timeId,
    tipo,
    resultado,
    situacao,
    onRemove
}: {
    timeId: TimeID
    tipo?: SlotTipo
    resultado?: ResultadoPickem
    situacao?: SituacaoCampeonato
    onRemove?: (id: TimeID) => void
}) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: timeId
    })
    const style = transform
        ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
        : undefined

    const dadosTime = getTeamById(timeId)

    // 🔥 AQUI entra o EXTRA
    const mostrarResultado = !!resultado

    const cor =
        mostrarResultado && tipo && resultado
            ? getCorCard(timeId, tipo, resultado)
            : 'bg-zinc-800'
    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                w-[120px] h-[120px]
                rounded-lg
                grid grid-rows-[1fr_15px] gap-1
                text-black font-bold
                touch-none z-20 relative
                ${cor}
                p-4
                cursor-pointer
                md:w-[80px]
                md:h-[80px]
                lg:w-[120px]
                lg:h-[120px]
                xl:w-[140px]
                xl:h-[140px]
                2xl:w-[160px]
                2xl:h-[160px]
            `}
        >
            <div
                className="relative w-full h-full"
                {...listeners}
                {...attributes}
            >
                <Image
                    alt={`${dadosTime?.nome || timeId}`}
                    src={dadosTime?.imagem || IMAGEM_TIME_DEFAULT}
                    fill
                    className="object-contain"
                />
            </div>

            <h3 className="text-xs font-heading truncate self-center justify-self-center max-w-full text-white xl:text-lg">
                {dadosTime?.nome}
            </h3>

            {onRemove && situacao !== 'encerrado' && (
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onRemove(timeId)
                    }}
                    className="
                        absolute top-[-12px] right-[-12px]
                        w-5 h-5
                        bg-red-500 text-white
                        rounded-full
                        text-xs flex items-center justify-center
                    "
                >
                    x
                </button>
            )}
        </div>
    )
}

// Slot Dropavel
function SlotDrop({ slot, children }: { slot: Slot, children?: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({ id: slot.id })

    return (
        <div className="flex flex-col gap-1 w-full justify-center items-center">
            <div
                ref={setNodeRef}
                className={`
                w-[130px] h-[130px]
                rounded-lg
                flex items-center justify-center
                transition-all z-10
                md:w-[110px]
                md:h-[110px]
                ${isOver ? "bg-azul-escuro border-2 border-white scale-105" : "bg-zinc-800"}
                lg:w-[140px]
                lg:h-[140px]
                xl:w-[170px]
                xl:h-[170px]
                2xl:w-[190px]
                2xl:h-[190px]

            `}
            >
                {children}
            </div>
            <p className="text-center font-bold font-heading">Advanced</p>
        </div>
    )
}


interface PickemClientProps {
    idCampeonato: string
}



export default function PickemClient({ idCampeonato }: PickemClientProps) {
    const [campeonatos, setCampeonatos] = useState<any[]>([])
    const [campeonatoAtual, setCampeonatoAtual] = useState<Campeonato | null>(null)
    const [pickemDefinido, setPickemDefinido] = useState<boolean>(false)
    const [pick, setPick] = useState<any | null>(null)
    const { data: session } = useSession()
    const [user, setUser] = useState<any>(undefined)

    // 🔹 pegar usuário
    useEffect(() => {
        if (session?.user?.email) {
            fetch("/api/user")
                .then(res => res.json())
                .then(data => setUser(data))
        }
    }, [session])

    // 🔹 pegar campeonatos
    useEffect(() => {
        fetch("/api/campeonatos")
            .then(res => res.json())
            .then(setCampeonatos)
    }, [])

    // 🔹 definir campeonato atual
    useEffect(() => {
        const camp = campeonatos.find(c => c.slugId === idCampeonato)
        if (camp) setCampeonatoAtual(camp)
    }, [idCampeonato, campeonatos])

    const times = campeonatoAtual?.timesIds ?? []

    // 🔹 STATE (AGORA SÓ SLOTS)
    const [slots, setSlots] = useState<Slot[]>([
        { id: "3-0", tipo: "3-0" },
        { id: "0-3", tipo: "0-3" },
        { id: "adv-1", tipo: "advance" },
        { id: "adv-2", tipo: "advance" },
        { id: "adv-3", tipo: "advance" },
        { id: "adv-4", tipo: "advance" },
        { id: "adv-5", tipo: "advance" },
        { id: "adv-6", tipo: "advance" },
    ])

    // 🔥 carregar pickem salvo
    useEffect(() => {
        async function fetchPickem() {
            if (!user?.id || !campeonatoAtual?.id) return

            const res = await fetch(
                `/api/pickem?userId=${user.id}&campeonatoId=${campeonatoAtual.id}`
            )

            const data = await res.json()
            setPick(data)
            setPickemDefinido(false)

            if (data?.picks) {
                setSlots(data.picks)
                setPickemDefinido(true)
            }
        }

        fetchPickem()
    }, [user, campeonatoAtual])

    // 🔥 calcular automaticamente
    const timesUsados = slots.map(s => s.timeId).filter(Boolean) as string[]
    const timesDisponiveis = times.filter(t => !timesUsados.includes(t))

    function removerTime(timeId: TimeID) {
        setSlots(prev =>
            prev.map(slot =>
                slot.timeId === timeId ? { ...slot, timeId: undefined } : slot
            )
        )
    }

    function getSlotTime(slotId: string) {
        return slots.find(s => s.id === slotId)?.timeId
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over) return

        const timeId = active.id as TimeID
        const slotId = over.id as string

        setSlots(prev => {
            const newSlots = [...prev]

            const targetIndex = newSlots.findIndex(s => s.id === slotId)
            if (targetIndex === -1) return prev

            const existingIndex = newSlots.findIndex(s => s.timeId === timeId)

            if (existingIndex !== -1) {
                const temp = newSlots[targetIndex].timeId
                newSlots[targetIndex].timeId = timeId
                newSlots[existingIndex].timeId = temp
            } else {
                newSlots[targetIndex].timeId = timeId
            }

            return newSlots
        })
    }

    async function salvarPickem() {
        if (!user?.id || !campeonatoAtual?.id) return

        await fetch("/api/pickem", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: user.id,
                campeonatoId: campeonatoAtual.id,
                slots
            })
        })
    }

    const situacao = campeonatoAtual && getSituacaoCampeonato(
        campeonatoAtual?.inicio,
        campeonatoAtual?.fim
    )
    const [classificacao, setClassificacao] = useState<Resultado[]>([])

    useEffect(() => {
        switch (campeonatoAtual?.formato) {
            case 'suico':
                return (
                    setClassificacao(getClassificacaoFinalSuica(campeonatoAtual!))
                )
            case 'playoff':
                return (
                    setClassificacao(getClassificacaoPlayoffs(campeonatoAtual!))
                )
            default:
                break;
        }
    }, [campeonatos, campeonatoAtual])

    function calcularResultadoPickem(
        classificacao: Resultado[],
        slots: Slot[]
    ): ResultadoPickem {

        // 🔹 resultados reais
        const ids3x0 = classificacao
            .filter(t => t.resultadoSuica === '3-0')
            .map(t => t.timeId)

        const ids0x3 = classificacao
            .filter(t => t.resultadoSuica === '0-3')
            .map(t => t.timeId)

        const idsAvancaram = classificacao
            .filter(t => t.resultadoSuica === '3-1' || t.resultadoSuica === '3-2')
            .map(t => t.timeId)

        // 🔹 picks usuário
        const pick3x0 = slots.find(s => s.tipo === '3-0')?.timeId
        const pick0x3 = slots.find(s => s.tipo === '0-3')?.timeId

        const picksAvancar = slots
            .filter(s => s.tipo === 'advance')
            .map(s => s.timeId)
            .filter(Boolean) as string[]

        let pontos = 0

        // 🎯 3-0
        const acertou3x0 = !!pick3x0 && ids3x0.includes(pick3x0)
        const timesAcertados3x0 = acertou3x0 ? [pick3x0!] : []

        if (acertou3x0) pontos++

        // 🎯 0-3
        const acertou0x3 = !!pick0x3 && ids0x3.includes(pick0x3)
        const timesAcertados0x3 = acertou0x3 ? [pick0x3!] : []

        if (acertou0x3) pontos++

        // 🎯 ADVANCE
        const timesAcertadosAvancar = picksAvancar.filter(id =>
            idsAvancaram.includes(id)
        )

        const acertosAvancar = timesAcertadosAvancar.length
        pontos += acertosAvancar

        return {
            pontos,
            acertou3x0,
            acertou0x3,
            acertosAvancar,
            timesAcertados3x0,
            timesAcertados0x3,
            timesAcertadosAvancar
        }
    }

    const resultado = calcularResultadoPickem(classificacao, slots)

    return (
        <Template>
            <DndContext onDragEnd={handleDragEnd}>
                <div className="bg-zinc-950 p-4 md:p-8">
                    <div className="flex flex-col gap-8 max-w-[1440px] w-full mx-auto min-h-screen lg:gap-12">
                        <div>
                            <h2 className="font-heading text-6xl text-center capitalize">
                                Pick’Em Challenge {campeonatoAtual?.slugId?.replaceAll('-', ' ')}
                            </h2>
                            <p className="text-center">
                                O Pick’Em é um sistema de previsões para torneios em que os participantes escolhem quais equipes terão determinados desempenhos em cada fase da competição. Você precisa selecionar times que irão avançar invictos (3x0), equipes que serão eliminadas sem vencer (0x3) e os times que simplesmente passarão de fase. Cada acerto gera pontos, permitindo comparar seu desempenho com outros fãs ou desbloquear recompensas. A lógica pode ser adaptada para qualquer campeonato: você define as fases, os tipos de previsões e a pontuação para cada acerto, criando um desafio estratégico baseado no conhecimento sobre as equipes e seus resultados.
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-8 lg:gap-10">
                            {/* TIMES DISPONÍVEIS */}
                            <div className={`grid grid-cols-2 md:grid-cols-8 gap-4 w-full justify-items-center`}>
                                {timesDisponiveis.map(timeId => (
                                    <TimeDraggable
                                        key={timeId}
                                        timeId={timeId}
                                        onRemove={removerTime}
                                        situacao={situacao!}
                                    />
                                ))}
                            </div>

                            {/* 3-0 e 0-3 */}
                            <div className="grid grid-cols-2 gap-4 w-full md:grid-cols-3">
                                <div className="col-start-1 col-end-2 row-start-1 row-end-2 flex flex-col justify-center items-center">
                                    <p className="text-7xl text-white font-heading">3x0</p>
                                    <SlotDrop slot={slots.find(s => s.id === "3-0")!}>
                                        {getSlotTime("3-0") && (
                                            <TimeDraggable
                                                timeId={getSlotTime("3-0")!}
                                                tipo="3-0"
                                                resultado={resultado}
                                                onRemove={removerTime}
                                                situacao={situacao!}
                                            />
                                        )}
                                    </SlotDrop>
                                </div>
                                <div className="flex flex-col justify-center items-center col-start-1 col-end-3 md:col-start-2 md:col-end-3">
                                    {
                                        pickemDefinido ? (
                                            <h2 className="font-heading text-center text-4xl hidden md:block md:text-5xl lg:text-6xl ">Você ja definiu seus times no Pick'em!</h2>
                                        ) : (
                                            <h2 className="font-heading text-center text-4xl hidden md:block md:text-5xl lg:text-6xl ">Você ainda não definiu seus times no Pick'em!</h2>
                                        )
                                    }
                                    {
                                        situacao === 'encerrado' ? (
                                            <h2>Campeonato Encerrado</h2>
                                        ) : (
                                            <h2>Campeonato em Andamento...</h2>
                                        )
                                    }
                                </div>
                                <div className="col-start-2 col-end-3 row-start-1 row-end-2 flex flex-col justify-center items-center md:col-start-3 md:col-end-4">
                                    <p className="text-7xl text-white font-heading">0x3</p>
                                    <SlotDrop slot={slots.find(s => s.id === "0-3")!}>
                                        {getSlotTime("0-3") && (
                                            <TimeDraggable
                                                timeId={getSlotTime("0-3")!}
                                                tipo="0-3"
                                                resultado={resultado}
                                                onRemove={removerTime}
                                                situacao={situacao!}
                                            />
                                        )}
                                    </SlotDrop>

                                </div>
                            </div>

                            {/* ADVANCE */}
                            <div className="grid grid-cols-2 gap-2 w-full justify-items-center md:grid-cols-6">
                                {slots
                                    .filter(s => s.tipo === "advance")
                                    .map(slot => (
                                        <SlotDrop key={slot.id} slot={slot}>
                                            {slot.timeId && (
                                                <TimeDraggable
                                                    timeId={slot.timeId}
                                                    tipo="advance"
                                                    resultado={resultado}
                                                    onRemove={removerTime}
                                                    situacao={situacao!}
                                                />
                                            )}
                                        </SlotDrop>
                                    ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 max-w-125 ml-auto mr-4">
                            <button disabled={pickemDefinido ? true : false} className={`font-bold bg-green-600 w-full text-center p-2 rounded-md text-xl ${pickemDefinido ? 'opacity-40' : 'opacity-100'}`} onClick={salvarPickem} style={{ textShadow: '1px 1px 2px black' }}>Salvar!</button>
                            <button disabled={pickemDefinido ? true : false} className={`font-bold bg-red-600 w-full text-center p-2 rounded-md text-xl ${pickemDefinido ? 'opacity-40' : 'opacity-100'}`} onClick={salvarPickem} style={{ textShadow: '1px 1px 2px black' }}>Resetar!</button>
                        </div>
                        <div className="hidden">
                            <button>Simule as partidas</button>
                        </div>
                    </div>
                </div>
            </DndContext>
        </Template>
    )
}