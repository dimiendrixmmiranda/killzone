'use client'

import Template from "@/src/components/template/Template"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"
import { Skin } from "@/src/domain/Skin"
import Image from "next/image"
import { Dialog } from 'primereact/dialog';
import { useEffect, useMemo, useState } from "react"
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa"
import { MdDiamond } from "react-icons/md"

function Weapon() {
    const { scene } = useGLTF("/models/ak47/scene.gltf")

    const texture = useLoader(TextureLoader, "/models/ak47/textures/Material__35_baseColor.png")

    scene.traverse((child: any) => {
        if (child.isMesh) {
            child.material.map = texture
            child.material.needsUpdate = true
        }
    })

    return <primitive object={scene} scale={0.01} />
}

interface PaginaSkinsClientProps {
    skins: Skin[]
}

export default function PaginaSkinsClient({ skins }: PaginaSkinsClientProps) {


    const [busca, setBusca] = useState("")
    const [ordem, setOrdem] = useState<'az' | 'za' | 'raridade'>('az')
    const [somenteSouvenir, setSomenteSouvenir] = useState(false)
    const [somenteStattrak, setSomenteStattrak] = useState(false)

    const [categoriaAtiva, setCategoriaAtiva] = useState('knifes')
    const [tipoDeArmaAtiva, setTipoDeArmaAtiva] = useState('Bayonet')
    const [skinAtual, setSkinAtual] = useState<Skin | null>(null)
    const [visible, setVisible] = useState(false);
    const [modelActive, setModelActive] = useState<'imagem' | '3d'>('imagem')

    const [descricaoTraduzida, setDescricaoTraduzida] = useState("");
    const [loadingTraducao, setLoadingTraducao] = useState(false);

    const weaponsByCategory = {
        knifes: [
            "Bayonet",
            "Bowie Knife",
            "Butterfly Knife",
            "Classic Knife",
            "Falchion Knife",
            "Flip Knife",
            "Gut Knife",
            "Huntsman Knife",
            "Karambit",
            "M9 Bayonet",
            "Navaja Knife",
            "Nomad Knife",
            "Paracord Knife",
            "Shadow Daggers",
            "Skeleton Knife",
            "Stiletto Knife",
            "Survival Knife",
            "Talon Knife",
            "Ursus Knife"
        ],

        gloves: [
            "Bloodhound Gloves",
            "Broken Fang Gloves",
            "Driver Gloves",
            "Hand Wraps",
            "Hydra Gloves",
            "Moto Gloves",
            "Specialist Gloves",
            "Sport Gloves"
        ],

        pistols: [
            "Glock-18",
            "USP-S",
            "P2000",
            "Dual Berettas",
            "P250",
            "Tec-9",
            "CZ75-Auto",
            "Desert Eagle",
            "R8 Revolver"
        ],

        smgs: [
            "MAC-10",
            "MP9",
            "MP7",
            "UMP-45",
            "P90",
            "PP-Bizon"
        ],

        heavy: [
            "Nova",
            "XM1014",
            "MAG-7",
            "Sawed-Off",
            "M249",
            "Negev"
        ],

        rifles: [
            "AK-47",
            "M4A4",
            "M4A1-S",
            "FAMAS",
            "Galil AR",
            "SG 553",
            "AUG"
        ]
    }

    useEffect(() => {
        async function traduzir() {
            if (!skinAtual?.description) return;

            setLoadingTraducao(true); // 🔥 começa loading
            setDescricaoTraduzida(""); // limpa anterior

            try {
                const res = await fetch("/api/translate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        text: skinAtual.description,
                    }),
                });

                const data = await res.json();
                setDescricaoTraduzida(data.translatedText);
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingTraducao(false); // 🔥 termina loading
            }
        }

        traduzir();
    }, [skinAtual]);

    const listaDeSkins = Object.entries(weaponsByCategory).map(
        ([categoria, weapons]) => ({
            tipo: categoria,
            armas: weapons.map((weapon) => ({
                nome: weapon,
                skins: skins.filter((skin) => skin.weapon.name === weapon)
            }))
        })
    )

    const categoriaAtual = listaDeSkins.find(
        (c) => c.tipo === categoriaAtiva
    )

    const armaAtual = categoriaAtual?.armas.find(
        (a) => a.nome === tipoDeArmaAtiva
    )


    const skinsFiltradas = useMemo(() => {
        if (!armaAtual) return []

        let lista = [...armaAtual.skins]

        // se tiver busca, procurar em todas as skins
        if (busca) {
            lista = [...skins]
        } else {
            // se não tiver busca usa a arma atual
            if (!armaAtual) return []
            lista = [...armaAtual.skins]
        }

        // busca
        if (busca) {
            lista = lista.filter((skin) =>
                skin.name.toLowerCase().includes(busca.toLowerCase())
            )
        }

        // souvenir
        if (somenteSouvenir) {
            lista = lista.filter((skin) => skin.souvenir)
        }

        // stattrak
        if (somenteStattrak) {
            lista = lista.filter((skin) => skin.stattrak)
        }

        // ordenação
        if (ordem === 'az') {
            lista.sort((a, b) => a.name.localeCompare(b.name))
        }

        if (ordem === 'za') {
            lista.sort((a, b) => b.name.localeCompare(a.name))
        }

        if (ordem === 'raridade') {
            lista.sort((a, b) => a.rarity.name.localeCompare(b.rarity.name))
        }

        return lista
    }, [armaAtual, busca, ordem, somenteSouvenir, somenteStattrak])

    console.log(skinAtual)
    return (
        <Template>
            <div className=" bg-zinc-95 pb-14 min-h-screen md:pb-0 bg-zinc-950">
                <div className="max-w-360 mx-auto p-4 flex flex-col gap-4">
                    <h2 className="capitalize font-heading text-4xl">Confira a lista de Skins de todas as Armas do CS2</h2>
                    <div>
                        <input
                            type="text"
                            placeholder="Buscar Skin ..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            className="bg-zinc-600 w-full p-2 rounded-md h-[40px] max-w-[600px]"
                        />
                    </div>
                    <div className="text-black flex flex-col gap-2">
                        <h3 className="text-white font-heading text-2xl">Categorias</h3>
                        <ul className="flex gap-2 overflow-x-scroll lg:overflow-hidden">
                            {listaDeSkins.map((categoria) => (
                                <li key={categoria.tipo}>
                                    <button
                                        className={`w-30 h-30 flex flex-col justify-center items-center p-2 rounded-md mb-3 text-white cursor-pointer ${categoriaAtiva === categoria.tipo ? "bg-amber-600" : "bg-zinc-700"}`}
                                        onClick={() => {
                                            setCategoriaAtiva(categoria.tipo)
                                            setTipoDeArmaAtiva(categoria.armas[0].nome)
                                        }}
                                        style={{ textShadow: '1px 1px 2px black' }}
                                    >
                                        <div className="relative w-16 h-16">
                                            <Image alt={categoria.tipo} src={`/jogos/cs2/skins/${categoria.tipo}.png`} fill className="object-contain" />
                                        </div>
                                        <h2 className="capitalize font-heading text-2xl">
                                            {categoria.tipo}
                                        </h2>
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="flex">
                            <ul className="mt-4 flex gap-4 overflow-x-scroll lg:overflow-hidden">
                                {categoriaAtual?.armas.map((arma) => (
                                    <li key={arma.nome}>
                                        <button
                                            className={`text-white p-2 flex justify-center items-center truncate rounded-md mb-3 cursor-pointer ${tipoDeArmaAtiva === arma.nome ? "bg-amber-600" : "bg-zinc-600"}`}
                                            onClick={() => setTipoDeArmaAtiva(arma.nome)}
                                            style={{ textShadow: '1px 1px 2px black' }}
                                        >
                                            {arma.nome}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="text-white items-center gap-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5">
                            <button onClick={() => setOrdem('az')} className="flex items-center gap-1 cursor-pointer">
                                <p>A-Z</p>
                                <FaLongArrowAltUp />
                            </button>
                            <button onClick={() => setOrdem('za')} className="flex items-center gap-1 cursor-pointer">
                                <p>Z-A</p>
                                <FaLongArrowAltDown />
                            </button>
                            <button onClick={() => setOrdem('raridade')} className="flex items-center gap-1 cursor-pointer">
                                <p>Raridade</p>
                                <MdDiamond />
                            </button>
                            <div className="flex items-center gap-1">
                                <label htmlFor="souvenir">Souvenir</label>
                                <input
                                    type="checkbox"
                                    checked={somenteSouvenir}
                                    onChange={(e) => setSomenteSouvenir(e.target.checked)}
                                    className="cursor-pointer"
                                />
                            </div>
                            <div className="flex items-center gap-1">
                                <label htmlFor="stattrack">StatTrack</label>
                                <input
                                    type="checkbox"
                                    checked={somenteStattrak}
                                    onChange={(e) => setSomenteStattrak(e.target.checked)}
                                    className="cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
                            {skinsFiltradas.length > 0 ? (
                                skinsFiltradas?.map((skin) => (
                                    <div
                                        key={skin.id}
                                        className="p-4 rounded cursor-pointer"
                                        style={{ backgroundColor: skin.rarity.color }}
                                        onClick={() => {
                                            setVisible(true)
                                            setSkinAtual(skin)
                                        }}
                                    >
                                        <img src={skin.image} alt={skin.name} />
                                        <p className="font-heading text-2xl text-white" style={{ textShadow: '2px 2px 3px black' }}>{skin.name}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="flex justify-center items-center col-start-1 col-end-6">
                                    <h3 className="font-heading text-6xl text-white text-center">Nenhuma Skin Encontrada</h3>
                                </div>
                            )}
                        </div>
                    </div>
                </div>


            </div>
            <Dialog header={<h2>{skinAtual?.name}</h2>} visible={visible} onHide={() => { if (!visible) return; setVisible(false); }} className="w-[95%] max-w-[700px]">
                <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <button className={`pb-1 ${modelActive == 'imagem' ? 'border-b-2 border-amber-600' : ''}`} onClick={() => setModelActive('imagem')}>Imagem</button>
                        <button className={`pb-1 ${modelActive == '3d' ? 'border-b-2 border-amber-600' : ''}`} onClick={() => setModelActive('3d')}>3D</button>
                    </div>
                    {
                        modelActive === 'imagem' ? (
                            <div className="w-full h-[300px] rounded-md" style={{ backgroundColor: skinAtual?.rarity.color }}>
                                <img src={skinAtual?.image} alt={skinAtual?.name} className="w-full h-full object-contain" />
                            </div>
                        ) : (
                            <div className="w-full h-[300px] rounded-md" style={{ backgroundColor: skinAtual?.rarity.color }}>
                                <Canvas camera={{ position: [10, 10, 20], fov: 50 }}>
                                    <ambientLight intensity={0.3} />
                                    <directionalLight position={[5, 5, 5]} intensity={3.5} />
                                    <directionalLight position={[-5, 3, -5]} intensity={1} />
                                    <Weapon />
                                    <OrbitControls />
                                </Canvas>
                            </div>
                        )
                    }
                    <div>
                        <p>Raridade: {skinAtual?.rarity.name}</p>
                    </div>
                    <p>
                        {loadingTraducao
                            ? "Traduzindo... ⏳"
                            : descricaoTraduzida || skinAtual?.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="flex items-center gap-2 bg-orange-600 p-1 rounded-md" style={{ textShadow: '1px 1px 2px black' }}>
                            <p>Souvenir:</p>
                            <span>{skinAtual?.souvenir === true ? "Sim" : 'Não'}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-orange-600 p-1 rounded-md" style={{ textShadow: '1px 1px 2px black' }}>
                            <p>StatTrack:</p>
                            <span>{skinAtual?.stattrak === true ? "Sim" : 'Não'}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-orange-600 p-1 rounded-md" style={{ textShadow: '1px 1px 2px black' }}>
                            <p>Min Float:</p>
                            <span>{skinAtual?.min_float}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-orange-600 p-1 rounded-md" style={{ textShadow: '1px 1px 2px black' }}>
                            <p>Max Float:</p>
                            <span>{skinAtual?.max_float}</span>
                        </div>
                    </div>
                    {
                        skinAtual?.collections && skinAtual.collections.length > 0 ? (
                            <div className="flex flex-col gap-2">
                                <h3 className="font-heading text-2xl">Coleções</h3>
                                <ul className="grid grid-cols-2 md:grid-cols-3">
                                    {
                                        skinAtual?.collections.map((col) => {
                                            return (
                                                <li key={col.id} className="flex flex-col gap-2 justify-center items-center">
                                                    <div className="relative w-28 h-28">
                                                        <img src={col.image} alt={col.name} className="object-cover w-full h-full" />
                                                    </div>
                                                    <h4 className="font-heading text-xl text-center">{col.name}</h4>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        ) : ('')
                    }
                </div>
            </Dialog>
        </Template>
    )
}