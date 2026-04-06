import MenuInferior from "../menuInferior/MenuInferior";
import Footer from "./footer/Footer";
import Header from "./header/Header";

interface TemplateProps {
    children: React.ReactNode
}

export default function Template({ children }: TemplateProps) {
    return (
        <>
            <Header />
            <main className="font-main bg-zinc-200 min-h-screen">
                {children}
            </main>
            <Footer />
            <MenuInferior />
        </>
    )
}