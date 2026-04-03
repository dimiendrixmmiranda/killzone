import Template from "@/src/components/template/Template";
import PartidaIdClient from "./PartidaIdClient";

interface Props {
    params: {
        partidaId: string
    }
}

export default async function Page({ params }: Props) {
    const { partidaId } = await params;
    return (
        <Template>
             <PartidaIdClient partidaId={partidaId}/>
        </Template>
    )
}