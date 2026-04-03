export default interface User{
    createdAt: string
    email: string
    id: string
    image: string | null
    name: string,
    nickname: string
    phone: string
    githubId?: string
    password?: string
}