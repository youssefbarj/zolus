"use client"

import type React from "react"
import { useState } from "react"
import {
  Trash2,
  Droplets,
  Flame,
  AlertTriangle,
  Ban,
  XCircle,
  CheckCircle,
  ArrowRight,
  Activity,
  ClipboardList,
  User,
  Info,
} from "lucide-react"

// --- DATA CONSTANTS ---

const SORTING_ITEMS = [
  {
    id: 1,
    name: "Pince à envies",
    material: "Métal",
    category: "sterilization",
    icon: "✂️",
    image: "/metal-tweezers-beauty-salon-tool.jpg",
  },
  {
    id: 2,
    name: "Coton usagé",
    material: "Coton/Organique",
    category: "trash",
    icon: "☁️",
    image: "/used-cotton-pad-beauty-salon.jpg",
  },
  {
    id: 3,
    name: "Spatule Cire",
    material: "Bois",
    category: "trash",
    icon: "🪵",
    image: "/wooden-wax-spatula-stick.jpg",
  },
  {
    id: 4,
    name: "Bol à Masque",
    material: "Plastique",
    category: "disinfection",
    icon: "🥣",
    image: "/plastic-facial-mask-mixing-bowl.jpg",
  },
  {
    id: 5,
    name: "Ciseaux",
    material: "Métal",
    category: "sterilization",
    icon: "✂️",
    image: "/professional-beauty-scissors-metal.jpg",
  },
  {
    id: 6,
    name: "Lime à ongles",
    material: "Carton",
    category: "trash",
    icon: "📄",
    image: "/disposable-cardboard-nail-file.jpg",
  },
  {
    id: 7,
    name: "Pierre Ponce",
    material: "Pierre/Poreux",
    category: "trash",
    icon: "🪨",
    image: "/pumice-stone-beauty-tool.jpg",
  },
]

const BINS = [
  {
    id: "trash",
    label: "Poubelle",
    sub: "Usage unique / Jetable",
    color: "from-gray-50 to-gray-100 border-gray-200 text-gray-600 hover:border-gray-400",
    icon: Trash2,
    iconColor: "text-gray-500",
  },
  {
    id: "disinfection",
    label: "Désinfection",
    sub: "Plastique / Surfaces",
    color: "from-blue-50 to-blue-100 border-blue-200 text-blue-700 hover:border-blue-400",
    icon: Droplets,
    iconColor: "text-blue-500",
  },
  {
    id: "sterilization",
    label: "Stérilisation",
    sub: "Métal / Outils coupants",
    color: "from-red-50 to-red-100 border-red-200 text-red-700 hover:border-red-400",
    icon: Flame,
    iconColor: "text-red-500",
  },
]

const EPILATION_CASES = [
  {
    id: 1,
    zone: "Aisselles",
    history: "Diabète type 1 (insulino-dépendant)",
    obs: "Peau saine",
    correct: "orange",
    feedbackTitle: "Prudence requise",
    feedback: "Le diabète entraîne une cicatrisation lente et une perte de sensibilité. Éviter la cire trop chaude.",
  },
  {
    id: 2,
    zone: "Sourcils",
    history: "Traitement Roaccutane (Isotrétinoïne)",
    obs: "Peau fine, lèvres sèches",
    correct: "red",
    feedbackTitle: "Sécurité Assurée (Refus)",
    feedback:
      "Roaccutane affine la peau à l'extrême : risque d'arrachage de peau ! INTERDIT pendant le traitement + 6 mois après.",
  },
  {
    id: 3,
    zone: "Jambes",
    history: "Aucun",
    obs: "Varices importantes et douloureuses au toucher",
    correct: "red",
    feedbackTitle: "Sécurité Assurée",
    feedback:
      "La chaleur dilate les veines. Interdit de passer de la cire chaude dessus. Contourner ou utiliser bandes froides/rasoir.",
  },
  {
    id: 4,
    zone: "Maillot",
    history: "Aucun",
    obs: "Grain de beauté (Naevus) en relief avec poils",
    correct: "orange",
    feedbackTitle: "Prudence requise",
    feedback:
      "On ne doit jamais épiler sur un grain de beauté (risque de traumatisme). Il faut le contourner ou couper le poil au ciseau.",
  },
  {
    id: 5,
    zone: "Lèvre supérieure",
    history: "Aucun",
    obs: "Peau saine",
    correct: "green",
    feedbackTitle: "Feu Vert",
    feedback: "Aucune contre-indication visible. Vous pouvez procéder au soin en toute sécurité.",
  },
]

// --- SHARED UI COMPONENTS ---

