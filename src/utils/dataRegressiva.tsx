import { useEffect, useState } from "react";

function getDataRegressiva(endDate: string | Date, frase: string) {
    const end = new Date(endDate).getTime();
    const now = Date.now();

    if (isNaN(end)) return "Data inválida";

    const total = end - now;

    if (total <= 0) return "Tempo encerrado";

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return `Faltam ${days} dias ${hours} horas ${minutes} min e ${seconds}s ${frase}`;
}

interface CountdownProps{
    endDate: string | Date
    frase: string
}

export function Countdown({endDate, frase}: CountdownProps) {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            setTime(getDataRegressiva(endDate, frase));
        };

        updateTime(); // atualiza na primeira render

        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval); // limpa o intervalo
    }, [endDate]);

    return <span className="font-heading text-2xl">{time}</span>;
}