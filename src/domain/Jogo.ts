export interface Jogo {
  id: string;
  nome: string;
  sigla: string;
  genero: "MOBA" | "FPS" | "RTS";
  desenvolvedora: string;
  anoLancamento: number;
  imagem: string
}