const SectionHeader = ({
  title,
  badge,
  color,
  description,
}: { title: string; badge: string; color: string; description: string }) => (
  <div className="text-center mb-12">
    <div
      className={`inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-xs font-bold tracking-wider uppercase rounded-full bg-${color}-100 text-${color}-800 border border-${color}-200 shadow-sm`}
    >
      <Activity size={14} />
      {badge}
    </div>
    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">{title}</h2>
    <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">{description}</p>
  </div>
)

const GameContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden max-w-5xl mx-auto transform transition-all hover:shadow-3xl duration-500">
    {children}
  </div>
)

// --- SIMULATION 1: TRI SÉLECTIF ---

const SortingGame = ({ onNavigateToNext }: { onNavigateToNext?: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [feedback, setFeedback] = useState<{ type: string; message: string } | null>(null)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  const currentItem = SORTING_ITEMS[currentIndex]

  const handleSort = (binId: string) => {
    if (completed) return
    const isCorrect = binId === currentItem.category

    if (isCorrect) setScore((s) => s + 1)

    setFeedback({
      type: isCorrect ? "success" : "error",
      message: isCorrect
        ? "Excellent ! C'est le bon conteneur."
        : `Erreur ! Cet objet va dans : ${BINS.find((b) => b.id === currentItem.category)?.label}.`,
    })
  }

  const nextItem = () => {
    setFeedback(null)
    if (currentIndex < SORTING_ITEMS.length - 1) {
      setCurrentIndex((c) => c + 1)
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
    <div className="p-8 md:p-12 bg-gradient-to-b from-slate-50 to-white">
      {/* Progress Bar */}
      {!completed && (
        <div className="w-full bg-gray-200 h-2.5 rounded-full mb-8 overflow-hidden border border-gray-100">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            style={{ width: `${(currentIndex / SORTING_ITEMS.length) * 100}%` }}
          />
        </div>
      )}

      {completed ? (
        <div className="text-center py-16 animate-in zoom-in duration-500">
          <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(250,204,21,0.3)] animate-bounce-slow">
            <span className="text-6xl">🏆</span>
          </div>
          <h3 className="text-4xl font-black text-slate-900 mb-4">Mission Accomplie !</h3>
          <p className="text-slate-500 mb-10 text-xl">
            Score de sécurité :{" "}
            <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
              {score} / {SORTING_ITEMS.length}
            </span>
          </p>
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={restart}
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0"
            >
              Recommencer la mission
            </button>
            {onNavigateToNext && (
              <button
                onClick={onNavigateToNext}
                className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-2 group"
              >
                Continuer : Contre-indications{" "}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {/* Card Area */}
          <div className="relative mb-12 h-80 w-full flex justify-center items-center">
            {/* The Item Card */}
            <div className="relative z-10 bg-white border-2 border-slate-100 p-8 rounded-3xl shadow-2xl w-72 flex flex-col items-center justify-center text-center transform transition-all duration-500 hover:-translate-y-2 group cursor-pointer">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="mb-6 transform transition-transform group-hover:scale-110 duration-300 drop-shadow-sm">
                <img
                  src={currentItem.image || "/placeholder.svg"}
                  alt={currentItem.name}
                  className="w-32 h-32 object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{currentItem.name}</h3>
              <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wide border border-slate-200">
                {currentItem.material}
              </span>
            </div>

            {/* Decorative background stack effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-72 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm rotate-6 -z-10 opacity-70" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-72 bg-slate-100 rounded-3xl border border-slate-200 shadow-sm -rotate-6 -z-20 opacity-40" />
          </div>

          {/* Feedback Overlay */}
          {feedback ? (
            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-300">
              <div
                className={`p-8 rounded-3xl text-center mb-6 border-2 shadow-lg ${feedback.type === "success" ? "bg-green-50 border-green-200 shadow-green-100" : "bg-red-50 border-red-200 shadow-red-100"}`}
              >
                <div
                  className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${feedback.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                >
                  {feedback.type === "success" ? (
                    <CheckCircle size={32} strokeWidth={3} />
                  ) : (
                    <XCircle size={32} strokeWidth={3} />
                  )}
                </div>
                <h4
                  className={`text-2xl font-black mb-2 ${feedback.type === "success" ? "text-green-800" : "text-red-800"}`}
                >
                  {feedback.type === "success" ? "Correct !" : "Incorrect"}
                </h4>
                <p
                  className={`text-base font-medium ${feedback.type === "success" ? "text-green-700" : "text-red-700"}`}
                >
                  {feedback.message}
                </p>
              </div>
              <button
                onClick={nextItem}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg hover:shadow-xl transform active:scale-95 text-lg flex items-center justify-center gap-2"
              >
                Objet Suivant <ArrowRight size={20} />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {BINS.map((bin) => {
                const Icon = bin.icon
                return (
                  <button
                    key={bin.id}
                    onClick={() => handleSort(bin.id)}
                    className={`relative overflow-hidden p-6 rounded-2xl border-2 bg-gradient-to-b transition-all duration-200 group ${bin.color} h-40 flex flex-col items-center justify-center hover:shadow-lg active:scale-95`}
                  >
                    <div
                      className={`mb-3 p-3 rounded-xl bg-white/80 shadow-sm group-hover:scale-110 transition-transform ${bin.iconColor}`}
                    >
                      <Icon size={32} strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-lg text-slate-800">{bin.label}</span>
                    <span className="text-xs font-medium opacity-70 mt-1 uppercase tracking-wide">{bin.sub}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// --- SIMULATION 2: SÉCURITÉ ÉPILATION ---

const EpilationGame = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [feedback, setFeedback] = useState<{ status: string; decision: string; title: string; message: string } | null>(
    null,
  )
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [completed, setCompleted] = useState(false)

  const currentCase = EPILATION_CASES[currentIndex]

  const handleDecision = (decision: string) => {
    const isCorrect = decision === currentCase.correct

    setFeedback({
      status: isCorrect ? "correct" : "info",
      decision: decision,
      title: currentCase.feedbackTitle,
      message: currentCase.feedback,
    })
  }

  const nextCase = () => {
    setFeedback(null)
    if (currentIndex < EPILATION_CASES.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setCompleted(true)
    }
  }

  const restart = () => {
    setCurrentIndex(0)
    setCompleted(false)
    setFeedback(null)
  }

  if (completed) {
    return (
      <div className="p-8 md:p-12 bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center py-16 animate-in zoom-in duration-500">
          <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-bounce-slow">
            <span className="text-6xl">✅</span>
          </div>
          <h3 className="text-4xl font-black text-slate-900 mb-4">Simulation Terminée !</h3>
          <p className="text-slate-500 mb-10 text-xl">Vous avez analysé tous les cas de contre-indications.</p>
          <button
            onClick={restart}
            className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0"
          >
            Recommencer la simulation
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-12 min-h-[600px] bg-white">
      {/* Left Panel: Dossier Client */}
      <div className="md:col-span-5 bg-amber-50/50 p-8 md:p-10 flex flex-col border-r border-amber-100/50">
        <div className="mb-8 flex items-center gap-3 text-amber-900/40 font-bold uppercase tracking-widest text-xs">
          <User size={14} /> Dossier Client {currentIndex + 1}/{EPILATION_CASES.length}
        </div>

        <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
            <ClipboardList size={24} strokeWidth={2.5} />
          </div>
          Fiche Diagnostic
        </h3>

        <div className="space-y-5 flex-grow">
          {/* Card: Zone */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 hover:shadow-md transition-shadow">
            <span className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              <Activity size={12} /> Zone Demandée
            </span>
            <span className="font-bold text-2xl text-slate-800 block">{currentCase.zone}</span>
          </div>

          {/* Card: Anamnèse (Simplified) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <button
              onClick={() => setShowInfoModal(true)}
              className="absolute top-0 right-0 p-2 opacity-20 hover:opacity-60 transition-opacity cursor-pointer z-10"
              title="Explications médicales"
            >
              <Info size={40} />
            </button>
            <span className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              <Info size={12} /> Historique Santé
            </span>
            <div className="flex items-start gap-4">
              <div className="mt-1.5 w-2 h-2 rounded-full bg-indigo-500 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
              <div>
                <p className="text-slate-800 font-bold text-lg leading-snug mb-1">Ce que la cliente dit :</p>
                <p className="text-slate-600 font-medium leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                  &quot;{currentCase.history}&quot;
                </p>
              </div>
            </div>
          </div>

          {/* Card: Observation */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 hover:shadow-md transition-shadow">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              OBSERVATION VISUELLE
            </span>
            <div className="flex items-start gap-4">
              <div className="mt-1.5 w-2 h-2 rounded-full bg-pink-500 shrink-0 shadow-[0_0_8px_rgba(236,72,153,0.6)]"></div>
              <div>
                <p className="text-slate-800 font-bold text-lg leading-snug mb-1">Ce que vous voyez :</p>
                <p className="text-slate-600 font-medium leading-relaxed">{currentCase.obs}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Decision */}
      <div className="md:col-span-7 p-8 md:p-12 bg-white flex flex-col justify-center relative">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-black text-slate-800 mb-2">Votre Décision de Sécurité</h3>
          <p className="text-slate-400 text-base font-medium">Analysez les risques et choisissez la bonne action.</p>
        </div>

        {!feedback ? (
          <div className="space-y-4 max-w-md mx-auto w-full animate-in fade-in slide-in-from-right-8 duration-500">
            <button
              onClick={() => handleDecision("green")}
              className="group w-full p-5 rounded-2xl bg-white border-2 border-slate-100 hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-left flex items-center gap-5 shadow-sm hover:shadow-md active:scale-98"
            >
              <div className="w-14 h-14 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                <CheckCircle size={28} strokeWidth={2.5} />
              </div>
              <div>
                <span className="block text-lg font-bold text-slate-800 group-hover:text-green-800 transition-colors">
                  J&apos;accepte le soin
                </span>
                <span className="text-sm text-slate-500 font-medium group-hover:text-green-700">
                  Aucune contre-indication
                </span>
              </div>
            </button>

            <button
              onClick={() => handleDecision("orange")}
              className="group w-full p-5 rounded-2xl bg-white border-2 border-slate-100 hover:border-amber-400 hover:bg-amber-50 transition-all duration-200 text-left flex items-center gap-5 shadow-sm hover:shadow-md active:scale-98"
            >
              <div className="w-14 h-14 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                <AlertTriangle size={28} strokeWidth={2.5} />
              </div>
              <div>
                <span className="block text-lg font-bold text-slate-800 group-hover:text-amber-800 transition-colors">
                  J&apos;adapte la technique
                </span>
                <span className="text-sm text-slate-500 font-medium group-hover:text-amber-700">
                  Précautions requises
                </span>
              </div>
            </button>

            <button
              onClick={() => handleDecision("red")}
              className="group w-full p-5 rounded-2xl bg-white border-2 border-slate-100 hover:border-red-500 hover:bg-red-50 transition-all duration-200 text-left flex items-center gap-5 shadow-sm hover:shadow-md active:scale-98"
            >
              <div className="w-14 h-14 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                <Ban size={28} strokeWidth={2.5} />
              </div>
              <div>
                <span className="block text-lg font-bold text-slate-800 group-hover:text-red-800 transition-colors">
                  Je refuse (Risque)
                </span>
                <span className="text-sm text-slate-500 font-medium group-hover:text-red-700">
                  Contre-indication absolue
                </span>
              </div>
            </button>
          </div>
        ) : (
          <div className="text-center animate-in fade-in zoom-in duration-300 w-full max-w-lg mx-auto">
            {/* Feedback Status */}
            <div
              className={`mb-8 inline-flex items-center justify-center p-6 rounded-3xl ${
                currentCase.correct === feedback.decision
                  ? "bg-green-50 text-green-600 border-4 border-green-100"
                  : "bg-red-50 text-red-600 border-4 border-red-100"
              }`}
            >
              {currentCase.correct === feedback.decision ? (
                <CheckCircle size={64} strokeWidth={2} />
              ) : (
                <XCircle size={64} strokeWidth={2} />
              )}
            </div>

            <h3
              className={`text-3xl font-black mb-3 ${
                currentCase.correct === feedback.decision ? "text-slate-800" : "text-slate-800"
              }`}
            >
              {currentCase.correct === feedback.decision ? "Excellente décision !" : "Attention, erreur."}
            </h3>

            <div
              className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide mb-6 ${
                feedback.decision === "green"
                  ? "bg-green-100 text-green-700"
                  : feedback.decision === "orange"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {feedback.title}
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 mb-8 text-left shadow-inner">
              <p className="text-slate-700 text-lg leading-relaxed font-medium">{feedback.message}</p>
            </div>

            <button
              onClick={nextCase}
              className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0 text-lg flex items-center gap-3 mx-auto"
            >
              Cas Suivant <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Info className="text-indigo-600" size={28} />
                <h2 className="text-2xl font-bold text-slate-800">Guide Médical</h2>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <XCircle size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-slate-600 leading-relaxed">
                Voici des explications sur les termes médicaux que vous pourriez rencontrer dans l&apos;historique santé
                des clientes :
              </p>

              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                    <AlertTriangle size={18} />
                    Roaccutane (Isotrétinoïne)
                  </h3>
                  <p className="text-red-700 text-sm leading-relaxed">
                    Médicament contre l&apos;acné sévère qui affine extrêmement la peau. Rend la peau fragile avec
                    risque d&apos;arrachage cutané.
                    <strong> Épilation INTERDITE pendant le traitement et 6 mois après l&apos;arrêt.</strong>
                  </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <h3 className="font-bold text-orange-800 mb-2">Diabète (Type 1 ou 2)</h3>
                  <p className="text-orange-700 text-sm leading-relaxed">
                    Maladie chronique affectant la glycémie. Entraîne une <strong>cicatrisation lente</strong> et une{" "}
                    <strong>perte de sensibilité</strong>. Prudence : éviter la cire trop chaude, risque
                    d&apos;infection accru.
                  </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <h3 className="font-bold text-orange-800 mb-2">Traitement Anticoagulant</h3>
                  <p className="text-orange-700 text-sm leading-relaxed">
                    Médicaments qui fluidifient le sang (ex: Coumadine, Xarelto).{" "}
                    <strong>Risque d&apos;hématomes</strong> (bleus) importants et de saignements prolongés. Épilation
                    possible mais avec grande prudence.
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                    <AlertTriangle size={18} />
                    Varices Importantes
                  </h3>
                  <p className="text-red-700 text-sm leading-relaxed">
                    Veines dilatées et douloureuses. <strong>La chaleur dilate encore plus les veines.</strong>
                    Interdit de passer de la cire chaude dessus. Il faut les contourner ou utiliser bandes froides.
                  </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <h3 className="font-bold text-orange-800 mb-2">Grain de beauté (Naevus)</h3>
                  <p className="text-orange-700 text-sm leading-relaxed">
                    Tache pigmentée sur la peau. <strong>Ne jamais épiler directement dessus</strong> (risque de
                    traumatisme et transformation). Il faut le contourner ou couper les poils aux ciseaux.
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                    <AlertTriangle size={18} />
                    Herpès Actif
                  </h3>
                  <p className="text-red-700 text-sm leading-relaxed">
                    Infection virale contagieuse (boutons de fièvre).{" "}
                    <strong>Épilation INTERDITE en phase active</strong> car risque de propagation du virus sur toute la
                    zone.
                  </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <h3 className="font-bold text-orange-800 mb-2">Grossesse</h3>
                  <p className="text-orange-700 text-sm leading-relaxed">
                    Peau plus sensible et réactive. <strong>Prudence accrue</strong>, surtout au niveau du ventre et
                    zones intimes. Vérifier la tolérance et éviter les zones sensibles.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h3 className="font-bold text-green-800 mb-2">Peau Saine / Aucun Antécédent</h3>
                  <p className="text-green-700 text-sm leading-relaxed">
                    Aucune contre-indication médicale. L&apos;épilation peut être réalisée normalement en respectant les
                    protocoles d&apos;hygiène et de sécurité standards.
                  </p>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                <h3 className="font-bold text-indigo-800 mb-2">Rappel Important</h3>
                <p className="text-indigo-700 text-sm leading-relaxed">
                  En cas de doute, il est toujours préférable de <strong>refuser le soin</strong> ou de demander un{" "}
                  <strong>avis médical</strong>. La sécurité de la cliente est votre priorité absolue.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// --- MAIN APP ---

export default function SimulationsApp() {
  const [currentScreen, setCurrentScreen] = useState("sorting-game")

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-20">
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentScreen("sorting-game")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                currentScreen === "sorting-game"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Simulation #1: Tri Sélectif
            </button>
            <button
              onClick={() => setCurrentScreen("epilation-game")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                currentScreen === "epilation-game"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Simulation #2: Contre-indications
            </button>
          </div>
        </div>
      </div>

      {/* Simulation 1 Section */}
      {currentScreen === "sorting-game" && (
        <section className="flex flex-col items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-5xl">
            <SectionHeader
              badge="Simulation #1"
              title="Mission : Tri Sélectif"
              description="Le soin est terminé. La sécurité de votre cabine dépend de votre capacité à trier chaque déchet au bon endroit."
              color="indigo"
            />
            <GameContainer>
              <SortingGame onNavigateToNext={() => setCurrentScreen("epilation-game")} />
            </GameContainer>
          </div>
        </section>
      )}

      {/* Spacer */}
      <div className="h-10"></div>

      {/* Simulation 2 Section */}
      {currentScreen === "epilation-game" && (
        <section
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-emerald-100 max-w-5xl mx-auto"
          id="contraindications-section"
        >
          <div className="w-full">
            <SectionHeader
              badge="Simulation #2"
              title="Contre-indications Épilation"
              description="Analysez le dossier médical et l&apos;état de la peau. Identifiez les contre-indications pour protéger votre cliente."
              color="emerald"
            />
            <GameContainer>
              <EpilationGame />
            </GameContainer>
          </div>
        </section>
      )}
    </div>
  )
}
