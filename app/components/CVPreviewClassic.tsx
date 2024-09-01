'use client'
import React from 'react'
import { CVData } from '../cv-builder/page'

interface CVPreviewClassicProps {
  data: CVData
}

const CVPreviewClassic: React.FC<CVPreviewClassicProps> = ({ data }) => {
  return (
    <div>
      <h2>{data.nom} {data.prenom}</h2>
      <p>Email: {data.email}</p>
      <p>Téléphone: {data.telephone}</p>
      {/* Affichez les sections du CV */}
      {data.sections.map(section => (
        <div key={section.id}>
          <h3>{section.title}</h3>
          <p>{section.content}</p>
        </div>
      ))}
    </div>
  )
}

export default CVPreviewClassic