'use client'
import CardCompeticao from "@/src/components/cardCompeticao/CardCompeticao";
import Template from "@/src/components/template/Template";
import { Campeonato } from "@/src/domain/Campeonato";
import { getSituacaoCampeonato } from "@/src/services/campeonato.service";
import { useEffect, useState } from "react";

export default function Page() {

    const [campeonatos, setCampeonatos] = useState<any[]>([])

    useEffect(() => {
        async function fetchCampeonatos() {
            const res = await fetch("/api/campeonatos")
            const data = await res.json()

            const campeonatosEncerrados = data.filter((camp: Campeonato) => {
                const situacao = getSituacaoCampeonato(
                    camp.inicio,
                    camp.fim
                )

                return situacao === "ocorrendo" || situacao === "futuro" || situacao === 'encerrado' // vai mudar para so futuro depois
            })

            setCampeonatos(campeonatosEncerrados)
        }

        fetchCampeonatos()
    }, [])

    return (
        <Template>
            <div className="p-4 text-black max-w-[1440px] w-full mx-auto flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 className="text-6xl font-bold font-heading text-center">Fantasy</h2>
                    <p className="text-center">
                        Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou.
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    <h3 className="text-4xl font-heading leading-8">Campeonatos Disponíveis para Fantasy:</h3>
                    <ul className="fle flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                        {
                            campeonatos.length > 0 ? (
                                campeonatos.map((campeonato, i) => {
                                    return (
                                        <CardCompeticao campeonato={campeonato} key={i} link={`/menu/fantasy/${campeonato.slugId}`}/>
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
            </div>
        </Template>
    )
}