export interface Skin {
    id: string
    name: string
    description: string
    image: string

    category: Category
    weapon: Weapon
    weapon_id: number
    team: Team

    rarity: Rarity
    pattern: Pattern

    min_float: number
    max_float: number

    stattrak: boolean
    souvenir: boolean
    legacy_model: boolean

    paint_index: string

    crates: Crate[]
    collections: any[]

    wears: Wear[]

    original: Original
}

export interface Category {
    id: string
    name: string
}
export interface Weapon {
    id: string
    name: string
}
export interface Team {
    id: string
    name: string
}
export interface Rarity {
    id: string
    name: string
    color: string
}
export interface Pattern {
    id: string
    name: string
}
export interface Crate {
    id: string
    name: string
    image: string
}
export interface Wear {
    id: string
    name: string
}
export interface Original {
    name: string
}
