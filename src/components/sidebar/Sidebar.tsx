
import { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { GiH2O, GiHamburgerMenu } from 'react-icons/gi';

interface SidebarComponentProps {
    children: React.ReactNode
    icone: React.ReactElement
    visible: string | null
    id: string
    setVisible: (valor: string | null) => void
    botaoPersonalizado?: string
    fontSize?: string
    estiloContainer?: string
    corDeFundo?: string
    fonteTitulo?: string
    estilo?: string
}

export default function SidebarComponent({
    children,
    icone,
    id,
    visible,
    fontSize = '1em',
    botaoPersonalizado,
    estiloContainer,
    corDeFundo,
    fonteTitulo = '1.7em',
    estilo,
    setVisible
}: SidebarComponentProps) {
    const isOpen = visible === id;

    return (
        <div className={`card w-full flex justify-center items-center ${estilo}`}>
            <div className={`flex gap-2 justify-center ${estiloContainer}`}>
                <Button
                    onClick={() => setVisible(isOpen ? null : id)}
                    className={botaoPersonalizado ? (botaoPersonalizado) : (`text-white! bg-transparent! border-transparent!`)}
                    style={{ fontSize: `${fontSize}!important`, padding: '0' }}
                >
                    {icone}
                </Button>
            </div>

            <Sidebar
                header={<h2 className={`capitalize font-heading`}>{id}</h2>}
                visible={isOpen}
                style={{ fontSize: fonteTitulo }}
                position="right"
                onHide={() => setVisible(null)}
                pt={{
                    header: {
                        className: corDeFundo
                    },
                    content: {
                        className: corDeFundo
                    }
                }}
            >
                {children}
            </Sidebar>
        </div>
    );
}