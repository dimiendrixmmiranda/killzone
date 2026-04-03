'use client'

import BarraDePesquisa from "@/src/components/barraDePesquisa/BarraDePesquisa";
import SidebarComponent from "@/src/components/sidebar/Sidebar";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaGear, FaTrophy } from "react-icons/fa6";
import { GiAk47, GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineScoreboard } from "react-icons/md";
import { PiRankingFill } from "react-icons/pi";
import SidebarLateral from "../../sidebar/SidebarLateral";
import Redes from "../../redes/Redes";
import { RiUserCommunityFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { useSession } from "next-auth/react";

export default function Header() {
    const router = useRouter();
    const [termo, setTermo] = useState('');
    const [visible, setVisible] = useState<string | null>(null);

    function pesquisar(valor: string) {
        setTermo(valor);
    }

    function confirmarBusca() {
        if (!termo.trim()) return;
        router.push(`/buscar?q=${encodeURIComponent(termo)}`);
    }

    const { data: session, status } = useSession()
    const [user, setUser] = useState<any>(undefined)
    useEffect(() => {
        if (session?.user?.email) {
            fetch("/api/user")
                .then(res => res.json())
                .then(data => {
                    setUser(data)
                })
        }
    }, [session])

    return (
        <header className="bg-azul-escuro p-2 flex gap-4 items-center justify-between md:justify-start lg:gap-6">
            <Link href={'/'} className="flex items-center flex-1 lg:flex-none">
                <div className="relative w-12 h-12">
                    <Image alt="Logo Kill Zone" src={'/logo/logo-killzone.png'} fill className="object-contain" />
                </div>
                <h1 className="font-heading text-5xl mt-1">KillZone</h1>
            </Link>

            <div className="flex items-center flex-row-reverse gap-4 lg:flex-1 2xl:flex-1">
                <div className="hidden lg:flex lg:ml-auto">
                    {
                        user ? (
                            <div>
                                <Link href={`/menu/usuario`} className="flex items-center gap-1 font-heading text-xl truncate xl:text-xl">
                                    <img
                                        src={user.image || "/camp.png"}
                                        className="w-6 h-6 rounded-full object-cover bg-zinc-900"
                                    />
                                    <p className="mt-1" style={{textShadow: '1px 1px 2px black'}}>{user.nickname}</p>
                                </Link>
                            </div>
                        ) : (
                            <div>
                                <Link href={`/menu/login`} className="flex items-center gap-1 font-heading text-xl truncate xl:text-xl">
                                    <FaUserCircle />
                                    <p className="mt-1" style={{textShadow: '1px 1px 2px black'}}>Entrar</p>
                                </Link>
                            </div>
                        )
                    }
                </div>
                <div
                    onKeyDown={(e) => e.key === 'Enter' && confirmarBusca()}
                    className="flex-1 justify-center hidden 2xl:flex"
                >
                    <BarraDePesquisa pesquisar={pesquisar} />
                </div>

                <ul className="items-center gap-4 hidden lg:flex">
                    <li>
                        <Link href={'/menu/campeonato'} className="flex items-center gap-1 font-heading text-xl truncate px-1 rounded-md duration-300 transition-all xl:text-xl hover:bg-magenta">
                            <FaTrophy />
                            <p className="mt-1" style={{textShadow: '1px 1px 2px black'}}>Competições</p>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/menu/campeonato'} className="flex items-center gap-1 font-heading text-xl truncate px-1 rounded-md duration-300 transition-all xl:text-xl hover:bg-magenta">
                            <MdOutlineScoreboard />
                            <p className="mt-1" style={{textShadow: '1px 1px 2px black'}}>Resultados</p>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/menu/campeonato'} className="flex items-center gap-1 font-heading text-xl truncate px-1 rounded-md duration-300 transition-all xl:text-xl hover:bg-magenta">
                            <FaGear />
                            <p className="mt-1" style={{textShadow: '1px 1px 2px black'}}>Config dos Pro</p>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/menu/campeonato'} className="flex items-center gap-1 font-heading text-xl truncate px-1 rounded-md duration-300 transition-all xl:text-xl hover:bg-magenta">
                            <PiRankingFill />
                            <p className="mt-1" style={{textShadow: '1px 1px 2px black'}}>Rankings</p>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/menu/skins'} className="flex items-center gap-1 font-heading text-xl truncate px-1 rounded-md duration-300 transition-all xl:text-xl hover:bg-magenta">
                            <GiAk47 />
                            <p className="mt-1" style={{textShadow: '1px 1px 2px black'}}>Skins</p>
                        </Link>
                    </li>
                    <li>
                        <Link href={''} className="flex items-center gap-1 font-heading text-xl truncate px-1 rounded-md duration-300 transition-all xl:text-xl hover:bg-magenta">
                            <RiUserCommunityFill />
                            <p className="mt-1" style={{textShadow: '1px 1px 2px black'}}>Comunidade</p>
                        </Link>
                    </li>
                </ul>

            </div>

            <Redes estiloContainerPai="items-center gap-4 hidden xl:flex" />

            <div>
                <SidebarComponent
                    id="menu"
                    icone={<GiHamburgerMenu className="text-3xl" />}
                    visible={visible}
                    setVisible={setVisible}
                    corDeFundo="bg-azul-escuro"
                    fonteTitulo="2.5em"
                    estilo="lg:hidden"
                >
                    <SidebarLateral />
                </SidebarComponent>
            </div>
        </header>
    )
} 