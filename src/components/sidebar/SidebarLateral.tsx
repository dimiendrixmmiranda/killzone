import { useEffect, useState } from "react";
import BarraDePesquisa from "../barraDePesquisa/BarraDePesquisa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaTrophy, FaUserCircle } from "react-icons/fa";
import { MdOutlineScoreboard } from "react-icons/md";
import { FaGear } from "react-icons/fa6";
import { PiRankingFill } from "react-icons/pi";
import Redes from "../redes/Redes";
import { GiAk47 } from "react-icons/gi";
import { RiUserCommunityFill } from "react-icons/ri";
import { useSession } from "next-auth/react";

export default function SidebarLateral() {
    const router = useRouter();

    const [termo, setTermo] = useState('');

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


    function pesquisar(valor: string) {
        setTermo(valor);
    }

    function confirmarBusca() {
        if (!termo.trim()) return;
        router.push(`/buscar?q=${encodeURIComponent(termo)}`);
    }

    return (
        <div className="flex flex-col gap-4 w-full h-full">
            <div className="flex">
                {
                    user ? (
                        <div>
                            <Link href={`/menu/usuario`} className="flex items-center gap-2 font-heading text-xl truncate xl:text-xl">
                                <img
                                    src={user.image || "/camp.png"}
                                    className="w-10 h-10 rounded-full object-cover bg-zinc-900"
                                />
                                <p className="text-4xl mt-2 font-normal">Bem vindo <b>{user.nickname}</b></p>
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <Link href={`/menu/login`} className="flex items-center gap-1 font-heading text-xl truncate xl:text-xl">
                                <FaUserCircle />
                                <p className="mt-1">Entrar</p>
                            </Link>
                        </div>
                    )
                }
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="font-heading text-2xl leading-7">Faça uma busca ...</h3>
                <div
                    onKeyDown={(e) => e.key === 'Enter' && confirmarBusca()}
                    className="flex-1 justify-center"
                >
                    <BarraDePesquisa pesquisar={pesquisar} />
                </div>
            </div>

            <div>
                <ul className="gap-4 flex flex-col justify-center">
                    <li>
                        <Link href={'/menu/campeonato'} className="flex items-center gap-1 font-heading text-xl truncate xl:text-xl">
                            <FaTrophy />
                            <p className="mt-1">Competições</p>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/menu/campeonato'} className="flex items-center gap-1 font-heading text-xl truncate xl:text-xl">
                            <MdOutlineScoreboard />
                            <p className="mt-1">Resultados</p>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/menu/campeonato'} className="flex items-center gap-1 font-heading text-xl truncate xl:text-xl">
                            <FaGear />
                            <p className="mt-1">Config dos Pro</p>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/menu/campeonato'} className="flex items-center gap-1 font-heading text-xl truncate xl:text-xl">
                            <PiRankingFill />
                            <p className="mt-1">Rankings</p>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/menu/skins'} className="flex items-center gap-1 font-heading text-xl truncate xl:text-xl">
                            <GiAk47 />
                            <p className="mt-1">Skins</p>
                        </Link>
                    </li>
                    <li>
                        <Link href={''} className="flex items-center gap-1 font-heading text-xl truncate xl:text-xl">
                            <RiUserCommunityFill />
                            <p className="mt-1">Comunidade</p>
                        </Link>
                    </li>
                </ul>
            </div>

            <Redes estiloContainerPai="grid grid-cols-5 mt-auto" />
        </div>
    )
}