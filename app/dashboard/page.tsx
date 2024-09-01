'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CVData } from '../cv-builder/page'
import { useSession, signIn } from 'next-auth/react'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [resumes, setResumes] = useState<CVData[]>([])
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn()
    }
  }, [status])

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await fetch('/api/save-resume')
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des CV')
        }
        const data = await response.json()
        setResumes(data)
      } catch (error) {
        console.error('Erreur:', error)
      }
    }

    if (status === 'authenticated') {
      fetchResumes()
    }
  }, [status])

  if (status === 'loading') {
    return <div>Chargement...</div>
  }

    function handleEdit(arg0: string): void {
        throw new Error('Function not implemented.')
    }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Mon tableau de bord</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/cv-builder" className="border-2 border-dashed border-gray-300 p-4 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100">
          Créer un nouveau CV
        </Link>
        {resumes.map((resume) => (
          <div key={resume.id} className="border border-gray-300 p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{resume.prenom} {resume.nom}</h2>
            <p className="text-gray-600">Modifié récemment</p>
            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => handleEdit(resume.id!)} 
                className="text-blue-500 hover:text-blue-700"
              >
                Modifier
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}