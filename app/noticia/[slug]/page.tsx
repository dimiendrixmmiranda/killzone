import PaginaNoticia from "./PaginaNoticiaClient";

interface Props {
    params: {
        slug: string
    }
}
// pagina principal
export default async function Page({ params }: Props) {
    const { slug } = await params;

    return (
        <PaginaNoticia slug={slug}/>
    )
}