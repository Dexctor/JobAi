'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import CVForm from '../components/CVForm'
import CVPreview from '../components/CVPreview'
import CVPreviewModern from '../components/CVPreviewModern'
import CVPreviewClassic from '../components/CVPreviewClassic'
import Toast from '../components/Toast'
import { useSession, signIn } from 'next-auth/react'

let html2pdf: any;
if (typeof window !== 'undefined') {
  html2pdf = require('html2pdf.js');
}

interface Section {
  id: string;
  title: string;
  content: string;
}

export interface CVData {
  id?: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  sections: Section[];
  experience: string;
  education: string;
  competences: string;
}

export default function CVBuilder() {
  const { data: session, status } = useSession()
  const [cvData, setCVData] = useState<CVData>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    sections: [
      { id: 'experience', title: 'Expérience professionnelle', content: '' },
      { id: 'education', title: 'Formation', content: '' },
      { id: 'competences', title: 'Compétences', content: '' },
    ],
    experience: '',
    education: '',
    competences: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const cvRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn()
    }
  }, [status])

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      fetchCV(id)
    }
  }, [searchParams])

  const fetchCV = async (id: string) => {
    try {
      const response = await fetch(`/api/save-resume?id=${id}`)
      if (!response.ok) throw new Error('Erreur lors de la récupération du CV')
      const data = await response.json()
      setCVData(data)
    } catch (error) {
      console.error('Erreur:', error)
      setToastMessage('Erreur lors de la récupération du CV')
    }
  }

  const handleFormSubmit = async (data: CVData) => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/save-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Erreur lors de la sauvegarde du CV')
      const savedCV = await response.json()
      setCVData(savedCV)
      setToastMessage('Votre CV a été généré et sauvegardé avec succès !')
    } catch (error) {
      console.error('Erreur:', error)
      setToastMessage('Erreur lors de la sauvegarde du CV')
    }

    setIsGenerating(false)
  }

  const renderCVPreview = () => {
    switch (selectedTemplate) {
      case 'modern':
        return <CVPreviewModern data={cvData} />
      case 'classic':
        return <CVPreviewClassic data={cvData} />
      default:
        return <CVPreview data={cvData} />
    }
  }

  const handleDownloadPDF = () => {
    const element = cvRef.current
    if (element && html2pdf) {
      const opt = {
        margin: 10,
        filename: `CV_${cvData.prenom}_${cvData.nom}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }

      html2pdf().set(opt).from(element).save()
      setToastMessage('Téléchargement du CV en cours...')
    }
  }

  if (status === 'loading') {
    return <div>Chargement...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Créez votre CV</h1>
      <div className="mb-4">
        <label className="mr-2">Choisissez un modèle :</label>
        <select
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          className="border rounded p-2"
        >
          <option value="modern">Moderne</option>
          <option value="classic">Classique</option>
        </select>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <CVForm onSubmit={handleFormSubmit} data={cvData} />
        </div>
        <div className="w-full md:w-1/2">
          {isGenerating ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-xl">Génération de votre CV en cours...</p>
            </div>
          ) : (
            <div>
              <div ref={cvRef}>{renderCVPreview()}</div>
              <button
                onClick={handleDownloadPDF}
                className="mt-4 bg-green-500 text-white p-2 rounded w-full"
              >
                Télécharger en PDF
              </button>
            </div>
          )}
        </div>
      </div>
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
    </div>
  )
}