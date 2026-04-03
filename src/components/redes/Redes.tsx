import Link from "next/link";
import { AiFillTikTok } from "react-icons/ai";
import { FaFacebook, FaInstagramSquare, FaTwitter } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

interface Redes {
    estiloContainerPai: string
}

export default function Redes({ estiloContainerPai }: Redes) {
    return (
        <ul className={estiloContainerPai}>
            <li className="text-2xl">
                <Link href={'/'} className="flex justify-center items-center">
                    <FaFacebook />
                </Link>
            </li>
            <li className="text-2xl">
                <Link href={'/'} className="flex justify-center items-center">
                    <FaInstagramSquare />
                </Link>
            </li>
            <li className="text-2xl">
                <Link href={'/'} className="flex justify-center items-center">
                    <AiFillTikTok />
                </Link>
            </li>
            <li className="text-2xl">
                <Link href={'/'} className="flex justify-center items-center">
                    <FaTwitter />
                </Link>
            </li>
            <li className="text-2xl">
                <Link href={'/'} className="flex justify-center items-center">
                    <MdEmail />
                </Link>
            </li>
        </ul>
    )
}