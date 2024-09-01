'use client'
import { signIn } from 'next-auth/react'

export default function SignIn() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Connexion</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const email = e.currentTarget.email.value
          const password = e.currentTarget.password.value
          signIn('credentials', { email, password })
        }}
        className="space-y-4"
      >
        <input name="email" type="email" placeholder="Email" className="w-full p-2 border rounded text-black" />
        <input name="password" type="password" placeholder="Mot de passe" className="w-full p-2 border rounded text-black" />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Connexion</button>
      </form>
    </div>
  )
}