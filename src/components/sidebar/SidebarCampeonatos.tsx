'use client'

import { useState } from "react"
import { getAllCampeonatos } from "@/src/services/campeonato.service"
import CardCompeticao from "../cardCompeticao/CardCompeticao"
import Campeonato from "../campeonato/Campeonato"

export default function SidebarCampeonatos() {
    return (
        <Campeonato
            containerCampeonato="flex flex-col gap-4"
            containerMeses="grid grid-cols-2 gap-x-4"
        />
    )
}