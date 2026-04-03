import { Noticia } from "@/src/domain/Noticia";
import { Jogador } from "@/src/domain/Jogador";

export const filtrarNoticiasPorJogador = (
    noticias: Noticia[],
    jogador: Jogador
): Noticia[] => {
    const termosJogador = [
        jogador.nome,
        jogador.apelido
    ]
        .filter(Boolean)
        .map(t => t.toLowerCase());

    return noticias.filter(noticia => {
        const textoNoticia = `
            ${noticia.titulo.toLowerCase()}
            ${noticia.resumo.toLowerCase() ?? ""}
            ${noticia.conteudo?.join(' ').toLowerCase()}
        `.toLowerCase();

        return termosJogador.some(termo =>
            textoNoticia.includes(termo)
        );
    });
};