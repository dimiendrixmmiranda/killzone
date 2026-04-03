import Link from "next/link";

interface BannerPickemProps {
    idCampeonato: string
}

export default function BannerPickem({ idCampeonato }: BannerPickemProps) {
    return (
        <div className="flex w-full text-white rounded-lg overflow-hidden">
            <Link
                href={`/pickem/${idCampeonato}`}
                className="
                    bg-zinc-900 w-full p-4 block
                    bg-[url('/default/pickem.png')]
                    bg-cover bg-center
                    h-56
                    relative
                    sm:h-72
                    md:h-[350px]
                    lg:bg-no-repeat
                    lg:bg-[center_top_25%]
                "
            >
                <h3 className="font-heading text-3xl w-full text-center absolute bottom-0 leading-12 pt-1 w-full flex justify-center items-center left-[50%] bg-zinc-950 md:text-4xl md:max-w-full" style={{ transform: 'translate(-50%\)', textShadow: '2px 2px 3px black' }}>Pick'em Disponível</h3>
            </Link>
        </div>
    )
}