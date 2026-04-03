import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function POST(req: Request): Promise<Response> {
    const formData = await req.formData()
    const file = formData.get("file") as File

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    return new Promise<Response>((resolve) => {
        cloudinary.uploader.upload_stream({}, (error, result) => {
            if (error) {
                resolve(Response.json({ error }, { status: 500 }))
                return
            }

            resolve(Response.json({ url: result?.secure_url }))
        }).end(buffer)
    })
}