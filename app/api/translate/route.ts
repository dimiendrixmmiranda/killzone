import translate from "google-translate-api-next";

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return Response.json({ translatedText: "" });
        }

        const res = await translate(text, { to: "pt" });

        return Response.json({
            translatedText: res.text,
        });
    } catch (error) {
        console.error(error);

        return Response.json({
            translatedText: "erro ao traduzir",
        });
    }
}