// 'use client'

// import { Jogador } from "@/src/domain/Jogador";
// import { Jogo } from "@/src/domain/Jogo";
// import { Time } from "@/src/domain/Time";
// import GaleriaDeImagens from "@/src/galleria/GaleriaDeImagens";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// interface Props {
//     times: Time[];
//     timeId: string;
//     jogadores: Jogador[];
//     jogos: Jogo[]
// }

// export default function HistoriaTimeClient({ times, timeId, jogadores, jogos }: Props) {
//     const [timeAtual, setTimeAtual] = useState<Time | null>(null);
//     const [jogadorEstrela, setJogadorEstrela] = useState<Jogador | null>(null)
//     const [jogosPresenteTimeAtual, setJogosPresenteTimeAtual] = useState<Jogo[]>([])
//     useEffect(() => {
//         const time = times.find(t => t.id === timeId) || null;
//         setTimeAtual(time);

//         const jogadorEstrela = jogadores.find(j => j.id === time?.jogadorEstrela?.idJogador)
//         if (jogadorEstrela) setJogadorEstrela(jogadorEstrela)

//         const jogosDoTime = jogos.filter(jogo =>
//             time?.modalidades?.includes(jogo.id)
//         );

//         setJogosPresenteTimeAtual(jogosDoTime);

//     }, [times, timeId, jogadores, jogos]);

//     console.log(jogosPresenteTimeAtual);

//     if (!timeAtual) return null;
//     if (!jogadorEstrela) return null;
//     if (!jogos) return null;

//     return (

//         (
//             <div className="bg-black flex flex-col p-4">
//                 <div className={`flex items-center gap-2 justify-center`}>
//                     <div className="relative w-10 h-10">
//                         <Image alt={timeAtual?.nome} src={timeAtual?.imagem} fill className="object-contain" />
//                     </div>
//                     <h2 className="font-heading text-5xl text-center mt-2">{timeAtual?.nome}</h2>
//                 </div>
//                 <div className="max-w-[1100px] w-full mx-auto flex flex-col gap-8">
//                     <div className="mx-auto flex justify-center items-center">
//                         <div className="relative w-56 h-80 md:w-[270px] md:h-[400px] 2xl:w-[400px] 2xl:h-[600px]">
//                             <Image alt={jogadorEstrela?.nome} src={jogadorEstrela?.imagem} fill className="object-cover" />
//                         </div>
//                     </div>
//                     <div className="flex flex-col gap-4">
//                         <h3 className="font-bold text-2xl">Sobre a {timeAtual.nome}</h3>
//                         <ul>
//                             {
//                                 timeAtual.historia?.map((p, i) => {
//                                     return (
//                                         <li key={i}>
//                                             <p className="indent-8">{p}</p>
//                                         </li>
//                                     )
//                                 })
//                             }
//                         </ul>
//                     </div>
//                     <div className="flex flex-col gap-4">
//                         <h3 className="font-bold text-2xl">Galeria de Imagens:</h3>
//                         <GaleriaDeImagens />
//                     </div>
//                     <div className="flex flex-col gap-4">
//                         <h3 className="font-bold text-2xl">Troféus da Organização</h3>
//                         <ul>
//                             <li>
//                                 <div className="relative w-20 h-20">
//                                     <Image alt="trofeu" src={'/default/trofeu/trofeu.png'} fill className="object-contain"/>
//                                 </div>
//                             </li>
//                         </ul>
//                     </div>
//                     <div className="flex flex-col gap-4 max-w-[700px]">
//                         <h3 className="font-bold text-2xl">Modalidades em que a {timeAtual.nome} está presente</h3>
//                         <ul className="grid grid-cols-4 md:grid-cols-7">
//                             {
//                                 jogosPresenteTimeAtual.map(jogo => {
//                                     return (
//                                         <li key={jogo.id} className="flex w-full justify-centers">
//                                             <div className="relative w-12 h-12">
//                                                 <Image alt={jogo.nome} src={jogo.imagem} fill className="object-cover" />
//                                             </div>
//                                         </li>
//                                     )
//                                 })
//                             }
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//         )

//     )
// }
