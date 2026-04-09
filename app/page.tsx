import CarrosselMobile from "@/src/components/carrossel/carrosselMobile/CarrosselMobile";
import CarrosselWeb from "@/src/components/carrossel/carrosselWeb/CarrosselWeb";
import CraqueDaSemana from "@/src/components/craqueDaSemana/CraqueDaSemana";
import MenuInferior from "@/src/components/menuInferior/MenuInferior";
import Noticias from "@/src/components/noticias/Noticias";
import ProximosJogos from "@/src/components/proximosJogos/ProximosJogos";
import RankingDaComunidade from "@/src/components/rankingDaComunidade/RankingDaComunidade";
import SeletorDeTimes from "@/src/components/seletorDeTimes/SeletorDeTimes";
import Template from "@/src/components/template/Template";
import Transferencia from "@/src/components/transferencia/Transferencia";
import Videos from "@/src/components/videos/Videos";

export default async function Home() {
	return (
		<Template>
			<div className="max-w-360 mx-auto p-2 pb-6 md:pb-2 lg:p-4">
				<CarrosselMobile />
				<CarrosselWeb />
				<SeletorDeTimes />
				<div className="xl:grid xl:grid-cols-[1fr_400px] xl:gap-6">
					<Noticias />
					<div className="w-full h-full flex flex-col gap-4 mt-6 md:grid md:grid-cols-2 lg:grid-cols-3 xl:flex xl:flex-col">
						<Transferencia />
						<ProximosJogos />
					</div>
				</div>
				<CraqueDaSemana />
				<RankingDaComunidade />
				<Videos />
			</div>
		</Template>
	)
}
