"use client"

import { useState } from "react"
import { Trash2, Droplets, Flame, AlertTriangle, ShieldCheck, XCircle, CheckCircle, ArrowRight } from "lucide-react"

// --- DATA ---

// Simulation 1: Tri Sélectif
const SORTING_ITEMS = [
  { id: 1, name: "Pince à envies", material: "Métal", category: "sterilization", icon: "✂️" },
  { id: 2, name: "Coton usagé", material: "Coton/Organique", category: "trash", icon: "☁️" },
  { id: 3, name: "Spatule Cire", material: "Bois", category: "trash", icon: "🪵" },
  { id: 4, name: "Bol à Masque", material: "Plastique", category: "disinfection", icon: "🥣" },
  { id: 5, name: "Ciseaux", material: "Métal", category: "sterilization", icon: "✂️" },
  { id: 6, name: "Lime à ongles", material: "Carton", category: "trash", icon: "📄" },
  { id: 7, name: "Pierre Ponce", material: "Pierre/Poreux", category: "trash", icon: "🪨" },
]

const BINS = [
  {
    id: "trash",
    label: "Poubelle",
    sub: "Usage unique / Non dangereux",
    color: "bg-gray-100 border-gray-300",
    icon: Trash2,
  },
  {
    id: "disinfection",
    label: "Désinfection",
    sub: "Plastique / Surfaces",
    color: "bg-blue-50 border-blue-200",
    icon: Droplets,
  },
  {
    id: "sterilization",
    label: "Stérilisation",
    sub: "Métal / Critique",
    color: "bg-red-50 border-red-200",
    icon: Flame,
  },
]

// Simulation 2: Dermatologie
const DERMA_CARDS = [
  { id: 1, name: "Herpès Labial", img: "👄", contagious: true, info: "TRÈS CONTAGIEUX (Virus). Refuser le soin." },
  {
    id: 2,
    name: "Eczéma",
    img: "🌵",
    contagious: false,
    info: "NON CONTAGIEUX. Inflammation chronique. Soin autorisé (produits doux).",
  },
  {
    id: 3,
    name: "Mycose des Ongles",
    img: "💅",
    contagious: true,
    info: "CONTAGIEUX (Champignon). Refuser manucure/pédicure.",
  },
  {
    id: 4,
    name: "Psoriasis",
    img: "⚪",
    contagious: false,
    info: "NON CONTAGIEUX. Maladie auto-immune. Soin autorisé.",
  },
  { id: 5, name: "Verrues", img: "✋", contagious: true, info: "CONTAGIEUX (Papillomavirus). Contourner ou couvrir." },
  {
    id: 6,
    name: "Urticaire",
    img: "🔴",
    contagious: false,
    info: "NON CONTAGIEUX. Réaction allergique. Soin autorisé.",
  },
]

// Simulation 3: Sécurité Épilation
const EPILATION_CASES = [
  {
    id: 1,
    zone: "Aisselles",
    history: "Diabète type 1 (insulino-dépendant)",
    obs: "Peau saine",
    correct: "orange",
    feedback:
      "Prudence requise : Le diabète entraîne une cicatrisation lente et une perte de sensibilité. Éviter la cire trop chaude.",
  },
  {
    id: 2,
    zone: "Sourcils",
    history: "Traitement Roaccutane en cours",
    obs: "Peau fine, lèvres sèches",
    correct: "red",
    feedback:
      "Sécurité Assurée (Refus) : Roaccutane affine la peau à l'extrême. Risque d'arrachage de peau ! INTERDIT pendant le traitement + 6 mois après.",
  },
  {
    id: 3,
    zone: "Jambes",
    history: "Aucun",
    obs: "Varices importantes et douloureuses au toucher",
    correct: "red",
    feedback:
      "Sécurité Assurée : La chaleur dilate les veines. Interdit de passer de la cire chaude dessus. Contourner ou utiliser bandes froides/rasoir.",
  },
  {
    id: 4,
    zone: "Maillot",
    history: "Aucun",
    obs: "Grain de beauté (Naevus) en relief avec poils",
    correct: "orange",
    feedback:
      "Prudence requise : On ne doit jamais épiler sur un grain de beauté (risque de traumatisme). Il faut le contourner ou couper le poil au ciseau.",
  },
  {
    id: 5,
    zone: "Lèvre supérieure",
    history: "Aucun",
    obs: "Peau saine",
    correct: "green",
    feedback: "Feu Vert : Aucune contre-indication visible. Vous pouvez procéder au soin.",
  },
]

// --- COMPONENTS ---

