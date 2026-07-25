import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, XCircle, RotateCcw, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { VocabularyEntry, QuizQuestion } from '../types';

interface QuizViewProps {
  entries: VocabularyEntry[];
}

export const QuizView: React.FC<QuizViewProps> = ({ entries }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Generate a set of 5 random quiz questions from the dataset
  const generateQuiz = () => {
    if (entries.length < 4) return;

    const shuffled = [...entries].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);

    const generatedQuestions: QuizQuestion[] = selected.map((item, index) => {
      const isEnToTa = index % 2 === 0;

      if (isEnToTa) {
        const correctAnswer = item.tamilDefinition;
        const distractorsData = entries
          .filter((e) => e.id !== item.id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
          
        const distractors = distractorsData.map((e) => e.tamilDefinition);

        const options = [correctAnswer, ...distractors].sort(() => 0.5 - Math.random());
        
        let explanation = `✅ Correct: "${item.word}" means "${item.tamilDefinition}".\n`;
        distractorsData.forEach(d => {
          explanation += `❌ "${d.tamilDefinition}" is the meaning for "${d.word}".\n`;
        });

        return {
          id: `q-${item.id}-${index}`,
          type: 'en-to-ta',
          questionWord: item.word,
          correctAnswer,
          options,
          explanation,
          tamilTranslation: item.tamilDefinition,
          entryId: item.id,
        };
      } else {
        const correctAnswer = item.word;
        const distractorsData = entries
          .filter((e) => e.id !== item.id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
          
        const distractors = distractorsData.map((e) => e.word);

        const options = [correctAnswer, ...distractors].sort(() => 0.5 - Math.random());

        let explanation = `✅ Correct: "${item.tamilDefinition}" translates to "${item.word}".\n`;
        distractorsData.forEach(d => {
          explanation += `❌ "${d.word}" means "${d.tamilDefinition}".\n`;
        });

        return {
          id: `q-${item.id}-${index}`,
          type: 'ta-to-en',
          questionWord: item.tamilDefinition,
          correctAnswer,
          options,
          explanation,
          tamilTranslation: item.tamilDefinition,
          entryId: item.id,
        };
      }
    });

    setQuestions(generatedQuestions);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsSubmitted(false);
    setQuizCompleted(false);
  };

  useEffect(() => {
    generateQuiz();
  }, [entries]);

  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-stone-500 font-serif text-sm">Generating quiz questions...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectOption = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || isSubmitted) return;
    setIsSubmitted(true);
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setQuizCompleted(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-2 px-2 sm:px-4 animate-fadeIn">
      {/* Quiz Header */}
      <div className="bg-[#0f0f0f] rounded-xl border border-stone-800/80 shadow-md p-3 mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-950 text-teal-300 border border-teal-900/40 flex items-center justify-center font-bold">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-serif font-bold text-stone-100">
              Vocabulary Quiz
            </h2>
            <p className="text-[10px] text-stone-500">
              Verify your bilingual translation accuracy
            </p>
          </div>
        </div>

        <button
          onClick={generateQuiz}
          className="flex items-center space-x-1 text-xs font-semibold text-teal-300 bg-teal-950/20 hover:bg-teal-950/40 border border-teal-900/20 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer min-h-[34px]"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          <span>New Quiz</span>
        </button>
      </div>

      {!quizCompleted ? (
        <div className="bg-[#0f0f0f] rounded-xl border border-stone-800/80 shadow-md p-4 sm:p-5 space-y-4">
          {/* Question Indicator & Score */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500 pb-2 border-b border-stone-900">
            <span>
              Question {currentQuestionIndex + 1} / {questions.length}
            </span>
            <span className="text-teal-400 font-serif">
              Score: {score} / {questions.length}
            </span>
          </div>

          {/* Question Title */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider font-serif block">
              {currentQuestion.type === 'en-to-ta'
                ? 'Select the correct Tamil meaning for:'
                : 'Select the correct English word for:'}
            </span>

            <div className="bg-[#141414] p-3 rounded-lg border border-stone-900 text-center">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
                {currentQuestion.questionWord}
              </h3>
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-2">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === currentQuestion.correctAnswer;

              let optionStyle = 'bg-stone-950 border-stone-900 text-stone-300 hover:bg-teal-950/20 hover:border-teal-500/20';

              if (isSubmitted) {
                if (isCorrect) {
                  optionStyle = 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 font-bold ring-1 ring-emerald-500/20';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'bg-rose-950/40 border-rose-800/60 text-rose-300 font-bold';
                } else {
                  optionStyle = 'bg-stone-950/30 border-stone-950 text-stone-600 opacity-50';
                }
              } else if (isSelected) {
                optionStyle = 'bg-teal-950/40 border-teal-500/50 text-teal-200 font-bold ring-1 ring-teal-500/30';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(option)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-sm sm:text-base font-serif flex items-start justify-between cursor-pointer min-h-[46px] ${optionStyle}`}
                >
                  <span className="leading-relaxed flex-1 pr-3">{option}</span>
                  {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                  {isSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Box when Submitted */}
          {isSubmitted && (
            <div className="bg-[#141414] p-3 rounded-lg border border-stone-900 space-y-1">
              <span className="text-[10px] font-bold text-teal-300 font-serif flex items-center">
                <HelpCircle className="w-3.5 h-3.5 text-teal-400 mr-1" />
                Explanation:
              </span>
              <p className="text-xs text-stone-400 font-serif leading-relaxed whitespace-pre-line">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-1.5 flex justify-end">
            {!isSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOption}
                className={`px-5 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer min-h-[38px] ${
                  selectedOption
                    ? 'bg-teal-300 text-stone-950 hover:bg-teal-200 shadow-sm'
                    : 'bg-stone-950 text-stone-600 border border-stone-900 cursor-not-allowed'
                }`}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-teal-300 text-stone-950 hover:bg-teal-200 font-bold text-xs transition-all shadow-sm cursor-pointer min-h-[38px]"
              >
                <span>{currentQuestionIndex + 1 === questions.length ? 'View Results' : 'Next Question'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Summary Card */
        <div className="bg-[#0f0f0f] rounded-xl border border-stone-800/80 shadow-md p-6 text-center space-y-4">
          <div className="w-12 h-12 bg-teal-950/60 text-teal-300 border border-teal-900/30 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-xl font-serif font-bold text-stone-100 mb-0.5">
              Quiz Completed!
            </h3>
            <p className="text-stone-500 text-xs">
              Excellent job testing your bilingual proficiency.
            </p>
          </div>

          <div className="bg-[#141414] p-4 rounded-xl border border-stone-900 max-w-xs mx-auto">
            <span className="text-[10px] font-bold text-stone-500 uppercase font-serif block mb-0.5">
              FINAL SCORE
            </span>
            <div className="text-3xl font-serif font-bold text-teal-300">
              {score} / {questions.length}
            </div>
            <p className="text-[10px] font-medium text-teal-400 mt-1 font-serif">
              Accuracy: {Math.round((score / questions.length) * 100)}%
            </p>
          </div>

          <button
            onClick={generateQuiz}
            className="px-5 py-2 bg-teal-300 text-stone-950 font-bold rounded-lg text-xs hover:bg-teal-200 transition-colors cursor-pointer min-h-[38px]"
          >
            Retake Quiz
          </button>
        </div>
      )}
    </div>
  );
};
