'use client'

import { useState } from "react";

interface BarraDePesquisaProps {
    pesquisar: (termo: string) => void
}

export default function BarraDePesquisa({ pesquisar }: BarraDePesquisaProps) {
    const [valor, setValor] = useState('')
    
    return (
        <div className="flex items-center gap-2 bg-zinc-900 px-3 py-2 rounded-xl w-full text-base">
            <input
                type="text"
                placeholder="Buscar times, jogadores ou notícias..."
                value={valor}
                onChange={(e) => {
                    const v = e.target.value;
                    setValor(v);
                    pesquisar(v);
                }}
                className="bg-transparent outline-none text-white w-full placeholder-zinc-500"
            />
        </div>
    )
}