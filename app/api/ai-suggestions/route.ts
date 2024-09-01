import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiApiKey) {
    console.error("La clé API OpenAI n'est pas définie");
    return NextResponse.json({ error: "Configuration de l'API manquante" }, { status: 500 });
  }

  const openai = new OpenAI({ apiKey: openaiApiKey });

  try {
    const { field, content } = await req.json();

    const prompt = `Générez une section "${field}" pour un CV professionnel basé sur les informations suivantes :

"${content}"

Assurez-vous d'utiliser un langage impactant, d'inclure des détails pertinents, et de structurer le contenu de manière claire et professionnelle.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 250,
      temperature: 0.7,
    });

    return NextResponse.json({ generatedContent: response.choices[0].message.content });
  } catch (error) {
    console.error('Erreur lors de la génération du contenu :', error);
    return NextResponse.json({ error: "Une erreur s'est produite lors de la génération du contenu." }, { status: 500 });
  }
}