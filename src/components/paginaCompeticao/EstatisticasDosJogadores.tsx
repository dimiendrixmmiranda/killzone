'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import { getPartidasByCampeonato } from '@/src/services/partidas.service'
import { getEstatisticasJogadoresCampeonato } from '@/src/services/campeonato.service'
import { getPlayerById, getPlayerRounds } from '@/src/services/player.service'
import Image from 'next/image'
import { IMAGEM_JOGADOR_DEFAULT } from '@/src/assets/imagens'
import { Dialog } from 'primereact/dialog';
import { FaCrosshairs, FaFire, FaMap, FaSkull, FaTrophy } from "react-icons/fa6"
import { useState } from 'react'
import { EstatisticaJogadorAcumulado } from '@/src/domain/EstatisticasDoJogadorAcumulado'
import { FaHandsHelping } from 'react-icons/fa'
import { ImTarget } from 'react-icons/im'
import { Partida } from '@/src/domain/Partida'

interface EstatisticasDosJogadoresProps {
    idCampeonato: string
}

export default function EstatisticasDosJogadores({ idCampeonato }: EstatisticasDosJogadoresProps) {
    const partidas = getPartidasByCampeonato(idCampeonato)
    const estatisticas = getEstatisticasJogadoresCampeonato(partidas)

    const [estatisticasJogadorSelecionado, setEstatisticasJogadorSelecionado] = useState<EstatisticaJogadorAcumulado | null>(null)
    const [visible, setVisible] = useState<boolean>(false)

    return (
        <div className='flex flex-col gap-4'>
            <h3 className="font-heading text-3xl md:col-start-1 md:col-end-3">Estatísticas dos Jogadores</h3>
            {
                estatisticas.length > 0 ? (
                    <div className="w-full mx-auto">
                        <Swiper
                            modules={[Navigation]}
                            spaceBetween={20}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true }}
                            breakpoints={{
                                768: {
                                    slidesPerView: 3,
                                    spaceBetween: 20,
                                },
                                1024: {
                                    slidesPerView: 4,
                                    spaceBetween: 30,
                                },
                                1280: {
                                    slidesPerView: 5,
                                    spaceBetween: 32,
                                },
                            }}
                        >
                            {
                                estatisticas.map((estatisticasDoJogador, i) => {
                                    const jogador = getPlayerById(estatisticasDoJogador.jogadorId)

                                    return (
                                        <SwiperSlide
                                            key={i}
                                            className=''
                                            onClick={() => {
                                                setEstatisticasJogadorSelecionado(estatisticasDoJogador)
                                                setVisible(true)
                                            }}
                                        >
                                            <div className="bg-zinc-800 text-white rounded-xl text-center flex flex-col gap-2 p-2 justify-center items-center relative max-w-72.5 w-full mx-auto cursor-pointer" >
                                                <div className='relative w-62.5 h-75 md:h-67.5'>
                                                    <Image alt={`${estatisticasDoJogador.jogadorId}`} src={jogador?.imagem || IMAGEM_JOGADOR_DEFAULT} fill className='object-cover' />
                                                </div>
                                                <div>
                                                    <h3 className='text-2xl font-bold'>{estatisticasDoJogador.jogadorId}</h3>
                                                </div>
                                                <div className='absolute top-3 right-4 flex flex-col'>
                                                    <p>{estatisticasDoJogador.rating.toFixed(2)}</p>
                                                    <span className='text-xs'>{estatisticasDoJogador.mapasJogados} maps</span>
                                                </div>
                                                <div className='absolute top-3 left-4 flex flex-col'>
                                                    <p className='text-lg font-bold'># {i + 1}</p>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    )
                                })
                            }
                        </Swiper>
                    </div>
                ) : (
                    <div>
                        <h2 className='text-lg text-start font-semibold'>Nenhuma Estatística Disponível!</h2>
                    </div>
                )
            }
            <Dialog
                header={
                    <div className="flex items-center gap-x-2 flex-wrap">
                        <p>{estatisticasJogadorSelecionado?.jogadorId}</p>
                        <span>-</span>
                        <p className="capitalize">{idCampeonato.replaceAll('-', ' ')}</p>
                    </div>
                }
                visible={visible}
                style={{ width: '90%' }}
                onHide={() => { if (!visible) return; setVisible(false); }}
                className='max-w-[700px] w-full'
            >
                <ul className="space-y-2 md:grid md:grid-cols-2 md:gap-x-10 lg:text-xl">
                    <li className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FaMap />
                            <p>Mapas Jogados</p>
                        </div>
                        <span>{estatisticasJogadorSelecionado?.mapasJogados}</span>
                    </li>

                    <li className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FaCrosshairs />
                            <p>Rounds Jogados</p>
                        </div>
                        <span>{estatisticasJogadorSelecionado && getPlayerRounds(partidas, estatisticasJogadorSelecionado.jogadorId)}</span>
                    </li>

                    <li className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-green-600">
                            <FaFire />
                            <p>Kills</p>
                        </div>
                        <span>{estatisticasJogadorSelecionado?.kills}</span>
                    </li>

                    <li className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-red-600">
                            <FaSkull />
                            <p>Mortes</p>
                        </div>
                        <span>{estatisticasJogadorSelecionado?.deaths}</span>
                    </li>

                    <li className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-blue-600">
                            <FaHandsHelping />
                            <p>Assistências</p>
                        </div>
                        <span>{estatisticasJogadorSelecionado?.assists}</span>
                    </li>

                    <li className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-yellow-600">
                            <FaTrophy />
                            <p>Clutches Vencidos</p>
                        </div>
                        <span>{estatisticasJogadorSelecionado?.clutchVitorias}</span>
                    </li>
                    <li className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-orange-600">
                            <ImTarget />
                            <p>Headshots</p>
                        </div>
                        <span>{estatisticasJogadorSelecionado?.headshots}</span>
                    </li>

                    <li className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-purple-600">
                            <FaFire />
                            <p>KD</p>
                        </div>
                        <span>{estatisticasJogadorSelecionado && (estatisticasJogadorSelecionado?.kills / Math.max(estatisticasJogadorSelecionado?.deaths, 1)).toFixed(2)}</span>
                    </li>

                    <li className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-indigo-500">
                            <FaCrosshairs />
                            <p>ADR Médio</p>
                        </div>
                        <span>{estatisticasJogadorSelecionado && (estatisticasJogadorSelecionado?.adrTotal / estatisticasJogadorSelecionado?.mapasJogados).toFixed(2)}</span>
                    </li>

                    <li className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-orange-600">
                            <ImTarget />
                            <p>Rating Médio</p>
                        </div>
                        <span>{estatisticasJogadorSelecionado && (estatisticasJogadorSelecionado?.rating / estatisticasJogadorSelecionado.mapasJogados).toFixed(2)}</span>
                    </li>
                </ul>
            </Dialog>
        </div>
    )
}