// 1. Sorting Game Component
const SortingGame = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  const currentItem = SORTING_ITEMS[currentIndex]

  const handleSort = (binId: string) => {
    if (completed) return

    if (binId === currentItem.category) {
      setFeedback({
        type: "success",
        message: "Excellent ! C'est le bon conteneur.",
      })
      setScore(score + 1)
    } else {
      const correctBinLabel = BINS.find((b) => b.id === currentItem.category)?.label
      setFeedback({
        type: "error",
        message: `Erreur ! Non, ${currentItem.name} est en ${currentItem.material}. Il fallait choisir : ${correctBinLabel}.`,
      })
    }
  }

  const nextItem = () => {
    setFeedback(null)
    if (currentIndex < SORTING_ITEMS.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCompleted(true)
    }
  }

  const restart = () => {
    setCurrentIndex(0)
    setScore(0)
    setCompleted(false)
    setFeedback(null)
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-center mb-2 text-slate-800">Mission : Tri Sélectif</h2>
      <p className="text-center text-gray-500 mb-8 text-sm">
        Triez chaque objet dans le bon conteneur pour assurer la sécurité sanitaire.
      </p>

      {completed ? (
        <div className="text-center py-10">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Terminé !</h3>
          <p className="text-gray-600 mb-6">
            Score final : {score} / {SORTING_ITEMS.length}
          </p>
          <button
            onClick={restart}
            className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
          >
            Recommencer
          </button>
        </div>
      ) : (
        <>
          {/* Card to sort */}
          <div className="flex justify-center mb-10">
            <div className="bg-white border-2 border-indigo-100 p-8 rounded-2xl shadow-lg w-64 text-center transform transition-all hover:scale-105">
              <div className="text-5xl mb-4">{currentItem.icon}</div>
              <h3 className="text-xl font-bold text-slate-800">{currentItem.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{currentItem.material}</p>
            </div>
          </div>

          {/* Feedback Overlay */}
          {feedback && (
            <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-in fade-in zoom-in duration-200">
                <div
                  className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${feedback.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                >
                  {feedback.type === "success" ? <CheckCircle size={32} /> : <XCircle size={32} />}
                </div>
                <h3
                  className={`text-xl font-bold mb-2 ${feedback.type === "success" ? "text-green-700" : "text-red-700"}`}
                >
                  {feedback.type === "success" ? "Bravo !" : "Erreur !"}
                </h3>
                <p className="text-gray-600 mb-6">{feedback.message}</p>
                <button
                  onClick={nextItem}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}

          {/* Bins */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BINS.map((bin) => {
              const Icon = bin.icon
              return (
                <button
                  key={bin.id}
                  onClick={() => handleSort(bin.id)}
                  className={`p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all hover:bg-opacity-50 active:scale-95 ${bin.color} border-opacity-50 hover:border-opacity-100`}
                >
                  <Icon size={28} className="mb-2 text-gray-700" />
                  <span className="font-bold text-gray-800">{bin.label}</span>
                  <span className="text-xs text-gray-500 text-center mt-1">{bin.sub}</span>
                </button>
              )
            })}
          </div>

          <div className="mt-6 flex justify-between text-sm text-gray-400">
            <span>
              Objet {currentIndex + 1} sur {SORTING_ITEMS.length}
            </span>
            <span>Score: {score}</span>
          </div>
        </>
      )}
    </div>
  )
}

// 2. Dermatology Flashcards
const DermaGame = () => {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({})

  const toggleFlip = (id: number) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-xl font-bold text-center mb-2 text-slate-800">Dermatologie Esthétique</h2>
      <p className="text-center text-gray-500 mb-8 text-sm">
        Savoir identifier pour ne pas contaminer. Cliquez pour voir le verdict.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {DERMA_CARDS.map((card) => (
          <div key={card.id} className="h-48 cursor-pointer perspective group" onClick={() => toggleFlip(card.id)}>
            <div
              className={`relative w-full h-full duration-500 preserve-3d transition-transform ${flipped[card.id] ? "[transform:rotateY(180deg)]" : ""}`}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front */}
              <div
                className="absolute w-full h-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="text-4xl mb-4">{card.img}</div>
                <h3 className="font-bold text-lg text-slate-700">{card.name}</h3>
                <p className="text-xs text-gray-400 mt-2">Cliquez pour voir</p>
              </div>

              {/* Back */}
              <div
                className={`absolute w-full h-full bg-white rounded-xl shadow-sm border p-6 flex flex-col items-center justify-center ${card.contagious ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <div
                  className={`text-sm font-bold mb-2 uppercase tracking-wide ${card.contagious ? "text-red-600" : "text-green-600"}`}
                >
                  {card.contagious ? "Très Contagieux" : "Non Contagieux"}
                </div>
                <p className="text-center text-sm text-gray-700 leading-relaxed">{card.info}</p>
                <div
                  className={`mt-4 px-3 py-1 rounded-full text-xs font-bold ${card.contagious ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"}`}
                >
                  {card.contagious ? "REFUSER" : "SOIN AUTORISÉ"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 3. Epilation Safety Game
const EpilationGame = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [feedback, setFeedback] = useState<{ status: string; message: string } | null>(null)

  const currentCase = EPILATION_CASES[currentIndex]

  const handleDecision = (decision: string) => {
    const isCorrect = decision === currentCase.correct

    setFeedback({
      status: isCorrect ? "correct" : "info",
      message: currentCase.feedback,
    })
  }

  const nextCase = () => {
    setFeedback(null)
    setCurrentIndex((prev) => (prev + 1) % EPILATION_CASES.length)
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Sécurité Épilation</h2>
          <p className="text-xs text-gray-500">
            Cas {currentIndex + 1} / {EPILATION_CASES.length}
          </p>
        </div>
        {feedback && (
          <button
            onClick={nextCase}
            className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:underline"
          >
            Cas Suivant <ArrowRight size={16} />
          </button>
        )}
      </div>

      {/* Client File */}
      <div className="bg-slate-50 rounded-lg p-5 mb-6 border border-slate-200">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Dossier Client</h3>

        <div className="space-y-4">
          <div>
            <span className="block text-xs text-gray-500 mb-1">ZONE DEMANDÉE</span>
            <span className="font-bold text-slate-800 text-lg">{currentCase.zone}</span>
          </div>

          <div>
            <span className="block text-xs text-gray-500 mb-1">ANAMNÈSE (ANTÉCÉDENTS)</span>
            <div className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
              <span className="text-slate-700">{currentCase.history}</span>
            </div>
          </div>

          <div>
            <span className="block text-xs text-gray-500 mb-1">OBSERVATION VISUELLE</span>
            <div className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0"></span>
              <span className="text-slate-700">{currentCase.obs}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Buttons */}
      {!feedback ? (
        <div className="space-y-3">
          <p className="text-sm font-bold text-gray-700 mb-2">Votre Décision de Sécurité :</p>

          <button
            onClick={() => handleDecision("green")}
            className="w-full p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 font-bold flex items-center justify-center gap-2 hover:bg-green-100 transition"
          >
            <CheckCircle size={20} /> FEU VERT : Épiler sans risque
          </button>

          <button
            onClick={() => handleDecision("orange")}
            className="w-full p-4 rounded-lg bg-orange-50 border border-orange-200 text-orange-800 font-bold flex items-center justify-center gap-2 hover:bg-orange-100 transition"
          >
            <AlertTriangle size={20} /> ORANGE : Adapter la technique
          </button>

          <button
            onClick={() => handleDecision("red")}
            className="w-full p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition"
          >
            <ShieldCheck size={20} /> FEU ROUGE : Refuser le soin
          </button>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white border-2 border-indigo-100 rounded-xl p-6 text-center shadow-lg">
            <div className="mb-4">
              {currentCase.correct === "red" && <ShieldCheck size={48} className="mx-auto text-red-500" />}
              {currentCase.correct === "orange" && <AlertTriangle size={48} className="mx-auto text-orange-500" />}
              {currentCase.correct === "green" && <CheckCircle size={48} className="mx-auto text-green-500" />}
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              {currentCase.correct === "red"
                ? "Refus Nécessaire"
                : currentCase.correct === "orange"
                  ? "Prudence Requise"
                  : "Sécurité Assurée"}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{feedback.message}</p>
            <button
              onClick={nextCase}
              className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition"
            >
              Cas Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// --- MAIN APP ---

export default function EsthetiquePro() {
  const [activeTab, setActiveTab] = useState("sorting")

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-black bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">
              Esthétique Pro
            </h1>
            <nav className="flex space-x-1">
              {[
                { id: "sorting", label: "Tri Sélectif" },
                { id: "derma", label: "Diagnostic" },
                { id: "safety", label: "Sécurité Épilation" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                    activeTab === tab.id ? "bg-slate-900 text-white" : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="animate-in fade-in duration-500">
          {activeTab === "sorting" && <SortingGame />}
          {activeTab === "derma" && <DermaGame />}
          {activeTab === "safety" && <EpilationGame />}
        </div>
      </main>
    </div>
  )
}
