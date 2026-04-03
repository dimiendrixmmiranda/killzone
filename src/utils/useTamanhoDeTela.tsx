import { useEffect, useState } from "react"

type Breakpoints = {
    isSm: boolean
    isMd: boolean
    isLg: boolean
    isXl: boolean
    is2xl: boolean
}

const queries = {
    sm: "(min-width: 640px)",
    md: "(min-width: 768px)",
    lg: "(min-width: 1024px)",
    xl: "(min-width: 1280px)",
    "2xl": "(min-width: 1536px)",
}

export function useBreakpoints(): Breakpoints {
    const [matches, setMatches] = useState<Breakpoints>({
        isSm: false,
        isMd: false,
        isLg: false,
        isXl: false,
        is2xl: false,
    })

    useEffect(() => {
        const mediaQueries = {
            sm: window.matchMedia(queries.sm),
            md: window.matchMedia(queries.md),
            lg: window.matchMedia(queries.lg),
            xl: window.matchMedia(queries.xl),
            "2xl": window.matchMedia(queries["2xl"]),
        }

        const update = () => {
            setMatches({
                isSm: mediaQueries.sm.matches,
                isMd: mediaQueries.md.matches,
                isLg: mediaQueries.lg.matches,
                isXl: mediaQueries.xl.matches,
                is2xl: mediaQueries["2xl"].matches,
            })
        }

        update()

        Object.values(mediaQueries).forEach(mq =>
            mq.addEventListener("change", update)
        )

        return () => {
            Object.values(mediaQueries).forEach(mq =>
                mq.removeEventListener("change", update)
            )
        }
    }, [])

    return matches
}