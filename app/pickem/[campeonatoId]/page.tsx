import PickemClient from "./PickemClient";

interface Props {
    params: {
        campeonatoId: string
    }
}
// pagina principal
export default async function Page({ params }: Props) {
    const { campeonatoId } = await params;

    return (
        <PickemClient idCampeonato={campeonatoId} />
    )
}