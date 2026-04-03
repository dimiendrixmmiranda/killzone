import User from "./User"

export default interface InterfaceComentario{
    content: string
    createdAt: string
    id: string
    newsId: string
    user: User
    userId: string
}