import './globals.css'
import Providers from '../contexts/Providers'

export const metadata = {
  title: 'DocsApp',
  description: 'Document manager',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="topbar">
            <a className="logo" href="/">DocsApp</a>
            <nav>
              <a href="/dashboard">Dashboard</a>
              <a href="/documents">My Documents</a>
            </nav>
          </header>
          <main className="container">
            <Providers>{children}</Providers>
          </main>
        </div>
      </body>
    </html>
  )
}
