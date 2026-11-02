import React, { useState } from 'react';
import {
  Brain,
  RotateCw,
  Sparkles,
  Plus,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  Award,
  BookOpen,
  X,
  AlertCircle
} from 'lucide-react';
import { calculateNextReview } from '../utils/engine.js';

export const FlashcardsPage = ({
  flashcards = [],
  onAddCard,
  onReviewCard,
  darkMode,
}) => {
  const [selectedDeck, setSelectedDeck] = useState('ALL');
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [newCardModalOpen, setNewCardModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // New Card Form State & Validation
  const [deckInput, setDeckInput] = useState('Architecture & Vector DB');
  const [questionInput, setQuestionInput] = useState('');
  const [answerInput, setAnswerInput] = useState('');
  const [formError, setFormError] = useState('');

  const decks = ['ALL', ...new Set(flashcards.map((c) => c.deck))];

  const filteredCards = selectedDeck === 'ALL'
    ? flashcards
    : flashcards.filter((c) => c.deck === selectedDeck);

  const currentCard = filteredCards[activeCardIndex];
  const dueCount = filteredCards.filter((card) => {
    if (card.dueDate === 'Today' || card.status === 'DUE' && !card.dueDate) return true;
    if (typeof card.dueDate !== 'string' || /^in \d+ days$/i.test(card.dueDate)) return false;
    const dueAt = Date.parse(card.dueDate);
    return Number.isFinite(dueAt) ? dueAt <= Date.now() : card.status === 'DUE';
  }).length;
  const reviewedCount = flashcards.filter((card) => Number(card.reviewCount) > 0 || Number(card.repetitions) > 0).length;
  const newCardCount = flashcards.filter((card) => !Number(card.reviewCount) && !Number(card.repetitions)).length;
  const dueLabel = (rating) => {
    const days = calculateNextReview(currentCard || {}, rating).nextReviewDays;
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  };

  const handleNextCard = async (rating) => {
    if (!currentCard || saving) return;

    const updatedReview = calculateNextReview(currentCard, rating);
    const nextDueDate = new Date();
    nextDueDate.setDate(nextDueDate.getDate() + updatedReview.nextReviewDays);
    const reviewedCard = {
      ...currentCard,
      ...updatedReview,
      dueDate: nextDueDate.toISOString(),
      status: 'SCHEDULED',
      lastReviewedAt: new Date().toISOString(),
      reviewCount: Number(currentCard.reviewCount || 0) + 1,
    };

    setSaving(true);
    setFormError('');
    try {
      await onReviewCard?.(reviewedCard);
      setIsFlipped(false);
      if (activeCardIndex + 1 < filteredCards.length) {
        setActiveCardIndex((prev) => prev + 1);
      } else {
        setSessionCompleted(true);
      }
    } catch (error) {
      setFormError(error.message || 'The review could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const handleRestart = () => {
    setActiveCardIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
  };

  const handleCreateCard = async (e) => {
    e.preventDefault();
    if (!questionInput.trim() || questionInput.trim().length < 5) {
      setFormError('Question must be at least 5 characters long.');
      return;
    }
    if (!answerInput.trim() || answerInput.trim().length < 5) {
      setFormError('Answer must be at least 5 characters long.');
      return;
    }

    const newCard = {
      id: `fc-${Date.now()}`,
      deck: deckInput.trim(),
      question: questionInput.trim(),
      answer: answerInput.trim(),
      source: 'User Created',
      repetitions: 0,
      interval: 1,
      easeFactor: 2.5,
      dueDate: 'Today',
      status: 'DUE',
    };

    setSaving(true);
    setFormError('');
    try {
      await onAddCard?.(newCard);
    } catch (error) {
      setFormError(error.message || 'The flashcard could not be saved.');
      setSaving(false);
      return;
    }
    setSaving(false);
    setQuestionInput('');
    setAnswerInput('');
    setFormError('');
    setNewCardModalOpen(false);
  };

  return (
    <div className={`p-6 max-w-6xl mx-auto space-y-6 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              ACTIVE RECALL GYM
            </span>
            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              SM-2 Algorithm
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Flashcards & Spaced Repetition</h1>
          <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Master facts, definitions, and architectural decisions captured in MindMesh.
          </p>
        </div>

        {formError && !newCardModalOpen && (
          <div className="flex items-start gap-2 rounded-xl border border-rose-800/60 bg-rose-950/30 p-3 text-xs text-rose-300" role="alert">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <button
          onClick={() => {
            setFormError('');
            setNewCardModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Card</span>
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${
          darkMode ? 'bg-[#0b0e24] border-indigo-950/80' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Due for Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400">
            {dueCount}
          </div>
          <div className={`text-[10px] mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Based on saved review dates
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${
          darkMode ? 'bg-[#0b0e24] border-indigo-950/80' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Cards Reviewed</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400">
            {reviewedCount}
          </div>
          <div className={`text-[10px] mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Cards with at least one successful repetition
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${
          darkMode ? 'bg-[#0b0e24] border-indigo-950/80' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>New Cards</span>
            <Brain className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-rose-400">
            {newCardCount}
          </div>
          <div className={`text-[10px] mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Cards without review history
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${
          darkMode ? 'bg-[#0b0e24] border-indigo-950/80' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Total Decks</span>
            <BookOpen className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-indigo-400">
            {decks.length - 1} Decks
          </div>
          <div className={`text-[10px] mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {flashcards.length} cards in vault
          </div>
        </div>
      </div>

      {/* Deck Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className={`text-xs font-semibold uppercase tracking-wider mr-1 ${
          darkMode ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Deck:
        </span>
        {decks.map((deck) => (
          <button
            key={deck}
            onClick={() => {
              setSelectedDeck(deck);
              setActiveCardIndex(0);
              setIsFlipped(false);
              setSessionCompleted(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedDeck === deck
                ? darkMode
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-indigo-600 text-white shadow-sm'
                : darkMode
                ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {deck}
          </button>
        ))}
      </div>

      {/* Main Flashcard Interactive Stage */}
      {filteredCards.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl border ${
          darkMode ? 'bg-[#090d20] border-indigo-950/80' : 'bg-white border-slate-200'
        }`}>
          <Brain className="w-12 h-12 mx-auto text-indigo-400 mb-3 opacity-60" />
          <h3 className="text-base font-bold">No flashcards in this deck</h3>
          <p className={`text-xs mt-1 max-w-sm mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Add your first question-answer memory card to start active recall training.
          </p>
          <button
            onClick={() => setNewCardModalOpen(true)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
          >
            Create Flashcard
          </button>
        </div>
      ) : sessionCompleted ? (
        <div className={`p-12 text-center rounded-2xl border ${
          darkMode ? 'bg-[#090d20] border-indigo-950/80' : 'bg-white border-slate-200'
        }`}>
          <Award className="w-16 h-16 mx-auto text-emerald-400 mb-4 animate-bounce" />
          <h2 className="text-xl font-bold">Study Session Completed!</h2>
          <p className={`text-xs mt-2 max-w-md mx-auto ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            You reviewed all {filteredCards.length} cards in this deck. Repetition intervals and ease factors have been recalibrated according to SM-2.
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-md hover:bg-indigo-500"
            >
              <RotateCw className="w-4 h-4" />
              <span>Review Deck Again</span>
            </button>
          </div>
        </div>
      ) : currentCard && (
        <div className="space-y-4">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs">
            <span className={`font-mono ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Card {activeCardIndex + 1} of {filteredCards.length}
            </span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full ${
              darkMode ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
            }`}>
              Deck: {currentCard.deck}
            </span>
          </div>
          <div className={`w-full h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
              style={{ width: `${((activeCardIndex + 1) / filteredCards.length) * 100}%` }}
            />
          </div>

          {/* Flip Card Stage */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`min-h-[280px] sm:min-h-[320px] p-8 rounded-2xl border cursor-pointer select-none transition-all duration-300 flex flex-col justify-between shadow-lg relative overflow-hidden ${
              isFlipped
                ? darkMode
                  ? 'bg-gradient-to-br from-indigo-950/70 via-[#0d122e] to-[#0a0d20] border-indigo-500/50'
                  : 'bg-gradient-to-br from-indigo-50 via-white to-violet-50 border-indigo-300'
                : darkMode
                ? 'bg-[#0a0d20] border-indigo-950/80 hover:border-indigo-600/50'
                : 'bg-white border-slate-200 hover:border-indigo-300'
            }`}
          >
            {/* Top Card Badge */}
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-semibold ${
                isFlipped
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
              }`}>
                {isFlipped ? 'ANSWER / SYNTHESIS' : 'QUESTION / PROMPT'}
              </span>

              <span className={`text-xs flex items-center gap-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <RotateCw className="w-3.5 h-3.5" />
                <span>Click card to {isFlipped ? 'flip back' : 'reveal'}</span>
              </span>
            </div>

            {/* Core Card Content */}
            <div className="my-auto py-6">
              {!isFlipped ? (
                <div className="text-center space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                    {currentCard.question}
                  </h3>
                  {currentCard.source && (
                    <p className={`text-xs italic ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Source: {currentCard.source}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-3 animate-in fade-in duration-200">
                  <p className="text-base sm:text-lg leading-relaxed font-medium">
                    {currentCard.answer}
                  </p>
                  <div className={`text-xs inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${
                    darkMode ? 'bg-indigo-900/40 text-indigo-300' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Calculated Ease: {currentCard.easeFactor} · Reps: {currentCard.repetitions}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Card Footer Hint */}
            <div className={`text-[11px] text-center ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {!isFlipped ? 'Tap to view synthesized answer' : 'Rate how easily you recalled this to adjust next review'}
            </div>
          </div>

          {/* SM-2 Rating Controls (Revealed after flip) */}
          {isFlipped ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <button
                onClick={() => handleNextCard('again')}
                disabled={saving}
                className="p-3 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold text-xs text-center transition-all"
              >
                <div className="font-bold">Again</div>
                <div className="text-[10px] opacity-75 mt-0.5">{dueLabel('again')}</div>
              </button>
              <button
                onClick={() => handleNextCard('hard')}
                disabled={saving}
                className="p-3 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold text-xs text-center transition-all"
              >
                <div className="font-bold">Hard</div>
                <div className="text-[10px] opacity-75 mt-0.5">{dueLabel('hard')}</div>
              </button>
              <button
                onClick={() => handleNextCard('good')}
                disabled={saving}
                className="p-3 rounded-xl border border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-semibold text-xs text-center transition-all"
              >
                <div className="font-bold">Good</div>
                <div className="text-[10px] opacity-75 mt-0.5">{dueLabel('good')}</div>
              </button>
              <button
                onClick={() => handleNextCard('easy')}
                disabled={saving}
                className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold text-xs text-center transition-all"
              >
                <div className="font-bold">Easy</div>
                <div className="text-[10px] opacity-75 mt-0.5">{dueLabel('easy')}</div>
              </button>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={() => setIsFlipped(true)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
              >
                Reveal Answer
              </button>
            </div>
          )}
        </div>
      )}

      {/* New Card Modal */}
      {newCardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${
            darkMode ? 'bg-[#0d1026] border-indigo-950 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-indigo-950/40 mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold">New Memory Flashcard</h3>
              </div>
              <button
                onClick={() => setNewCardModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 mb-4 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCard} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  Target Deck
                </label>
                <input
                  type="text"
                  value={deckInput}
                  onChange={(e) => setDeckInput(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-indigo-500 ${
                    darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  placeholder="e.g. Architecture & Vector DB"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  Question / Prompt
                </label>
                <textarea
                  rows={3}
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-indigo-500 resize-none ${
                    darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  placeholder="e.g. What is the cosine distance formula used in pgvector?"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  Synthesized Answer
                </label>
                <textarea
                  rows={4}
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-indigo-500 resize-none ${
                    darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  placeholder="e.g. Cosine distance = 1 - (u · v) / (||u|| * ||v||), representing angular distance between embeddings."
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewCardModalOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium ${
                    darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-xs font-semibold shadow-md"
                >
                  {saving ? 'Saving…' : 'Save Flashcard'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
