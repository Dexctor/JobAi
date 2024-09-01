import { NextResponse } from 'next/server'

// Stockage temporaire en mémoire
let resumes: any[] = []

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const id = data.id || Date.now().toString() // Utilise l'ID existant ou en génère un nouveau
    const newResume = { id, ...data }
    const index = resumes.findIndex(r => r.id === id)
    if (index !== -1) {
      resumes[index] = newResume // Met à jour le CV existant
    } else {
      resumes.push(newResume) // Ajoute un nouveau CV
    }
    return NextResponse.json(newResume)
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du CV:', error)
    return NextResponse.json({ error: "Une erreur s'est produite lors de la sauvegarde du CV." }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  
  if (id) {
    const resume = resumes.find(r => r.id === id)
    if (resume) {
      return NextResponse.json(resume)
    } else {
      return NextResponse.json({ error: "CV non trouvé" }, { status: 404 })
    }
  }
  
  return NextResponse.json(resumes)
}