'use client'

import { useState } from "react"
import { signIn } from "next-auth/react"
import Template from "@/src/components/template/Template"
import Image from "next/image"

export default function Page() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [nickname, setNickname] = useState("")

    const [estado, setEstado] = useState<'login' | 'criar-conta'>('criar-conta')

    async function handleRegister() {
        if (password !== confirmPassword) {
            alert("senha não bate")
            return
        }

        const res = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
                phone,
                nickname
            }),
        })

        console.log("res:", res)

        if (!res.ok) {
            alert("erro ao criar conta")
            return
        }

        await signIn("credentials", {
            email,
            password,
            callbackUrl: "/menu/usuario",
        })
    }

    async function handleLogin() {
        await signIn("credentials", {
            email,
            password,
            callbackUrl: "/menu/usuario",
        })
    }

    return (
        <Template>
            <div className="max-w-[1000px] mx-auto">
                {
                    estado === "criar-conta" ? (
                        <div className="text-black p-4 pb-20 rounded-xl overflow-hidden">
                            <div className="bg-azul-escuro text-white flex flex-col gap-2 justify-center items-center p-4">
                                <h3 className="font-heading text-4xl text-center">Crie uma conta e aproveite todas as vantagens do site</h3>
                                <p className="text-center text-sm">Comente nas notícias, vote no craque da semana, crie seu ranking das organizações, monte seu Pick’em em campeonatos específicos e explore muitas outras interações dentro da plataforma.</p>
                                <div className="relative w-[200px] h-[200px]">
                                    <Image alt="Logo da killzone" src={'/logo/logo-killzone.png'} fill className="object-contain" />
                                </div>
                            </div>
                            <div className="p-4 border border-azul-escuro">
                                <div>
                                    <label htmlFor="nome">Informe seu nome completo:</label>
                                    <input
                                        id="nome"
                                        placeholder="Nome..."
                                        className="border bg-azul h-[35px] text-sm p-2 w-full text-white rounded-xl"
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email">Informe seu email:</label>
                                    <input
                                        id="email"
                                        placeholder="email"
                                        className="border bg-azul h-[35px] text-sm p-2 w-full text-white rounded-xl"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="senha">Informe sua senha:</label>
                                    <input
                                        placeholder="senha"
                                        type="password"
                                        className="border bg-azul h-[35px] text-sm p-2 w-full text-white rounded-xl"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="senha">Confirme sua senha:</label>
                                    <input
                                        placeholder="senha"
                                        type="password"
                                        className="border bg-azul h-[35px] text-sm p-2 w-full text-white rounded-xl"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="senha">Informe seu número de celular:</label>
                                    <input
                                        placeholder="9999999999"
                                        type="text"
                                        className="border bg-azul h-[35px] text-sm p-2 w-full text-white rounded-xl"
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="senha">Informe seu Nickname:</label>
                                    <input
                                        placeholder="d1mi..."
                                        type="text"
                                        className="border bg-azul h-[35px] text-sm p-2 w-full text-white rounded-xl"
                                        onChange={(e) => setNickname(e.target.value)}
                                    />
                                </div>
                                <button className="bg-magenta w-full font-heading text-4xl py-1 pt-2 text-white mt-4" style={{ textShadow: '1px 1px 2px black' }} onClick={handleRegister}>Criar conta</button>
                                <button className="text-center flex justify-center items-center w-full" onClick={() => setEstado('login')}>Já é cadastrado? Faça Login!</button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-black p-4 pb-20 rounded-xl overflow-hidden">
                            <div className="bg-azul-escuro text-white flex flex-col gap-2 justify-center items-center p-4">
                                <h3 className="font-heading text-4xl text-center">Bem vindo de volta! Faça login e aproveite!</h3>
                                <p className="text-center text-sm">Comente nas notícias, vote no craque da semana, crie seu ranking das organizações, monte seu Pick’em em campeonatos específicos e explore muitas outras interações dentro da plataforma.</p>
                                <div className="relative w-[200px] h-[200px]">
                                    <Image alt="Logo da killzone" src={'/logo/logo-killzone.png'} fill className="object-contain" />
                                </div>
                            </div>
                            <div className="p-4 border border-azul-escuro">
                                <div>
                                    <label htmlFor="email">Informe seu email:</label>
                                    <input
                                        id="email"
                                        placeholder="email"
                                        className="border bg-azul h-[35px] text-sm p-2 w-full text-white rounded-xl"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="senha">Informe sua senha:</label>
                                    <input
                                        placeholder="senha"
                                        type="password"
                                        className="border bg-azul h-[35px] text-sm p-2 w-full text-white rounded-xl"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <button className="bg-magenta w-full font-heading text-4xl py-1 pt-2 text-white mt-4" style={{ textShadow: '1px 1px 2px black' }} onClick={handleLogin}>Criar conta</button>
                                <button className="text-center flex justify-center items-center w-full" onClick={() => setEstado('criar-conta')}>Ainda não é cadastrado? Crie sua conta agora!</button>
                            </div>
                        </div>
                    )
                }
            </div>
        </Template>
    )
}