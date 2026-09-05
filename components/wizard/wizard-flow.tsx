"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Wordmark } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { OptionButton } from "@/components/wizard/option-button";
import { ProgressBar } from "@/components/wizard/progress-bar";
import {
  getWizardProgress,
  QUESTIONS_BY_ID,
  walkQuestionTree,
} from "@/lib/questions";
import { decodeAnswers, resultHref, wizardHref } from "@/lib/scoring";
import type { Answers } from "@/lib/types";

function answersFromParam(raw: string | null): Answers {
  if (!raw) {
    return {};
  }
  try {
    return decodeAnswers(raw);
  } catch {
    return {};
  }
}

export function WizardFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [answers, setAnswers] = useState<Answers>(() =>
    answersFromParam(searchParams.get("a")),
  );
  const [reviewId, setReviewId] = useState<string | null>(null);

  const walk = useMemo(() => walkQuestionTree(answers), [answers]);
  const progress = useMemo(() => getWizardProgress(answers), [answers]);
  const question = reviewId
    ? (QUESTIONS_BY_ID[reviewId] ?? walk.pending)
    : walk.pending;

  useEffect(() => {
    if (walk.complete && !reviewId) {
      router.replace(resultHref(walk.resolved));
    }
  }, [reviewId, router, walk.complete, walk.resolved]);

  const goBack = useCallback(() => {
    const currentId = reviewId ?? walk.pending?.id;
    const visible = walk.visible;
    const currentIndex = visible.findIndex((item) => item.id === currentId);
    if (currentIndex <= 0) {
      router.push("/");
      return;
    }
    const previous = visible[currentIndex - 1];
    if (previous) {
      setReviewId(previous.id);
    }
  }, [reviewId, router, walk.pending?.id, walk.visible]);

  const selectOption = useCallback((questionId: string, optionId: string) => {
    setReviewId(null);
    setAnswers((current) => ({ ...current, [questionId]: optionId }));
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        goBack();
        return;
      }
      if (!question) {
        return;
      }
      const digit = Number(event.key);
      if (digit >= 1 && digit <= question.options.length) {
        event.preventDefault();
        const option = question.options[digit - 1];
        if (option) {
          selectOption(question.id, option.id);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goBack, question, selectOption]);

  if ((walk.complete && !reviewId) || !question) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-muted-foreground">
        Scoring your stack…
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Wordmark />
        <ThemeToggle />
      </header>
      <div className="px-5 sm:px-8">
        <div className="mx-auto max-w-xl">
          <ProgressBar
            value={
              question
                ? Math.max(
                    0,
                    walk.visible.findIndex((item) => item.id === question.id),
                  ) / Math.max(progress.total, 1)
                : progress.ratio
            }
            label={`Question ${
              question
                ? walk.visible.findIndex((item) => item.id === question.id) + 1
                : progress.step
            } of ${progress.total}`}
          />
        </div>
      </div>
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-5 py-10 sm:px-8 sm:py-16">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={goBack}
          className="-ml-2 mb-8 w-fit"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </Button>
        <div
          key={question.id}
          className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300"
        >
          <h1 className="text-3xl font-medium tracking-tight text-balance sm:text-4xl">
            {question.prompt}
          </h1>
          {question.helper ? (
            <p className="mt-3 max-w-prose text-muted-foreground">
              {question.helper}
            </p>
          ) : null}
          <fieldset className="mt-8 m-0 border-0 p-0">
            <legend className="sr-only">{question.prompt}</legend>
            <div className="flex flex-col gap-2">
              {question.options.map((option, index) => (
                <OptionButton
                  key={option.id}
                  name={question.id}
                  value={option.id}
                  index={index + 1}
                  label={option.label}
                  description={option.description}
                  selected={answers[question.id] === option.id}
                  onSelect={() => selectOption(question.id, option.id)}
                />
              ))}
            </div>
          </fieldset>
          <p className="mt-8 font-mono text-xs text-muted-foreground">
            Press 1–{question.options.length} to choose · Esc to go back
          </p>
        </div>
        <p className="sr-only">
          Continue from {wizardHref(answers)} if you refresh this page with a
          copied URL.
        </p>
      </main>
    </div>
  );
}
