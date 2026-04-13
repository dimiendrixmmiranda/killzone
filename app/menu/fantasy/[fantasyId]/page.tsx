import FantasyClient from "./FantasyClient";

interface Props {
    params: {
        fantasyId: string
    }
}

export default async function Page({ params }: Props) {
    const { fantasyId } = await params;

    return (
        <FantasyClient idCampeonato={fantasyId} />
    )
}