import { Time } from "@/src/domain/Time";

export function obterTimePorId(
    times: Time[],
    timeId: string
): Time | undefined {
    return times.find(time => time.id === timeId);
}
