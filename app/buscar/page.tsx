import { Suspense } from "react";
import ResultadoBuscaClient from "./ResultadoBuscaClient";

interface Props {
    searchParams: Promise<{
        q?: string;
    }>;
}

export default async function Page({ searchParams }: Props) {
    const { q } = await searchParams;
    const termo = q ?? "";
    
    return (
        <Suspense fallback={<p>Buscando...</p>}>
            <ResultadoBuscaClient termo={termo} />
        </Suspense>
    );
}