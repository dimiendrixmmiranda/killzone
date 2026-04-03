import { players } from "../data/players/players.data";
import { EstatisticaJogadorAcumulado } from "../domain/EstatisticasDoJogadorAcumulado";
import { Jogador } from "../domain/Jogador";
import { EstatisticasJogadores, Mapa, Partida } from "../domain/Partida";

export function getAllPlayers(): Jogador[] {
	return players;
}

export function getPlayerById(id: string): Jogador | null {
	return players.find(player => player.id.toLowerCase() === id) ?? null;
}

export function getPlayersByTeam(teamId: string): Jogador[] {
	return players.filter(player => player.timeAtual === teamId);
}

export function getPlayerRounds(
	partidas: Partida[],
	jogadorId: string
) {
	return partidas.reduce((total, partida) => {
		const roundsPartida =
			partida.mapas?.reduce((acc, mapa) => {
				if (!mapa.resultado || !mapa.estatisticasJogadores) return acc

				const jogou = mapa.estatisticasJogadores.some(
					j => j.jogadorId === jogadorId
				)

				if (!jogou) return acc

				const roundsMapa =
					mapa.resultado.timeA.total + mapa.resultado.timeB.total

				return acc + roundsMapa
			}, 0) ?? 0

		return total + roundsPartida
	}, 0)
}

export function getJogadorMaiorADR(partida: Partida): EstatisticaJogadorAcumulado | null {

	if (!partida.mapas) return null

	const adrJogadores: Record<
		string,
		{ totalAdr: number; mapas: number; stats: EstatisticasJogadores }
	> = {}

	partida.mapas.forEach((mapa: Mapa) => {
		if (!mapa.estatisticasJogadores) return

		mapa.estatisticasJogadores.forEach((j: EstatisticasJogadores) => {

			if (!adrJogadores[j.jogadorId]) {
				adrJogadores[j.jogadorId] = {
					stats: { ...j, adr: 0 },
					totalAdr: 0,
					mapas: 0
				}
			}

			adrJogadores[j.jogadorId].totalAdr += j.adr
			adrJogadores[j.jogadorId].mapas++
		})
	})

	let melhor: EstatisticasJogadores | null = null
	let maiorAdr = 0

	Object.values(adrJogadores).forEach(j => {
		const media = j.totalAdr / j.mapas

		if (media > maiorAdr) {
			maiorAdr = media
			melhor = {
				...j.stats,
				adr: Number(media.toFixed(1))
			}
		}
	})

	return melhor
}

export function getJogadorMaisKills(partida: Partida): EstatisticaJogadorAcumulado | null {

	if (!partida.mapas) return null

	const killsJogadores: Record<string, EstatisticasJogadores> = {}

	partida.mapas.forEach((mapa) => {
		if (!mapa.estatisticasJogadores) return

		mapa.estatisticasJogadores.forEach((jogador) => {

			if (!killsJogadores[jogador.jogadorId]) {
				killsJogadores[jogador.jogadorId] = {
					...jogador,
					kills: 0
				}
			}

			killsJogadores[jogador.jogadorId].kills += jogador.kills
		})
	})

	let melhor: EstatisticasJogadores | null = null
	let maiorKills = 0

	Object.values(killsJogadores).forEach((jogador) => {
		if (jogador.kills > maiorKills) {
			maiorKills = jogador.kills
			melhor = jogador
		}
	})

	return melhor
}

export function getJogadorMaisAssists(partida: Partida): EstatisticaJogadorAcumulado | null {

	if (!partida.mapas) return null

	const assistsJogadores: Record<string, EstatisticasJogadores> = {}

	partida.mapas.forEach((mapa) => {
		if (!mapa.estatisticasJogadores) return

		mapa.estatisticasJogadores.forEach((jogador) => {

			if (!assistsJogadores[jogador.jogadorId]) {
				assistsJogadores[jogador.jogadorId] = {
					...jogador,
					assists: 0
				}
			}

			assistsJogadores[jogador.jogadorId].assists += jogador.assists
		})
	})

	let melhor: EstatisticasJogadores | null = null
	let maiorAssists = 0

	Object.values(assistsJogadores).forEach((jogador) => {
		if (jogador.assists > maiorAssists) {
			maiorAssists = jogador.assists
			melhor = jogador
		}
	})

	return melhor
}

export function getJogadorMaiorRating(partida: Partida): EstatisticaJogadorAcumulado | null {

	if (!partida.mapas) return null

	const ratingJogadores: Record<
		string,
		{ totalRating: number; mapas: number; stats: EstatisticasJogadores }
	> = {}

	partida.mapas.forEach((mapa: Mapa) => {
		if (!mapa.estatisticasJogadores) return

		mapa.estatisticasJogadores.forEach((j: EstatisticasJogadores) => {

			if (j.rating === undefined) return

			if (!ratingJogadores[j.jogadorId]) {
				ratingJogadores[j.jogadorId] = {
					stats: { ...j, rating: 0 },
					totalRating: 0,
					mapas: 0
				}
			}

			ratingJogadores[j.jogadorId].totalRating += j.rating
			ratingJogadores[j.jogadorId].mapas++
		})
	})

	let melhor: EstatisticasJogadores | null = null
	let maiorRating = 0

	Object.values(ratingJogadores).forEach(j => {
		const media = j.totalRating / j.mapas

		if (media > maiorRating) {
			maiorRating = media
			melhor = {
				...j.stats,
				rating: Number(media.toFixed(2))
			}
		}
	})

	return melhor
}

export function getJogadorPiorRating(partida: Partida): EstatisticaJogadorAcumulado | null {

	if (!partida.mapas) return null

	const ratingJogadores: Record<
		string,
		{ totalRating: number; mapas: number; stats: EstatisticasJogadores }
	> = {}

	partida.mapas.forEach((mapa: Mapa) => {
		if (!mapa.estatisticasJogadores) return

		mapa.estatisticasJogadores.forEach((j: EstatisticasJogadores) => {

			if (j.rating === undefined) return

			if (!ratingJogadores[j.jogadorId]) {
				ratingJogadores[j.jogadorId] = {
					stats: { ...j, rating: 0 },
					totalRating: 0,
					mapas: 0
				}
			}

			ratingJogadores[j.jogadorId].totalRating += j.rating
			ratingJogadores[j.jogadorId].mapas++
		})
	})

	let pior: EstatisticasJogadores | null = null
	let menorRating = Infinity

	Object.values(ratingJogadores).forEach(j => {
		const media = j.totalRating / j.mapas

		if (media < menorRating) {
			menorRating = media
			pior = {
				...j.stats,
				rating: Number(media.toFixed(2))
			}
		}
	})

	return pior
}