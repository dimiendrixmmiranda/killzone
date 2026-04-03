import { noticias } from "../data/news/news.data";
import { Noticia } from "../domain/Noticia";

export function getAllNews(): Noticia[] {
  return noticias;
}

export function getNewsByGame(jogoId: string): Noticia[] {
  return noticias.filter(n => n.jogoId === jogoId);
}

export function getNewsById(id: string): Noticia[] {
  return noticias.filter(n => n.id === id);
}

export function getNewsByPlayer(playerId: string): Noticia[] {
  return noticias.filter(noticia =>
    noticia.jogadoresIds?.includes(playerId)
  )
}
export function getNewsByTerm(term: string): Noticia[] {
  return noticias.filter(noticia =>
    noticia.tags?.map(tag => tag.toLowerCase()).includes(term)
  )
}

export function getNewsByTeam(teamId: string): Noticia[] {
  return noticias.filter(noticia =>
    noticia.timesIds?.includes(teamId)
  )
}

export function getLatestNews(limit = 10): Noticia[] {
  return [...noticias]
    .sort(
      (a, b) =>
        new Date(b.dataPublicacao).getTime() -
        new Date(a.dataPublicacao).getTime()
    )
    .slice(0, limit);
}