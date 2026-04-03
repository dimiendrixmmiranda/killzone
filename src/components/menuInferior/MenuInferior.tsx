'use client'
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { FaShieldHeart, FaTrophy } from "react-icons/fa6";
import { GoVideo } from "react-icons/go";
import { IoCalendar } from "react-icons/io5";
import SidebarComponent from "../sidebar/Sidebar";
import { useState } from "react";
import SidebarSeletorDeTime from "../sidebar/SidebarSeletorTime";
import SidebarPartidas from "../sidebar/SidebarPartidas";
import SidebarVideos from "../sidebar/SidebarVideos";
import SidebarCampeonatos from "../sidebar/SidebarCampeonatos";

export default function MenuInferior() {
    const [visible, setVisible] = useState<string | null>(null);
    return (
        <section className="fixed bottom-0 left-0 w-full bg-azul-escuro z-30 border-t-2 border-azul md:hidden">
            <div className="relative grid grid-cols-5 items-center text-white text-2xl">

                <Link href={'/'} className="flex justify-center items-center py-3">
                    <FaHome />
                </Link>

                <SidebarComponent
                    id="Selecione Sua Org do Coração"
                    icone={<FaShieldHeart />}
                    visible={visible}
                    setVisible={setVisible}
                    corDeFundo="bg-azul-escuro"
                >
                    <SidebarSeletorDeTime />
                </SidebarComponent>

                <SidebarComponent
                    id="videos"
                    icone={<GoVideo className="text-3xl" />}
                    visible={visible}
                    setVisible={setVisible}
                    corDeFundo="bg-azul-escuro"
                    botaoPersonalizado="
                        absolute
                        -top-6
                        flex
                        w-[60px]!
                        h-[60px]!
                        justify-center
                        items-center
                        rounded-t-full
                        bg-azul
                        rounded-full
                        bg-red-500
                        z-20
                        text-white!
                        bg-azul! border-transparent!
                        rounded-full!
                        "
                    estiloContainer="bg-azul w-[60px] h-[45px]"
                >
                    <SidebarVideos />
                </SidebarComponent>

                <SidebarComponent
                    id="partidas"
                    icone={<IoCalendar />}
                    visible={visible}
                    setVisible={setVisible}
                >
                    <SidebarPartidas />
                </SidebarComponent>

                <SidebarComponent
                    id="campeonatos"
                    icone={<FaTrophy />}
                    visible={visible}
                    setVisible={setVisible}
                    corDeFundo="bg-azul-escuro"
                >
                    <SidebarCampeonatos />
                </SidebarComponent>
            </div>

        </section>
    );
}