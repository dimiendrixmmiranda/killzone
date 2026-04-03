import PaginaCampeonatoClient from "./PaginaCampeonatoClient";

interface Props {
    params: Promise<{
        ["pagina-campeonato"]: string
    }>
}

export default async function Page({ params }: Props) {
    const pagina = await params;
    const idCampeonato = pagina["pagina-campeonato"]

    return (
        <PaginaCampeonatoClient idCampeonato={idCampeonato}/>
    )
}