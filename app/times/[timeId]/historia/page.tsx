import { Time } from "@/src/domain/Time";
import Template from "@/src/components/template/Template";
import { Jogador } from "@/src/domain/Jogador";
import { Jogo } from "@/src/domain/Jogo";

interface Props { params: Promise<{ timeId: string }> }

export default async function HistoriaTime({ params }: Props) {
    const { timeId } = await params
    const [timesRes, jogadoresRes, noticiasRes, jogosRes] = await Promise.all([
        fetch("http://localhost:3000/api/times"),
        fetch("http://localhost:3000/api/jogadores"),
        fetch("http://localhost:3000/api/noticias"),
        fetch("http://localhost:3000/api/jogos"),
    ])
    const times: Time[] = await timesRes.json()
    const jogadores: Jogador[] = await jogadoresRes.json()
    const jogos: Jogo[] = await jogosRes.json()

    return (
        <Template>
            <div>
                aqui
            </div>
            {/* <HistoriaTimeClient times={times} timeId={timeId} jogadores={jogadores} jogos={jogos} /> */}
        </Template>
    );
}
