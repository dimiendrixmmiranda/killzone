'use client'

import { Jogador } from "@/src/domain/Jogador";
import Image from "next/image";
import { useState } from "react";
import DialogJogador from "../dialogJogador/DialogJogador";
import { Time } from "@/src/domain/Time";
import { Noticia } from "@/src/domain/Noticia";
import { getTeamById } from "@/src/services/team.service";
import { IMAGEM_TIME_DEFAULT } from "@/src/assets/imagens";

interface Props {
    jogador: Jogador;
    times: Time[]
    noticiasJogador: Noticia[]
}

export default function CardJogador({ jogador, times, noticiasJogador }: Props) {
    const [aberto, setAberto] = useState(false)
    const time = getTeamById(jogador.timeAtual)

    return (
        <>
            <li
                className="relative mx-auto cursor-pointer grid grid-rows-[1fr_40px] max-w-50 w-full overflow-hidden h-62.5 bg-zinc-400 shrink-0 lg:max-w-55 lg:h-70"
                onClick={() => setAberto(true)}
            >
                <div className="relative">
                    <p className="absolute top-2 left-2 font-heading text-xs font-semibold capitalize text-white bg-orange-600 leading-4 px-1 pt-1" style={{textShadow: '1px 1px 2px black'}}>{jogador.papel}</p>
                    <p className="absolute top-1 right-2 font-heading text-lg font-semibold capitalize text-white bg-azul-escuro leading-4 p-1 pt-2" style={{textShadow: '1px 1px 2px black'}}>{jogador.sinergia}</p>
                    <div className="absolute top-[50%] left-[50%] w-[90%] h-[90%]" style={{ transform: 'translate(-50%,-50%)' }}>
                        <div className="relative w-full h-full">
                            <Image alt="Logo do time" src={time?.imagem || IMAGEM_TIME_DEFAULT} fill className="object-contain" />
                        </div>
                    </div>
                    <div className="relative w-full h-full">
                        <Image alt={`Imagem do jogador ${jogador.nome}`} src={jogador.imagem} fill className="object-cover" />
                    </div>
                </div>
                <div className="flex min-w-0 w-full h-full justify-center items-center bg-azul-escuro font-heading text-2xl">
                    <h2>{jogador.apelido}</h2>
                </div>
            </li>

            <DialogJogador
                jogador={jogador}
                aberto={aberto}
                times={times}
                noticiasJogador={noticiasJogador}
                onFechar={() => setAberto(false)}
            />
        </>
    );
}
