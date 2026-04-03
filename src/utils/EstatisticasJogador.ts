import EstatisticasGeraisJogador from "../domain/EstatiticasGeraisJogador"

export function calcularWinRate(e: EstatisticasGeraisJogador): number {
  if (e.partidas === 0) return 0
  return (e.vitoria / e.partidas) * 100
}

export function calcularLossRate(e: EstatisticasGeraisJogador): number {
  if (e.partidas === 0) return 0
  return (e.derrotas / e.partidas) * 100
}

export function calcularMvpPorVitoria(e: EstatisticasGeraisJogador): number {
  if (e.vitoria === 0) return 0
  return e.mvps / e.vitoria
}

export function calcularImpacto(e: EstatisticasGeraisJogador): number {
  if (e.partidas === 0) return 0;

  const pesoVitoria = 1;
  const pesoMvp = 2;
  const pesoTitulo = 5;

  const score =
    e.vitoria * pesoVitoria +
    e.mvps * pesoMvp +
    e.titulos * pesoTitulo;

  return score / e.partidas;
}

export function calcularConsistencia(e: EstatisticasGeraisJogador): number {
  if (e.partidas === 0) return 0;

  return e.vitoria / e.partidas;
}

export function calcularParticipacaoEmVitorias(
  e: EstatisticasGeraisJogador
): number {
  if (e.vitoria === 0) return 0;

  return e.mvps / e.vitoria;
}
