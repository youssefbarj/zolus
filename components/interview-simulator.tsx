"use client"

import { useState, useEffect, useRef } from "react"
import { Smile, Award, RefreshCw, ChevronRight, User, CheckCircle2, XCircle } from "lucide-react"

// --- CONFIGURATION ---
const INITIAL_SCORES = {
  sourire: 30,
  competence: 30,
}

const WIN_THRESHOLD = 70 // Average score needed to win

// --- SCENARIO DATA ---
const SCENARIO = [
  {
    id: 1,
    speaker: "DIRECTRICE DU SPA",
    text: "Bonjour. Je suis la Directrice. Merci d'être venue. Votre tenue est... intéressante.",
    options: [
      {
        id: "A",
        text: "Oui, c'est ma tenue de tous les jours, je suis à l'aise.",
        feedback: "Conseil : L'apparence est cruciale en institut. Une tenue négligée envoie un mauvais signal.",
        scoreImpact: { sourire: -10, competence: -10 },
        isCorrect: false,
      },
      {
        id: "B",
        text: "J'ai opté pour une tenue sobre et soignée, comme l'exige le métier.",
        feedback:
          "Conseil : Parfait. L'apparence physique est le premier critère de jugement (blouse, cheveux attachés).",
        scoreImpact: { sourire: +10, competence: +10 },
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    speaker: "DIRECTRICE DU SPA",
    text: "Bien. Une cliente arrive en retard de 20 minutes pour son soin visage et elle est très stressée. Que faites-vous ?",
    options: [
      {
        id: "A",
        text: "Je lui dis que c'est trop tard, j'ai d'autres rendez-vous.",
        feedback: "Conseil : Manque de flexibilité. Refuser une cliente sans solution nuit à la réputation du spa.",
        scoreImpact: { sourire: -10, competence: 0 },
        isCorrect: false,
      },
      {
        id: "B",
        text: "Je l'accueille avec le sourire et je propose un soin plus court pour ne pas pénaliser la suite.",
        feedback: "Conseil : Excellente réponse ! Vous démontrez de la Flexibilité et gardez le Sourire.",
        scoreImpact: { sourire: +20, competence: +10 },
        isCorrect: true,
      },
    ],
  },
  {
    id: 3,
    speaker: "DIRECTRICE DU SPA",
    text: "Parlez-moi de vos compétences techniques. Qu'est-ce qui vous distingue ?",
    options: [
      {
        id: "A",
        text: "Je maîtrise l'épilation à la cire chaude et froide, ainsi que le massage relaxant.",
        feedback: "Conseil : Très bien. Citer des compétences précises rassure sur votre savoir-faire technique.",
        scoreImpact: { sourire: 0, competence: +20 },
        isCorrect: true,
      },
      {
        id: "B",
        text: "J'apprends vite, je peux tout faire.",
        feedback: "Conseil : Un peu vague. Le recruteur a besoin de connaître vos acquis réels.",
        scoreImpact: { sourire: 0, competence: -5 },
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    speaker: "DIRECTRICE DU SPA",
    text: "Merci. Une dernière chose : pourquoi devrais-je vous choisir vous ?",
    options: [
      {
        id: "A",
        text: "J'ai besoin de travailler.",
        feedback: "Conseil : Manque de motivation pour le secteur. Parlez de ce que vous apportez à l'entreprise.",
        scoreImpact: { sourire: -10, competence: -10 },
        isCorrect: false,
      },
      {
        id: "B",
        text: "Pour ma douceur, ma voix apaisante et ma passion du bien-être client.",
        feedback: "Conseil : Bravo. La 'texture de la voix' et la passion sont des atouts majeurs pour fidéliser.",
        scoreImpact: { sourire: +15, competence: +10 },
        isCorrect: true,
      },
    ],
  },
]

export default function InterviewSimulator() {
  const [currentStep, setCurrentStep] = useState(0)
  const [history, setHistory] = useState([])
  const [scores, setScores] = useState(INITIAL_SCORES)
  const [gameState, setGameState] = useState("playing") // 'playing', 'won', 'lost'
  const bottomRef = useRef(null)

  // Auto-scroll to bottom of chat
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [history, currentStep])

  const handleChoice = (option) => {
    // 1. Update scores
    const newScores = {
      sourire: Math.min(100, Math.max(0, scores.sourire + option.scoreImpact.sourire)),
      competence: Math.min(100, Math.max(0, scores.competence + option.scoreImpact.competence)),
    }
    setScores(newScores)

    // 2. Add interaction to history
    const newHistoryItem = {
      question: SCENARIO[currentStep].text,
      answer: option.text,
      feedback: option.feedback,
      isCorrect: option.isCorrect,
      speaker: SCENARIO[currentStep].speaker,
    }
    setHistory([...history, newHistoryItem])

    // 3. Progress or End Game
    if (currentStep < SCENARIO.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      finishGame(newScores)
    }
  }

  const finishGame = (finalScores) => {
    const average = (finalScores.sourire + finalScores.competence) / 2
    if (average >= WIN_THRESHOLD) {
      setGameState("won")
    } else {
      setGameState("lost")
    }
  }

  const restartGame = () => {
    setCurrentStep(0)
    setHistory([])
    setScores(INITIAL_SCORES)
    setGameState("playing")
  }

  return (
    <div className="flex flex-col md:flex-row h-[600px] w-full max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden font-sans border border-slate-200">
      {/* --- LEFT COLUMN: AVATAR --- */}
      <div className="w-full md:w-1/3 bg-slate-50 relative flex items-center justify-center border-r border-slate-100">
        <img src="/images/spa-manager.png" alt="Directrice du Spa" className="w-full h-full object-cover opacity-95" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-12">
          <h2 className="text-white font-bold text-xl">Directrice du Spa</h2>
          <p className="text-pink-200 text-sm">Entretien d'embauche</p>
        </div>
      </div>

      {/* --- RIGHT COLUMN: INTERFACE --- */}
      <div className="w-full md:w-2/3 flex flex-col bg-white">
        {/* HEADER: SCORES */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex gap-4">
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="flex items-center text-xs font-bold text-pink-600 uppercase tracking-wider">
                <Smile className="w-3 h-3 mr-1" /> Sourire / Attitude
              </span>
              <span className="text-xs font-bold text-slate-600">{scores.sourire}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${scores.sourire}%` }}
              ></div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="flex items-center text-xs font-bold text-purple-600 uppercase tracking-wider">
                <Award className="w-3 h-3 mr-1" /> Compétence
              </span>
              <span className="text-xs font-bold text-slate-600">{scores.competence}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${scores.competence}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {/* History */}
          {history.map((item, index) => (
            <div key={index} className="space-y-4 opacity-70 hover:opacity-100 transition-opacity">
              {/* Manager Question (History) */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
                <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none text-slate-700 text-sm shadow-sm max-w-[85%]">
                  <p className="font-bold text-xs text-slate-400 mb-1">{item.speaker}</p>
                  {item.question}
                </div>
              </div>

              {/* User Answer (History) */}
              <div className="flex gap-3 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                </div>
                <div className="bg-pink-50 p-3 rounded-2xl rounded-tr-none text-slate-800 text-sm shadow-sm border border-pink-100 max-w-[85%]">
                  {item.answer}
                </div>
              </div>

              {/* Feedback */}
              <div className="flex justify-center">
                <div
                  className={`text-xs px-3 py-1 rounded-full flex items-center gap-2 ${item.isCorrect ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}
                >
                  {item.isCorrect ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {item.feedback}
                </div>
              </div>

              <div className="border-b border-slate-50 w-1/2 mx-auto"></div>
            </div>
          ))}

          {/* Current Question */}
          {gameState === "playing" && (
            <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="w-10 h-10 rounded-full bg-purple-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div className="bg-white border-2 border-purple-50 p-4 rounded-2xl rounded-tl-none text-slate-800 shadow-md">
                <p className="font-bold text-xs text-purple-400 mb-1 uppercase tracking-wide">
                  {SCENARIO[currentStep].speaker}
                </p>
                <p className="text-lg leading-relaxed">{SCENARIO[currentStep].text}</p>
              </div>
            </div>
          )}

          {/* End Game Messages */}
          {gameState !== "playing" && (
            <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
              <h3 className={`text-2xl font-bold mb-2 ${gameState === "won" ? "text-green-600" : "text-red-500"}`}>
                {gameState === "won" ? "FELICITATIONS !" : "Désolée..."}
              </h3>
              <p className="text-slate-600 mb-6">
                {gameState === "won"
                  ? "Vous avez le poste. Bienvenue dans l'équipe !"
                  : "Votre profil ne correspond pas encore à nos standards de luxe."}
              </p>
              <button
                onClick={restartGame}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors font-semibold"
              >
                <RefreshCw className="w-4 h-4" /> Recommencer l'entretien
              </button>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT AREA */}
        {gameState === "playing" && (
          <div className="p-6 bg-white border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">Votre réponse :</p>
            <div className="space-y-3">
              {SCENARIO[currentStep].options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option)}
                  className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-pink-300 hover:bg-pink-50/50 transition-all duration-200 group flex items-start gap-3"
                >
                  <span className="shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center group-hover:bg-pink-200 group-hover:text-pink-700 transition-colors">
                    {option.id}
                  </span>
                  <span className="text-slate-700 group-hover:text-slate-900 text-sm font-medium">{option.text}</span>
                  <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-pink-400 opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
