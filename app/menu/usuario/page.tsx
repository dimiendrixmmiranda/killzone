'use client'

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import Template from "@/src/components/template/Template"
import { signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Dialog } from 'primereact/dialog';
import { IoSaveSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import Comentario from "@/src/components/comentario/Comentario";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { IMAGEM_JOGADOR_DEFAULT, IMAGEM_NOTICIA_DEFAULT, IMAGEM_USER_DEFAULT } from '@/src/assets/imagens';
import Image from 'next/image';
import Link from 'next/link';
import { Campeonato } from '@/src/domain/Campeonato';
import { Fantasy } from '@/src/domain/Fantasy';
import { getCampeonatoById } from '@/src/services/campeonato.service';
import { useCampeonatos } from '@/src/hooks/useCampeonatos';
import { useJogadores } from '@/src/hooks/useJogadores';
import { Posicao } from '@/src/domain/Posicao';
import { BsArrowRepeat } from 'react-icons/bs';
import { TbCircleLetterCFilled, TbFilter2Edit, TbPhotoEdit } from 'react-icons/tb';
import { calcularPontuacaoTotalTime, encerramentoDaEscalacaoDoFantasy, getPontuacaoDetalhadaJogadorNoCampeonato } from '@/src/services/fantasy.service';
import { useRef } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { MdAddAPhoto } from 'react-icons/md';



export default function Page() {
    const [visible, setVisible] = useState(false);
    const [visiblePontuacao, setVisiblePontuacao] = useState(false);

    const { data: session, status } = useSession()
    const [user, setUser] = useState<any>(undefined)
    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [nickname, setNickname] = useState("")

    const [senhaAtual, setSenhaAtual] = useState('')
    const [novaSenha, setNovaSenha] = useState('')
    const [confirmacaoNovaSenha, setconfirmacaoNovaSenha] = useState('')

    const [comentarios, setComentarios] = useState<any[]>([])

    const [pickems, setPickems] = useState<any[]>([])

    const [fantasys, setFantasys] = useState<Fantasy[]>([])
    const [fantasyAtual, setFantasyAtual] = useState<Fantasy | null>(null)
    const [campeonatoAtual, setCampeonatoAtual] = useState<Campeonato | null>(null)

    const { campeonatos } = useCampeonatos()
    const { jogadores } = useJogadores()

    const op = useRef<OverlayPanel | null>(null)

    // aqui
    const POSICOES: Posicao[] = [
        "awper",
        "igl",
        "rifler",
        "rifler",
        "entry",
        "coach"
    ]
    const [flippedSlots, setFlippedSlots] = useState<boolean[]>(
        Array(POSICOES.length).fill(false)
    )
    function toggleFlip(index: number) {
        setFlippedSlots(prev => {
            const novo = [...prev]
            novo[index] = !novo[index]
            return novo
        })
    }
    function getBgByCategoria(categoria?: string) {
        switch (categoria) {
            case "ouro":
                return "/default/categoria/ouro.png"
            case "prata":
                return "/default/categoria/prata.png"
            case "bronze":
                return "/default/categoria/bronze.png"
            default:
                return ""
        }
    }

    function renderizarCampoPontuacao(nomeDoCampo: string, valor: string, pontuacao = true, capitao = false) {
        return (
            <li className={`flex justify-between ${nomeDoCampo.toLowerCase() === 'total' ? 'font-heading text-2xl' : ''}`}>
                <span>{nomeDoCampo}</span>
                <span className={`
                    font-bold 
                    ${pontuacao == false ? 'text-white' : ''}
                    ${pontuacao && parseFloat(valor) > 0 ? 'text-green-600' : 'text-red-500'}
                `}>
                    {
                        capitao ? (
                            <div className="flex items-end gap-2">
                                <span className="text-sm mb-1">2x {valor}</span>
                                <b>{(parseFloat(valor) * 2).toFixed(2)} pts</b>
                            </div>
                        ) : (
                            `
                                ${parseFloat(valor).toFixed(2)} ${pontuacao ? 'pts' : ''}
                            `
                        )
                    }
                </span>
            </li>
        )
    }

    useEffect(() => {
        if (!user?.id) return

        async function fetchFantasys() {
            const res = await fetch("/api/fantasy")
            const data = await res.json()

            const filtrados = data.filter((f: any) => {
                console.log("COMPARE:", f.userId, user.id)
                return f.userId === user.id
            })
            setFantasys(filtrados)
        }

        fetchFantasys()
    }, [user])

    useEffect(() => {
        async function fetchPickems() {
            if (!user?.id) return

            const res = await fetch(`/api/pickem?userId=${user.id}`)
            const data = await res.json()

            setPickems(data)
        }

        fetchPickems()
    }, [user])

    useEffect(() => {
        if (!user?.id) return

        async function load() {
            const res = await fetch(`/api/user/${user.id}/comments`)
            const data = await res.json()
            setComentarios(data)
        }

        load()
    }, [user?.id])

    useEffect(() => {
        if (session?.user?.email) {
            fetch("/api/user")
                .then(res => res.json())
                .then(data => {
                    setUser(data)
                })
        }
    }, [session])

    useEffect(() => {
        if (user) {
            setNome(user.name || "")
            setEmail(user.email || "")
            setPhone(user.phone || "")
            setNickname(user.nickname || "")
        }
    }, [user])


    if (status === "loading") {
        return <p>carregando sessão...</p>
    }

    if (user === undefined) {
        return <p>carregando usuário...</p>
    }

    if (user === null) {
        return <p>usuário não encontrado 💀</p>
    }


    async function handleUpdate(field: string, value: string) {
        const res = await fetch("/api/user/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                [field]: value,
            }),
        })

        const data = await res.json()

        console.log("atualizado:", data)
        setUser(data)
    }

    async function handleChangePassword() {
        if (novaSenha !== confirmacaoNovaSenha) {
            alert("senhas não coincidem 😭")
            return
        }

        const res = await fetch("/api/user/password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                senhaAtual,
                novaSenha,
            }),
        })

        const data = await res.json()

        if (data.error) {
            alert(data.error)
            return
        }

        alert("senha alterada 🔥")

        setVisible(false)
        setSenhaAtual("")
        setNovaSenha("")
        setconfirmacaoNovaSenha("")
    }

    function handleCancelarPassword() {
        setSenhaAtual("")
        setNovaSenha("")
        setconfirmacaoNovaSenha("")
        setVisible(false)
    }

    function handleFiltrarFantasy(fantasy: Fantasy) {
        setVisiblePontuacao(true)
        setFantasyAtual(fantasy)
        const campAtual = getCampeonatoById(fantasy.campeonatoId, campeonatos)
        if (campAtual) setCampeonatoAtual(campAtual)
        // console.log(campAtual)
    }

    async function handleImageChange(e: any) {
        const file = e.target.files[0]

        if (!file) return

        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch("/api/user/upload", {
            method: "POST",
            body: formData
        })

        const data = await res.json()

        if (data.url) {
            if (data.url) {
                await handleUpdate("image", data.url)
            }
            // salva no usuário
            await handleUpdate("image", data.url)
        }
    }

    async function handleBadgeChange(e: any) {
        const file = e.target.files[0]

        if (!file) return

        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch("/api/user/upload", {
            method: "POST",
            body: formData
        })

        const data = await res.json()

        if (data.url) {
            await handleUpdate("badge", data.url)
        }
    }

    return (
        <Template>
            <div>
                <div className="flex flex-col justify-center items-center bg-red-400 relative mb-[75px] lg:mb-[100px]">
                    <div className='relative bg-zinc-900 w-full h-[220px] lg:h-[300px]'>
                        <Image alt='Badge' src={user.badge || IMAGEM_NOTICIA_DEFAULT} fill className='object-cover'/>
                    </div>
                    <div className='absolute -bottom-[30%] left-[50%]' style={{ transform: 'translate(-50%)' }}>
                        <div className="relative flex flex-col justify-center items-center max-w-[250px] w-full mx-auto">
                            <div className="relative w-[200px] h-[200px] rounded-full bg-zinc-300 overflow-hidden lg:w-[250px] lg:h-[250px]">
                                <Image alt={`${user.name}`} src={user.image || IMAGEM_USER_DEFAULT} fill className='object-cover' />
                            </div>
                        </div>
                    </div>
                    <div className='absolute top-2 right-2'>
                        <div className="card flex justify-content-center">
                            <button
                                className='bg-magenta text-2xl p-2 rounded-full cursor-pointer'
                                onClick={(e) => op.current?.toggle(e)}
                            >
                                <TbFilter2Edit />
                            </button>
                            <OverlayPanel ref={op} className="!bg-magenta !border !border-pink-900 rounded-lg overlay-custom"
                            >
                                <div className='flex flex-col gap-2 items-start'>
                                    <div className='w-full'>
                                        <label
                                            htmlFor="upload"
                                            className="text-white rounded-full bg-azul-escuro flex items-center justify-start gap-2 cursor-pointer whitespace-nowrap p-2 px-4 hover:bg-blue-500 transition"
                                            style={{ textShadow: '1px 1px 2px black' }}
                                        >
                                            <MdAddAPhoto />
                                            <p>Alterar Foto de Perfil</p>
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            id="upload"
                                            className="hidden"
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <label
                                            htmlFor="upload-badge"
                                            className="text-white rounded-full bg-azul-escuro flex items-center gap-2 cursor-pointer p-2 px-4 hover:bg-blue-500 transition"
                                        >
                                            <TbPhotoEdit />
                                            <p>Alterar Badge</p>
                                        </label>

                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleBadgeChange}
                                            id="upload-badge"
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            </OverlayPanel>
                        </div>
                    </div>
                </div>
                <h1 className='font-heading text-4xl text-center text-azul-escuro font-bold max-w-[90%] truncate mx-auto'>Bem Vindo {user.nickname}</h1>
            </div>

            <div className="p-4 text-black max-w-360 mx-auto flex flex-col gap-4 pb-16 md:pb-0 md:grid md:grid-cols-[260px_1fr] md:gap-4 lg:grid-cols-[300px_1fr] lg:gap-8 lg:p-8 lg:pt-4">
                <div className="md:col-start-1 md:col-end-3">
                    <h3 className="text-3xl font-heading lg:text-3xl">Seus dados</h3>
                    <ul className='flex flex-col gap-2 md:grid md:grid-cols-2 md:gap-x-8'>
                        <li>
                            <label htmlFor="nome">Seu nome completo:</label>
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    name="nome"
                                    id="nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    className="text-black h-[35px] border border-black p-2 rounded-l-lg w-full bg-azul-escuro text-white"
                                />
                                <button
                                    onClick={() => handleUpdate("name", nome)}
                                    className="bg-magenta text-white h-[35px] w-[35px] flex justify-center items-center rounded-r-lg cursor-pointer"
                                >
                                    <IoSaveSharp />
                                </button>
                            </div>
                        </li>
                        <li>
                            <label htmlFor="email">Seu email:</label>
                            <div className="flex items-center justify-center">
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="text-black h-[35px] border border-black p-2 rounded-l-lg w-full bg-azul-escuro text-white"
                                />
                                <button
                                    className="bg-magenta text-white h-[35px] w-[35px] flex justify-center items-center rounded-r-lg cursor-pointer"
                                    onClick={() => handleUpdate("email", email)}
                                >
                                    <IoSaveSharp />
                                </button>
                            </div>
                        </li>
                        <li>
                            <label htmlFor="phone">Seu Telefone:</label>
                            <div className="flex items-center justify-center">
                                <input
                                    type="text"
                                    name="phone"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="text-black h-[35px] border border-black p-2 rounded-l-lg w-full bg-azul-escuro text-white"
                                />
                                <button
                                    className="bg-magenta text-white h-[35px] w-[35px] flex justify-center items-center rounded-r-lg cursor-pointer"
                                    onClick={() => handleUpdate("phone", phone)}
                                >
                                    <IoSaveSharp />
                                </button>
                            </div>
                        </li>
                        <li>
                            <label htmlFor="nickname">Seu Nickname:</label>
                            <div className="flex items-center justify-center">
                                <input
                                    type="text"
                                    name="nickname"
                                    id="nickname"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    className="text-black h-[35px] border border-black p-2 rounded-l-lg w-full bg-azul-escuro text-white"
                                />
                                <button
                                    className="bg-magenta text-white h-[35px] w-[35px] flex justify-center items-center rounded-r-lg cursor-pointer"
                                    onClick={() => handleUpdate("nickname", nickname)}
                                >
                                    <IoSaveSharp />
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col gap-2 md:col-start-1 md:col-end-3 md:grid md:grid-cols-2 md:gap-4 lg:col-start-2 lg:max-w-[400px] lg:w-full lg:ml-auto">
                    <button onClick={() => setVisible(true)} className="bg-azul-escuro text-white w-full py-1 text-xl font-bold cursor-pointer rounded-md" style={{ textShadow: '1px 1px 2px black' }}>Alterar senha</button>
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="bg-red-500 w-full text-center font-bold text-xl text-white py-1 cursor-pointer rounded-md" style={{ textShadow: '1px 1px 2px black' }}
                    >
                        Sair da conta
                    </button>

                </div>
                <div className="flex flex-col gap-4 w-full col-start-1 col-end-3">
                    <h3 className="font-heading text-3xl">Comentarios que voce ja fez:</h3>
                    {
                        comentarios.length > 0 ? (
                            <Swiper
                                modules={[Autoplay, Pagination, Navigation]}
                                slidesPerView={1}
                                loop
                                autoplay={{
                                    delay: 5000,
                                    disableOnInteraction: false,
                                }}
                                breakpoints={{
                                    0: {
                                        slidesPerView: 1,
                                        spaceBetween: 10,
                                    },
                                    1024: {
                                        slidesPerView: 2,
                                        spaceBetween: 15,
                                    },
                                    1440: {
                                        slidesPerView: 3,
                                        spaceBetween: 15,
                                    },
                                }}
                                pagination={{ clickable: true }}
                                navigation
                                className="w-full h-full"
                            >
                                {comentarios.map((comentario) => (
                                    <SwiperSlide key={comentario.id}>
                                        <Comentario
                                            comentario={comentario}
                                            key={comentario.id}
                                            linkNoticia={
                                                comentario.news
                                                    ? `/noticia/${comentario.news.slug}`
                                                    : undefined
                                            }
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <div className="flex justify-center items-center text-center">
                                <h3>Você ainda não fez nenhum comentário!</h3>
                            </div>
                        )
                    }
                </div>
                <div className="flex flex-col gap-4 w-full col-start-1 col-end-3">
                    <h3 className="font-heading text-3xl">Pick'ems feitos:</h3>
                    {
                        pickems.length > 0 ? (
                            <Swiper
                                modules={[Autoplay, Pagination, Navigation]}
                                slidesPerView={1}
                                loop
                                autoplay={{
                                    delay: 5000,
                                    disableOnInteraction: false,
                                }}
                                breakpoints={{
                                    0: {
                                        slidesPerView: 1,
                                        spaceBetween: 10,
                                    },
                                    1024: {
                                        slidesPerView: 2,
                                        spaceBetween: 15,
                                    },
                                    1440: {
                                        slidesPerView: 3,
                                        spaceBetween: 15,
                                    },
                                }}
                                pagination={{ clickable: true }}
                                navigation
                                className="w-full h-full"
                            >
                                {pickems.map((pickem) => {
                                    const campAtual = campeonatos.find(camp => camp.id === pickem.campeonatoId)
                                    if (!campAtual) return null
                                    return (
                                        <SwiperSlide key={pickem.id}>
                                            <Link href={`/pickem/${campAtual.slugId}`} className='relative'>
                                                <div className='relative w-full h-[200px] rounded-t-xl overflow-hidden'>
                                                    <Image alt={`${campAtual.nome}`} src={campAtual.imagem} fill className='object-cover' />
                                                </div>
                                                <h2 className='text-center font-heading text-4xl truncate bg-zinc-950 w-full flex justify-center items-center text-white pt-1 rounded-b-xl'>{campAtual.nome}</h2>
                                            </Link>
                                        </SwiperSlide>
                                    )
                                })}
                            </Swiper>
                        ) : (
                            <div className="flex justify-center items-center text-center">
                                <h3>Você ainda não fez nenhum comentário!</h3>
                            </div>
                        )
                    }
                </div>
                <div className="flex flex-col gap-4 w-full col-start-1 col-end-3">
                    <h3 className="font-heading text-3xl">Fantasys feitos:</h3>
                    {
                        fantasys.length > 0 ? (
                            <Swiper
                                modules={[Autoplay, Pagination, Navigation]}
                                slidesPerView={1}
                                loop
                                autoplay={{
                                    delay: 5000,
                                    disableOnInteraction: false,
                                }}
                                breakpoints={{
                                    0: {
                                        slidesPerView: 1,
                                        spaceBetween: 10,
                                    },
                                    1024: {
                                        slidesPerView: 2,
                                        spaceBetween: 15,
                                    },
                                    1440: {
                                        slidesPerView: 3,
                                        spaceBetween: 15,
                                    },
                                }}
                                pagination={{ clickable: true }}
                                navigation
                                className="w-full h-full"
                            >
                                {fantasys.map((fantasy, i) => {
                                    const campAtual = getCampeonatoById(fantasy.campeonatoId, campeonatos)
                                    if (!campAtual) return null
                                    const podeEscalar = encerramentoDaEscalacaoDoFantasy(campAtual?.inicio)

                                    return (
                                        <SwiperSlide key={i} className='relative'>
                                            <div className='relative cursor-pointer' onClick={() => handleFiltrarFantasy(fantasy)} >
                                                <div className='relative w-full h-[200px] rounded-t-xl overflow-hidden'>
                                                    <Image alt={`${campAtual.nome}`} src={campAtual.imagem} fill className='object-cover' />
                                                </div>
                                                <h2 className='text-center font-heading text-4xl truncate bg-zinc-950 w-full flex justify-center items-center text-white pt-1 rounded-b-xl'>{campAtual.nome}</h2>
                                            </div>
                                            <button className={`absolute top-0 right-0 text-white px-2 font-heading text-3xl rounded-tr-xl cursor-pointer ${podeEscalar ? 'bg-green-600' : 'bg-red-600'}`} style={{ textShadow: '1px 1px 2px black' }}>
                                                {
                                                    podeEscalar ? 'Aberto' : 'Encerrado'
                                                }
                                            </button>
                                        </SwiperSlide>
                                    )
                                })}
                            </Swiper>
                        ) : (
                            <div className="flex justify-center items-center text-center">
                                <h3>Você ainda não fez nenhum comentário!</h3>
                            </div>
                        )
                    }
                </div>
            </div>

            <Dialog
                header={
                    <h1 className='font-heading text-5xl'>Pontuação do Fantasy {campeonatoAtual?.nome}</h1>
                } visible={visiblePontuacao} className="w-full max-w-[1440px]" onHide={() => { if (!visiblePontuacao) return; setVisiblePontuacao(false); }}>
                <div className='flex flex-col gap-4'>
                    <h2 className='font-heading text-4xl'>Esse Foi Seu Fantasy:</h2>
                    <ul className='grid gap-4 grid-cols-1 sm:grid-cols-2 sm:gap-2 md:grid-cols-3 xl:grid-cols-6'>
                        {
                            fantasyAtual?.slots.map((slot, i) => {
                                const pontuacao = slot.jogador
                                    ? getPontuacaoDetalhadaJogadorNoCampeonato(
                                        campeonatoAtual?.slugId!,
                                        slot.jogador.apelido,
                                        jogadores
                                    )
                                    : null

                                return (
                                    <li
                                        key={i}
                                        className={`w-full h-[270px] max-w-[220px] perspective mx-auto cursor-pointer sm:h-[280px]`}
                                    >
                                        {slot.jogador === null ? (
                                            <div className="w-full h-full flex justify-center items-center text-white">
                                                <h2 className="text-4xl font-heading capitalize">
                                                    {slot.posicao}
                                                </h2>
                                            </div>
                                        ) : (
                                            <div
                                                className={`relative w-full h-full text-white duration-500 transform-style preserve-3d ${flippedSlots[i] ? "rotate-y-180" : ""}`}
                                            >
                                                {/* Frente */}
                                                <div
                                                    className="w-full h-full grid grid-rows-[1fr_40px] text-white absolute backface-hidden bg-azul-escuro"
                                                    style={{
                                                        backgroundImage: `url(${getBgByCategoria(slot.jogador?.categoria!)})`,
                                                        backgroundSize: "cover",
                                                        backgroundPosition: "center"
                                                    }}>
                                                    <div className="relative w-full h-full">
                                                        <Image
                                                            alt={slot.jogador.nome}
                                                            src={slot.jogador.imagem || IMAGEM_JOGADOR_DEFAULT}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <h2 className="bg-white text-black text-center font-heading text-xl flex items-center justify-center md:text-2xl">
                                                        {slot.jogador.apelido} - {" "}
                                                        <b className="capitalize font-semibold">
                                                            {slot.jogador.papel}
                                                        </b>
                                                    </h2>

                                                    {
                                                        slot.capitao ? (
                                                            <button
                                                                className={`absolute top-2 left-2 text-xl p-1 rounded-full bg-orange-600`}
                                                            >
                                                                <TbCircleLetterCFilled />
                                                            </button>
                                                        ) : ''
                                                    }
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            toggleFlip(i)
                                                        }}
                                                        className="absolute top-2 right-2 text-white bg-azul-escuro rounded-full p-1 md:text-xl"
                                                    >
                                                        <BsArrowRepeat />
                                                    </button>
                                                </div>
                                                {/* Verso */}
                                                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-black text-white flex flex-col items-center justify-center">
                                                    <div className="flex flex-col w-full">
                                                        <h2 className="text-center font-heading text-xl">Pontuação</h2>
                                                        <ul className="flex flex-col text-sm w-full px-4">
                                                            {renderizarCampoPontuacao('Kills', pontuacao?.kills.toFixed(1)!)}
                                                            {renderizarCampoPontuacao('Mortes', pontuacao?.deaths.toFixed(1)!)}
                                                            {renderizarCampoPontuacao('ADR', pontuacao?.adr.toFixed(1)!)}
                                                            {renderizarCampoPontuacao('Assistência', pontuacao?.assists.toFixed(1)!)}
                                                            {renderizarCampoPontuacao('Assistência Flash', pontuacao?.assistFlash.toFixed(1)!)}
                                                            {renderizarCampoPontuacao('Clutchs', pontuacao?.clutch.toFixed(1)!)}
                                                            {renderizarCampoPontuacao('Primeira Kill', pontuacao?.firstKills.toFixed(1)!)}
                                                            {renderizarCampoPontuacao('Primeira a Morrer', pontuacao?.firstDeaths.toFixed(1)!)}
                                                            {renderizarCampoPontuacao('Headshots', pontuacao?.headshots.toFixed(1)!)}
                                                            {renderizarCampoPontuacao('Traded', pontuacao?.traded.toFixed(1)!)}
                                                            {
                                                                slot.capitao ? (
                                                                    renderizarCampoPontuacao('Total', pontuacao?.total.toFixed(2)!, true, true)
                                                                ) : (
                                                                    renderizarCampoPontuacao('Total', pontuacao?.total.toFixed(2)!)
                                                                )
                                                            }
                                                        </ul>
                                                        {slot.jogador.papel !== "coach" && (
                                                            <button
                                                                className={`absolute top-2 left-2 p-1 rounded-full ${slot.capitao ? "bg-orange-600" : "bg-azul-escuro text-white"
                                                                    }`}
                                                            >
                                                                <TbCircleLetterCFilled />
                                                            </button>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            toggleFlip(i)
                                                        }}
                                                        className="absolute top-1 right-1 text-white bg-azul-escuro rounded-full p-1 md:text-xl"
                                                    >
                                                        <BsArrowRepeat />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <h3 className='font-heading text-4xl text-center mt-4'>
                        Sua Pontuação Final Foi de: {(calcularPontuacaoTotalTime(fantasyAtual?.slots!, campeonatoAtual?.slugId!, jogadores)).toFixed(2)} pts
                    </h3>
                </div>
            </Dialog>

            <Dialog header="Alterar Senha" visible={visible} className="w-full max-w-[95%]" onHide={() => { if (!visible) return; setVisible(false); }}>
                <div>
                    <label htmlFor="senhaAtual">Digite sua senha Atual:</label>
                    <input
                        type="password"
                        name="senhaAtual"
                        id="senhaAtual"
                        value={senhaAtual}
                        onChange={(e) => setSenhaAtual(e.target.value)}
                        className="text-black h-[35px] border border-black p-2 rounded-lg bg-azul/70 text-white"
                    />
                </div>
                <div>
                    <label htmlFor="novaSenha">Digite sua nova senha:</label>
                    <input
                        type="password"
                        name="novaSenha"
                        id="novaSenha"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        className="text-black h-[35px] border border-black p-2 rounded-lg bg-azul/70 text-white"
                    />
                </div>
                <div>
                    <label htmlFor="confirmacaoNovaSenha">Confirme sua nova senha:</label>
                    <input
                        type="password"
                        name="confirmacaoNovaSenha"
                        id="confirmacaoNovaSenha"
                        value={confirmacaoNovaSenha}
                        onChange={(e) => setconfirmacaoNovaSenha(e.target.value)}
                        className="text-black h-[35px] border border-black p-2 rounded-lg bg-azul/70 text-white"
                    />
                </div>
                <div className="w-full grid grid-cols-2">
                    <button onClick={handleChangePassword}>Alterar</button>
                    <button onClick={handleCancelarPassword}>Cancelar</button>
                </div>
            </Dialog>
        </Template >
    )
}



