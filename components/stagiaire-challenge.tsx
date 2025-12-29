"use client"

import { useState } from "react"
import {
  Clock,
  Frown,
  Hourglass,
  ClipboardList,
  CheckCircle,
  XCircle,
  Trophy,
  ArrowRight,
  RotateCcw,
} from "lucide-react"

const StagiaireChallenge = () => {
  // Data transcribed from the video
  const scenarios = [
    {
      id: 1,
      title: "Le Retard",
      icon: <Clock className="w-10 h-10 text-pink-500" />,
      description: "Il est 8h55. Vous commencez à 9h00 mais le bus a du retard. Vous arriverez à 9h10.",
      options: [
        {
          id: "a",
          text: "Courir sans prévenir",
          isCorrect: false,
          feedbackTitle: "Aïe...",
          feedbackText: "Manque de professionnalisme. Prévenir est la base du respect.",
        },
        {
          id: "b",
          text: "Appeler pour prévenir",
          isCorrect: true,
          feedbackTitle: "Excellent réflexe !",
          feedbackText: "Prévenir montre votre sérieux et permet à l'équipe de s'organiser.",
        },
      ],
    },
    {
      id: 2,
      title: "Critique du Tuteur",
      icon: <Frown className="w-10 h-10 text-pink-500" />,
      description: "Votre tuteur vous reprend sèchement sur votre façon de plier les serviettes.",
      options: [
        {
          id: "a",
          text: "Bouder dans son coin",
          isCorrect: false,
          feedbackTitle: "Mauvaise attitude",
          feedbackText: "La susceptibilité empêche l'apprentissage.",
        },
        {
          id: "b",
          text: "Accepter et corriger",
          isCorrect: true,
          feedbackTitle: "Attitude Pro !",
          feedbackText: "Accepter la critique est essentiel pour progresser.",
        },
      ],
    },
    {
      id: 3,
      title: "Temps Mort",
      icon: <Hourglass className="w-10 h-10 text-pink-500" />,
      description: "Il n'y a pas de clients. Le salon est calme. Votre tuteur est au téléphone.",
      options: [
        {
          id: "a",
          text: "Regarder son portable",
          isCorrect: false,
          feedbackTitle: "Aïe...",
          feedbackText: "Le portable est interdit en présence de la clientèle, même virtuelle.",
        },
        {
          id: "b",
          text: "Ranger le poste de travail",
          isCorrect: true,
          feedbackTitle: "Initiative validée !",
          feedbackText: "Un stagiaire pro trouve toujours quelque chose d'utile à faire.",
        },
      ],
    },
    {
      id: 4,
      title: "Fin de Stage",
      icon: <ClipboardList className="w-10 h-10 text-pink-500" />,
      description: "C'est votre dernier jour. Que faites-vous avant de partir ?",
      options: [
        {
          id: "a",
          text: "Partir discrètement",
          isCorrect: false,
          feedbackTitle: "Occasion manquée",
          feedbackText: "Le bilan est crucial pour valider vos acquis.",
        },
        {
          id: "b",
          text: "Demander le bilan d'évaluation",
          isCorrect: true,
          feedbackTitle: "Excellent réflexe !",
          feedbackText: "C'est la dernière étape indispensable pour valider votre stage.",
        },
      ],
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [currentFeedback, setCurrentFeedback] = useState(null)
  const [score, setScore] = useState(0)
  const [gameStatus, setGameStatus] = useState("intro") // intro, playing, finished

  const currentScenario = scenarios[currentIndex]

  const handleStart = () => {
    setGameStatus("playing")
  }

  const handleChoice = (option) => {
    setCurrentFeedback({
      isCorrect: option.isCorrect,
      title: option.feedbackTitle,
      text: option.feedbackText,
    })
    setShowFeedback(true)

    if (option.isCorrect) {
      setScore((prev) => prev + 1)
    }
  }

  const handleNext = () => {
    setShowFeedback(false)
    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setGameStatus("finished")
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setScore(0)
    setGameStatus("intro")
    setShowFeedback(false)
  }

  // --- RENDERING INTRO SCREEN ---
  if (gameStatus === "intro") {
    return (
      <div className="min-h-screen bg-[#F3F1FF] flex items-start justify-center pt-12 p-4 font-sans text-slate-800">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-xl overflow-hidden p-8 text-center border-t-8 border-pink-500">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-pink-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Simulation de Stage</h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Vous allez vivre une simulation de stage professionnel. Choisissez vos réactions face à différentes
            situations du monde du travail.
          </p>
          <button
            onClick={handleStart}
            className="w-full py-4 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            Démarrer la simulation <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  // --- RENDERING FINISHED SCREEN ---
  if (gameStatus === "finished") {
    const isSuccess = score === scenarios.length
    return (
      <div className="min-h-screen bg-[#F3F1FF] flex items-start justify-center pt-12 p-4 font-sans">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-xl overflow-hidden p-8 text-center animate-in zoom-in duration-300">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${isSuccess ? "bg-green-100" : "bg-orange-100"}`}
          >
            {isSuccess ? (
              <Trophy className="w-12 h-12 text-green-600" />
            ) : (
              <RotateCcw className="w-12 h-12 text-orange-500" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {isSuccess ? "Simulation Réussie !" : "Simulation à Refaire"}
          </h2>
          <p className="text-slate-500 mb-8">
            Vous avez obtenu {score} sur {scenarios.length} bonnes réponses.
            {isSuccess ? " Vous avez les bons réflexes professionnels." : " Revoyez certains comportements."}
          </p>

          <button
            onClick={handleRestart}
            className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-semibold transition-colors"
          >
            Refaire la simulation
          </button>
        </div>
      </div>
    )
  }

  // --- RENDERING GAMEPLAY ---
  return (
    <div className="min-h-screen bg-[#F3F1FF] flex flex-col items-center justify-start pt-12 p-4 font-sans">
      {/* Header Info */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Simulation de Stage</h2>
        <p className="text-slate-500 text-sm mt-1">
          Situation {currentIndex + 1} sur {scenarios.length}
        </p>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[400px] flex flex-col relative z-10">
          {/* Card Content */}
          <div className="p-8 flex flex-col items-center text-center flex-1">
            <div className="mb-6 p-4 bg-pink-50 rounded-2xl">{currentScenario.icon}</div>

            <h3 className="text-xl font-bold text-slate-900 mb-4">{currentScenario.title}</h3>

            <p className="text-slate-600 mb-8 leading-relaxed">{currentScenario.description}</p>

            {/* Options */}
            <div className="grid grid-cols-1 gap-4 w-full mt-auto">
              {currentScenario.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option)}
                  disabled={showFeedback}
                  className="py-4 px-6 bg-white border-2 border-slate-100 hover:border-pink-200 hover:bg-pink-50 text-slate-700 font-semibold rounded-xl transition-all active:scale-95 shadow-sm text-sm"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full bg-slate-100">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-pink-600 transition-all duration-500"
              style={{ width: `${(currentIndex / scenarios.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Feedback Modal Overlay */}
        {showFeedback && currentFeedback && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-3xl animate-in fade-in duration-200">
            <div className="p-8 text-center max-w-xs">
              <div className="mb-4 flex justify-center">
                {currentFeedback.isCorrect ? (
                  <CheckCircle className="w-16 h-16 text-green-500 drop-shadow-sm" />
                ) : (
                  <XCircle className="w-16 h-16 text-red-500 drop-shadow-sm" />
                )}
              </div>

              <h3
                className={`text-xl font-bold mb-2 ${currentFeedback.isCorrect ? "text-green-700" : "text-slate-800"}`}
              >
                {currentFeedback.title}
              </h3>

              <p className="text-slate-600 mb-6 text-sm">{currentFeedback.text}</p>

              <button
                onClick={handleNext}
                className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold shadow-lg hover:bg-slate-800 transition-transform active:scale-95 flex items-center gap-2 mx-auto"
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StagiaireChallenge
