import { IMAGEM_JOGADOR_DEFAULT } from "@/src/assets/imagens"
import InterfaceComentario from "@/src/domain/Comentario"
import Image from "next/image"
import Link from "next/link"
import { BiDislike, BiLike } from "react-icons/bi"
import { BsExclamationOctagon } from "react-icons/bs"
import { MdOutlineMessage } from "react-icons/md"

interface ComentarioProps {
    comentario: InterfaceComentario
    linkNoticia?: string
}

export default function Comentario({ comentario, linkNoticia }: ComentarioProps) {
    if (linkNoticia) {
        return (
            <li key={comentario.id} className="max-w-125 mx-auto">
                <Link href={linkNoticia} className="flex flex-col gap-2 border border-azul-escuro p-2 rounded-md xl:p-4">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-red-500 relative rounded-full overflow-hidden">
                            <Image alt={`Foto do Usuario`} src={comentario.user.image || IMAGEM_JOGADOR_DEFAULT} fill className="object-cover" />
                        </div>
                        <h2 className="text-2xl leading-6 mb-1 font-semibold">{comentario.user.nickname}</h2>
                        <div className="text-sm truncate ml-auto">
                            {new Date(comentario.createdAt).toLocaleDateString('pt-BR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                            {" ás "}
                            {new Date(comentario.createdAt).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    </div>
                    <div>
                        <p>
                            {comentario.content}
                        </p>
                    </div>
                    <div className="grid grid-cols-4">
                        <button className="cursor-pointer justify-self-center flex items-center justify-center py-1 rounded-md gap-1 w-full max-w-37.5">
                            <BiLike />
                            <p className="hidden md:flex">Like</p>
                        </button>
                        <button className="cursor-pointer justify-self-center flex items-center justify-center py-1 rounded-md gap-1 w-full max-w-37.5">
                            <BiDislike />
                            <p className="hidden md:flex">Deslike</p>
                        </button>
                        <button className="cursor-pointer justify-self-center flex items-center justify-center py-1 rounded-md gap-1 w-full max-w-37.5">
                            <MdOutlineMessage />
                            <p className="hidden md:flex">Responder</p>
                        </button>
                        <button className="cursor-pointer justify-self-center flex items-center justify-center py-1 rounded-md gap-1 w-full max-w-37.5">
                            <BsExclamationOctagon />
                            <p className="hidden md:flex">Denunciar</p>
                        </button>
                    </div>
                </Link>
            </li>
        )
    }
    return (
        <li key={comentario.id} className="flex flex-col gap-2 border border-azul-escuro p-2 rounded-md bg-zinc-200 text-black xl:p-4">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-red-500 relative rounded-full overflow-hidden">
                    <Image alt={"Imagem do Usuário"} src={comentario.user.image || IMAGEM_JOGADOR_DEFAULT} fill className="object-cover" />
                </div>
                <h2 className="text-2xl leading-6 mb-1 font-semibold">{comentario.user.nickname}</h2>
                <div className="text-sm truncate ml-auto">
                    {new Date(comentario.createdAt).toLocaleDateString('pt-BR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })}
                    {" ás "}
                    {new Date(comentario.createdAt).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            </div>
            <div>
                <p>
                    {comentario.content}
                </p>
            </div>
            <div className="grid grid-cols-4">
                <button className="cursor-pointer justify-self-center flex items-center justify-center py-1 rounded-md gap-1 w-full max-w-37.5">
                    <BiLike />
                    <p className="hidden md:flex">Like</p>
                </button>
                <button className="cursor-pointer justify-self-center flex items-center justify-center py-1 rounded-md gap-1 w-full max-w-37.5">
                    <BiDislike />
                    <p className="hidden md:flex">Deslike</p>
                </button>
                <button className="cursor-pointer justify-self-center flex items-center justify-center py-1 rounded-md gap-1 w-full max-w-37.5">
                    <MdOutlineMessage />
                    <p className="hidden md:flex">Responder</p>
                </button>
                <button className="cursor-pointer justify-self-center flex items-center justify-center py-1 rounded-md gap-1 w-full max-w-37.5">
                    <BsExclamationOctagon />
                    <p className="hidden md:flex">Denunciar</p>
                </button>
            </div>
        </li>
    )
}