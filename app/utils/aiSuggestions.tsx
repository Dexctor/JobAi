export async function getAIGeneratedContent(field: string, content: string): Promise<string> {
  try {
    const response = await fetch('/api/ai-suggestions/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ field, content }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Erreur réseau (${response.status}): ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    return data.generatedContent || "Impossible de générer le contenu pour le moment.";
  } catch (error) {
    console.error('Erreur lors de la génération du contenu :', error);
    if (error instanceof Error) {
      return `Désolé, une erreur s'est produite lors de la génération du contenu : ${error.message}`;
    } else {
      return "Désolé, une erreur inconnue s'est produite lors de la génération du contenu.";
    }
  }
}