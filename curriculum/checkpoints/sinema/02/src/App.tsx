import { appTitle } from './config'

function App() {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <header className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-bold tracking-tight">{appTitle}</h1>
        <p className="mt-1 text-slate-400">Bugün ne izlesek?</p>
      </header>
      <p className="text-slate-400">Burası senin uygulaman. Her modülde biraz daha büyüyecek.</p>
    </main>
  )
}

export default App
