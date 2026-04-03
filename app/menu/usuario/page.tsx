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



export default function Page() {
    const [visible, setVisible] = useState(false);

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

    useEffect(() => {
        if (!user?.id) return

        async function load() {
            const res = await fetch(`/api/user/${user.id}/comments`)
            const data = await res.json()

            console.log("COMENTARIOS FRONT:", data) // 🔥 DEBUG

            setComentarios(data)
        }

        load()
    }, [user?.id])

    useEffect(() => {
        if (session?.user?.email) {
            fetch("/api/user")
                .then(res => res.json())
                .then(data => {
                    console.log("USER API:", data)
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
        console.log(data.url)
    }

    console.log(comentarios)

    return (
        <Template>
            <div className="p-4 text-black max-w-360 mx-auto flex flex-col gap-4 pb-16 md:pb-0 md:grid md:grid-cols-[260px_1fr] md:gap-4 lg:grid-cols-[300px_1fr] lg:gap-8 lg:p-8">
                <div className="flex flex-col justify-center items-center">
                    <h2 className="font-heading text-4xl text-center">Bem Vindo {user.nickname}</h2>
                    <div className="relative flex flex-col justify-center items-center max-w-[250px] w-full mx-auto">
                        <img
                            src={user.image || "/camp.png"}
                            className="w-[200px] h-[200px] rounded-full object-cover bg-zinc-900 lg:w-[250px] lg:h-[250px]"
                        />
                        <div className="absolute bottom-0 right-0">
                            <label
                                htmlFor="upload"
                                className="w-10 h-10 text-white rounded-full bg-azul-escuro flex items-center justify-center cursor-pointer hover:bg-gray-300 transition"
                            >
                                <FaPlus />
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                id="upload"
                                className="hidden"
                            />
                        </div>
                    </div>
                </div>
                <div className="">
                    <h3 className="text-2xl font-heading lg:text-3xl">Seus dados</h3>
                    <ul>
                        <li>
                            <label htmlFor="nome">Seu nome completo:</label>
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    name="nome"
                                    id="nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    className="text-black h-[35px] border border-black p-2 rounded-l-lg w-full bg-azul/70 text-white"
                                />
                                <button
                                    onClick={() => handleUpdate("name", nome)}
                                    className="bg-azul-escuro text-white h-[35px] w-[35px] flex justify-center items-center rounded-r-lg"
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
                                    className="text-black h-[35px] border border-black p-2 rounded-l-lg w-full bg-azul/70 text-white"
                                />
                                <button
                                    className="bg-azul-escuro text-white h-[35px] w-[35px] flex justify-center items-center rounded-r-lg"
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
                                    className="text-black h-[35px] border border-black p-2 rounded-l-lg w-full bg-azul/70 text-white"
                                />
                                <button
                                    className="bg-azul-escuro text-white h-[35px] w-[35px] flex justify-center items-center rounded-r-lg"
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
                                    className="text-black h-[35px] border border-black p-2 rounded-l-lg w-full bg-azul/70 text-white"
                                />
                                <button
                                    className="bg-azul-escuro text-white h-[35px] w-[35px] flex justify-center items-center rounded-r-lg"
                                    onClick={() => handleUpdate("nickname", nickname)}
                                >
                                    <IoSaveSharp />
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col gap-2 md:col-start-1 md:col-end-3 md:grid md:grid-cols-2 md:gap-4">
                    <button onClick={() => setVisible(true)} className="bg-azul-escuro text-white w-full py-1 text-xl font-bold cursor-pointer">Alterar senha</button>
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="bg-red-500 w-full text-center font-bold text-xl text-white py-1 cursor-pointer"
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
            </div>

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