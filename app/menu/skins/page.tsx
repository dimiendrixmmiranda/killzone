import { getSkins } from "@/src/services/skins.service"
import PaginaSkinsClient from "./PaginaSkinsClient"

export default async function Page() {
    const skins = await getSkins()
    return (
        <PaginaSkinsClient skins={skins} />
    )
}