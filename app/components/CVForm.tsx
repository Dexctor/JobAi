"use client"
import { useState, ChangeEvent, FormEvent } from 'react';
import { getAIGeneratedContent } from '../utils/aiSuggestions';
import { CVData } from '../cv-builder/page';

interface Section {
  id: string;
  title: string;
  content: string;
}

interface CVFormProps {
  onSubmit: (data: CVData) => void;
  data: CVData;
}

function CVForm({ onSubmit, data }: CVFormProps) {
  const [formData, setFormData] = useState<CVData>(data);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (['nom', 'prenom', 'email', 'telephone'].includes(name)) {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        sections: prevData.sections.map((section) =>
          section.id === name ? { ...section, content: value } : section
        ),
      }));
    }
  };

  const handleGenerateContent = async (sectionId: string) => {
    const section = formData.sections.find(s => s.id === sectionId);
    if (section) {
      const content = await getAIGeneratedContent(section.title, section.content);
      setFormData((prevData: CVData) => ({
        ...prevData,
        sections: prevData.sections.map((s: Section) =>
          s.id === sectionId ? { ...s, content } : s
        )
      }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" className="w-full p-2 border rounded text-black" />
      <input name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom" className="w-full p-2 border rounded text-black" />
      <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded text-black" />
      <input name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Téléphone" className="w-full p-2 border rounded text-black" />
      
      {formData.sections.map((section: Section) => (
        <div key={section.id}>
          <textarea
            name={section.id}
            value={section.content}
            onChange={handleChange}
            placeholder={section.title}
            className="w-full p-2 h-64 border rounded text-black"
          />
          <button type="button" onClick={() => handleGenerateContent(section.id)} className="mt-2 bg-green-500 text-white p-2 rounded">
            Générer {section.title.toLowerCase()}
          </button>
        </div>
      ))}

      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Générer le CV</button>
    </form>
  );
}

export default CVForm;