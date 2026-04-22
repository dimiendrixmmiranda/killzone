'use client'
import Campeonato from "../campeonato/Campeonato"

export default function SidebarCampeonatos() {
    return (
        <Campeonato
            containerCampeonato="flex flex-col gap-4"
            containerMeses="grid grid-cols-2 gap-x-4"
        />
    )
}