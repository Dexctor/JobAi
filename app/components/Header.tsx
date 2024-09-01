'use client'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          CVPro IA
        </Link>
        <ul className="flex space-x-4">
          {status === 'authenticated' && (
            <>
              <li><Link href="/dashboard" className="hover:underline">Mon tableau de bord</Link></li>
              <li><Link href="/cv-builder" className="hover:underline">Créer un CV</Link></li>
              <li><Link href="/pricing" className="hover:underline">Tarifs</Link></li>
            </>
          )}
          {status === 'authenticated' ? (
            <li>
              <button onClick={() => signOut()} className="hover:underline">Déconnexion</button>
            </li>
          ) : (
            <>
              <li>
                <Link href="/auth/signin" className="hover:underline">Connexion</Link>
              </li>
              <li>
                <Link href="/auth/signup" className="hover:underline">Inscription</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}