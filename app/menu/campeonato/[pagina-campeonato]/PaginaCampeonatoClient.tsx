'use client'

import Template from "@/src/components/template/Template"
import { Campeonato } from "@/src/domain/Campeonato"
import { Partida } from "@/src/domain/Partida"
import { Time } from "@/src/domain/Time"

import { getAllCampeonatos } from "@/src/services/campeonato.service"
import { getPartidasByCampeonato } from "@/src/services/partidas.service"
import { useEffect, useMemo, useState } from "react"
import { getTeamById } from "@/src/services/team.service"
import Image from "next/image"
import EquipesParticipantes from "@/src/components/paginaCompeticao/EquipesParticipantes"
import MVPCompeticao from "@/src/components/paginaCompeticao/MVPCompeticao"
import DadosDoCampeonato from "@/src/components/paginaCompeticao/DadosDoCampeonato"
import JogosDoCampeonato from "@/src/components/paginaCompeticao/JogosDoCampeonato"
import TabelaDoCampeonato from "@/src/components/paginaCompeticao/TabelaCampeonato"
import CabecalhoCampeonato from "@/src/components/paginaCompeticao/CabecalhoCampeonato"
import ClassificacaoFinal from "@/src/components/paginaCompeticao/ClassificacaoFinal"
import NoticiasDoCampeonato from "@/src/components/paginaCompeticao/NoticiasDoCampeonato"
import EstatisticasDosJogadores from "@/src/components/paginaCompeticao/EstatisticasDosJogadores"
import BannerPickem from "@/src/components/paginaCompeticao/BannerPickem"
import Comentario from "@/src/components/comentario/Comentario"
import CampeonatoRelacionado from "@/src/components/paginaCompeticao/CampeonatoRelacionado"
import { IMAGEM_TROFEU_DEFAULT } from "@/src/assets/imagens"

interface Props {
    idCampeonato: string
}

export default function PaginaCampeonatoClient({ idCampeonato }: Props) {

    const [campeonatos, setCampeonatos] = useState<any[]>([])

    useEffect(() => {
        async function fetchCampeonatos() {
            const res = await fetch("/api/campeonatos")
            const data = await res.json()
            setCampeonatos(data)
        }

        fetchCampeonatos()
    }, [])
    console.log(campeonatos) /// aparece a lista 


    useEffect(() => {
        const camp = campeonatos.find(c => c.slugId === idCampeonato)
        if (camp) setCampeonatoAtual(camp)
    }, [idCampeonato, campeonatos])


    const [campeonatoAtual, setCampeonatoAtual] = useState<Campeonato | null>(null)

    console.log(campeonatoAtual)

    const timesDoCampeonato = useMemo((): Time[] => {
        if (!campeonatoAtual) return []
        return campeonatoAtual.timesIds
            .map(t => getTeamById(t))
            .filter((time): time is Time => time !== undefined)
    }, [campeonatoAtual])

    console.log(timesDoCampeonato)


    const partidasDoCampeonato = useMemo((): Partida[] => {
        if (!campeonatoAtual) return []
        const partidas = getPartidasByCampeonato(idCampeonato)
        return partidas
    }, [campeonatoAtual])



    if (!campeonatoAtual) {
        return (
            <Template>
                <div className="text-black p-4 text-center">
                    Carregando campeonato...
                </div>
            </Template>
        )
    }

    return (
        <Template>
            <CabecalhoCampeonato campeonato={campeonatoAtual} />
            <div className="text-black p-4 max-w-360 mx-auto flex flex-col gap-8">
                <div className="flex flex-col items-end gap-4 md:grid md:grid-cols-[300px_1fr] lg:grid-cols-[300px_1fr_1fr] xl:grid-cols-[300px_1fr_1fr]">
                    <div className="relative mt-auto w-full h-100 self-center justify-self-center md:h-106.25">
                        <Image alt={`${campeonatoAtual?.nome}`} src={campeonatoAtual?.trofeu || IMAGEM_TROFEU_DEFAULT} fill className="object-contain" />
                    </div>
                    <EquipesParticipantes times={timesDoCampeonato} />
                    <MVPCompeticao campeonato={campeonatoAtual} />
                </div>
                <DadosDoCampeonato campeonato={campeonatoAtual} />
                <JogosDoCampeonato partidas={partidasDoCampeonato} />
                <CampeonatoRelacionado campeonatoAtual={campeonatoAtual} />
                <div className="xl:grid xl:grid-cols-[1fr_auto] xl:gap-8">
                    <TabelaDoCampeonato campeonato={campeonatoAtual} />
                    <NoticiasDoCampeonato />
                </div>
                <BannerPickem idCampeonato={idCampeonato} />
                <EstatisticasDosJogadores idCampeonato={idCampeonato} />
                <ClassificacaoFinal idCampeonato={idCampeonato} />
                {/* <Comentario /> */}
            </div>
        </Template>
    )
}



