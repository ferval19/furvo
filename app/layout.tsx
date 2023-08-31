import Header from '@/components/Header'
import './globals.css'

export const metadata = {
  title: 'Furvo. App',
  description: 'La web que todo cuñado aficionado al futbol quiere tener.',
}

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
      <Header/>

        <main className="min-h-screen bg-gray-100 flex flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  )
}
