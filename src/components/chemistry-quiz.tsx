"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EquationBalancer } from "@/components/equation-balancer"
import { DipoleArrows } from "@/components/dipole-arrows"
import { MultipleChoice } from "@/components/multiple-choice"
import { TextInput } from "@/components/text-input"
import { Progress } from "@/components/ui/progress"
import { PlayCircle, PauseCircle, RotateCcw } from "lucide-react"

// Define the question types and structure
type QuestionType = "text" | "multiple-choice" | "equation-balance" | "dipole-arrow"

interface Question {
  id: string
  type: QuestionType
  timeToShow: number // in seconds
  timeToReview: number // in seconds
  question: string
  options?: string[]
  correctAnswer?: string
  explanation?: string
}

// Sample questions
const questions: Question[] = [
  {
    id: "q1",
    type: "text",
    timeToShow: 5, // Show after 5 seconds
    timeToReview: 40, // Review after 40 seconds
    question: "What is the chemical formula for water?",
    correctAnswer: "H2O",
    explanation: "Water consists of two hydrogen atoms bonded to one oxygen atom.",
  },
  {
    id: "q2",
    type: "multiple-choice",
    timeToShow: 15, // Show after 15 seconds
    timeToReview: 50, // Review after 50 seconds
    question: "Which of the following is a noble gas?",
    options: ["Oxygen", "Nitrogen", "Helium", "Chlorine"],
    correctAnswer: "Helium",
    explanation: "Helium (He) is a noble gas in Group 18 of the periodic table.",
  },
  {
    id: "q3",
    type: "equation-balance",
    timeToShow: 25, // Show after 25 seconds
    timeToReview: 60, // Review after 60 seconds
    question: "Balance the following chemical equation: H₂ + O₂ → H₂O",
    correctAnswer: "2H₂ + O₂ → 2H₂O",
    explanation: "We need 4 hydrogen atoms and 2 oxygen atoms on each side.",
  },
  {
    id: "q4",
    type: "dipole-arrow",
    timeToShow: 35, // Show after 35 seconds
    timeToReview: 70, // Review after 70 seconds
    question: "Draw the dipole arrow for the H-Cl bond.",
    correctAnswer: "H→Cl",
    explanation: "Chlorine is more electronegative than hydrogen, so the dipole arrow points from H to Cl.",
  },
]

export function ChemistryQuiz() {
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [showingReview, setShowingReview] = useState(false)
  const [reviewQuestion, setReviewQuestion] = useState<Question | null>(null)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [quizComplete, setQuizComplete] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const maxTime = 80 // Total duration in seconds
  // In the ChemistryQuiz component, add a new state to track answered questions
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([])

  // Start/stop the timer
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev + 1

          // Check if we've reached the end
          if (newTime >= maxTime) {
            setIsRunning(false)
            setQuizComplete(true)
            return maxTime
          }

          return newTime
        })
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRunning])

  // Check if we need to show a question or review
  // Modify the useEffect that checks for questions to show
  // Replace the existing useEffect that checks for questions with this:
  useEffect(() => {
    // Check for questions to show - only show unanswered questions
    const questionToShow = questions.find((q) => q.timeToShow === timer && !answeredQuestions.includes(q.id))

    if (questionToShow && !showingReview) {
      setCurrentQuestion(questionToShow)
      setIsRunning(false)
    }

    // Check for reviews to show
    const reviewToShow = questions.find((q) => q.timeToReview === timer)
    if (reviewToShow && !currentQuestion) {
      setReviewQuestion(reviewToShow)
      setShowingReview(true)
      setTimeout(() => {
        setShowingReview(false)
        setReviewQuestion(null)
      }, 5000) // Show review for 5 seconds
    }
  }, [timer, currentQuestion, showingReview, answeredQuestions])

  // Handle answer submission
  // Modify the handleAnswerSubmit function to mark questions as answered
  // Replace the existing handleAnswerSubmit function with this:
  const handleAnswerSubmit = (answer: string) => {
    if (currentQuestion) {
      // Save the answer
      setUserAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: answer,
      }))

      // Mark question as answered
      setAnsweredQuestions((prev) => [...prev, currentQuestion.id])

      // Close the question and resume
      setCurrentQuestion(null)
      setIsRunning(true)
    }
  }

  // Reset the quiz
  // Also update the resetQuiz function to clear answered questions
  // Replace the existing resetQuiz function with this:
  const resetQuiz = () => {
    setTimer(0)
    setIsRunning(false)
    setCurrentQuestion(null)
    setShowingReview(false)
    setReviewQuestion(null)
    setUserAnswers({})
    setQuizComplete(false)
    setAnsweredQuestions([])
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="text-center">Chemistry Quiz</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timer display */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-medium">
            Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsRunning(!isRunning)}
              disabled={quizComplete || !!currentQuestion}
            >
              {isRunning ? <PauseCircle className="h-5 w-5" /> : <PlayCircle className="h-5 w-5" />}
            </Button>
            <Button variant="outline" size="icon" onClick={resetQuiz}>
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <Progress value={(timer / maxTime) * 100} className="h-2" />

        {/* Current question */}
        {currentQuestion && (
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">{currentQuestion.question}</h3>

            {currentQuestion.type === "text" && <TextInput onSubmit={handleAnswerSubmit} />}

            {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
              <MultipleChoice options={currentQuestion.options} onSelect={handleAnswerSubmit} />
            )}

            {currentQuestion.type === "equation-balance" && (
              <EquationBalancer
                equation={currentQuestion.question.replace("Balance the following chemical equation: ", "")}
                onSubmit={handleAnswerSubmit}
              />
            )}

            {currentQuestion.type === "dipole-arrow" && <DipoleArrows onSubmit={handleAnswerSubmit} />}
          </div>
        )}

        {/* Review section */}
        {showingReview && reviewQuestion && (
          <div className="p-4 bg-blue-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{reviewQuestion.question}</h3>
            <div className="mb-2">
              <span className="font-medium">Your answer: </span>
              <span className="text-blue-700">{userAnswers[reviewQuestion.id] || "Not answered"}</span>
            </div>
            <div className="mb-2">
              <span className="font-medium">Correct answer: </span>
              <span className="text-green-700">{reviewQuestion.correctAnswer}</span>
            </div>
            {reviewQuestion.explanation && <div className="text-gray-700 italic">{reviewQuestion.explanation}</div>}
          </div>
        )}

        {/* Quiz complete message */}
        {quizComplete && (
          <div className="p-4 bg-green-50 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">Quiz Complete!</h3>
            <p>You've completed the chemistry quiz. Review your answers below.</p>

            <div className="mt-4 space-y-4">
              {questions.map((q) => (
                <div key={q.id} className="p-3 bg-white rounded border">
                  <h4 className="font-medium">{q.question}</h4>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="text-sm text-gray-500">Your answer:</span>
                      <div className="font-medium">{userAnswers[q.id] || "Not answered"}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Correct answer:</span>
                      <div className="font-medium text-green-600">{q.correctAnswer}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm text-gray-500">
          {!isRunning && !currentQuestion && !quizComplete
            ? "Press play to start the quiz"
            : isRunning
              ? "Questions will appear automatically"
              : currentQuestion
                ? "Answer the question to continue"
                : "Quiz complete"}
        </div>
      </CardFooter>
    </Card>
  )
}

