'use client'
import Campeonato from "@/src/components/campeonato/Campeonato";
import Template from "@/src/components/template/Template";

export default function Page() {
    return (
        <Template>
            <div className="bg-zinc-900 p-4 lg:p-8">
                <div className="text-black min-h-screen max-w-360 mx-auto flex flex-col gap-4">
                    <h2 className="font-heading text-4xl text-white" style={{ textShadow: '1px 1px 2px black' }}>Lista de Campeonatos</h2>
                    <Campeonato
                        containerCampeonato="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
                        containerMeses="grid grid-cols-2 gap-2 text-white sm:grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-13"
                    />
                </div>
            </div>
        </Template>
    )
}