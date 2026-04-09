import Link from "next/link";
import Redes from "../../redes/Redes";

export default function Footer() {
    return (
        <footer className="p-4 w-full bg-azul-escuro pb-20 md:pb-4 md:p-8">
            <div className="flex flex-col gap-6 max-w-[1000px] w-full mx-auto md:grid md:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col gap-2 md:col-start-1 md:col-end-3 lg:col-end-2">
                    <h2 className="font-heading text-3xl text-center">Contato</h2>
                    <Redes estiloContainerPai="gap-4 grid grid-cols-5" />
                    <span className="text-sm text-center">Todos os horários aparecem no fuso-horário: BRT</span>
                </div>
                <div>
                    <h2 className="font-heading text-3xl">Sobre a Killzone</h2>
                    <ul>
                        <li>
                            <Link href={'/'}>
                                <span>
                                    Termos
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href={'/'}>
                                <span>
                                    Política de privacidade
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href={'/'}>
                                <span>
                                    Avisos Importantes
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href={'/'}>
                                <span>
                                    Configuração de Cookies
                                </span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h2 className="font-heading text-3xl">Contato</h2>
                    <ul>
                        <li>
                            <Link href={'/'}>
                                <span>
                                    Imprensa
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href={'/'}>
                                <span>
                                    Pauta
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href={'/'}>
                                <span>
                                    Contato
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href={'/'}>
                                <span>
                                    Comercial
                                </span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}