"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Wordmark } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { OptionButton } from "@/components/wizard/option-button";
import { ProgressBar } from "@/components/wizard/progress-bar";
import { decodeAnswers, resultHref, wizardHref } from "@/lib/engine";
import { joinMulti, splitMulti } from "@/lib/engine/profile";
import {
  getWizardProgress,
  pruneHiddenAnswers,
  QUESTIONS_BY_ID,
  questionCopy,
  walkQuestionTree,
} from "@/lib/questions";
import type { Answers } from "@/lib/types";
import { SECTION_LABELS } from "@/lib/types";

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
  const [draftMulti, setDraftMulti] = useState<string[] | null>(null);

  const walk = useMemo(() => walkQuestionTree(answers), [answers]);
  const progress = useMemo(() => getWizardProgress(answers), [answers]);
  const question = reviewId
    ? (QUESTIONS_BY_ID[reviewId] ?? walk.pending)
    : walk.pending;
  const copy = question
    ? questionCopy(question, answers.role)
    : { prompt: "", helper: undefined };

  useEffect(() => {
    if (walk.complete && !reviewId) {
      router.replace(resultHref(walk.resolved));
    }
  }, [reviewId, router, walk.complete, walk.resolved]);

  useEffect(() => {
    if (question?.kind === "multi") {
      setDraftMulti(splitMulti(answers[question.id] ?? ""));
    } else {
      setDraftMulti(null);
    }
  }, [answers, question]);

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

  const commitAnswer = useCallback((questionId: string, optionId: string) => {
    setReviewId(null);
    setAnswers((current) =>
      pruneHiddenAnswers({ ...current, [questionId]: optionId }),
    );
  }, []);

  const toggleMulti = useCallback(
    (optionId: string, exclusive: boolean | undefined) => {
      setDraftMulti((current) => {
        const selected = current ?? [];
        if (exclusive) {
          return selected.includes(optionId) ? [] : [optionId];
        }
        const withoutExclusive = selected.filter((id) => {
          const option = question?.options.find((item) => item.id === id);
          return !option?.exclusive;
        });
        if (withoutExclusive.includes(optionId)) {
          return withoutExclusive.filter((id) => id !== optionId);
        }
        return [...withoutExclusive, optionId];
      });
    },
    [question],
  );

  const continueMulti = useCallback(() => {
    if (!question) {
      return;
    }
    const min = question.minSelections ?? 1;
    const selected = draftMulti ?? [];
    if (selected.length < min) {
      return;
    }
    commitAnswer(question.id, joinMulti(selected));
  }, [commitAnswer, draftMulti, question]);

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
      if (question.kind === "multi" && event.key === "Enter") {
        event.preventDefault();
        continueMulti();
        return;
      }
      const digit = Number(event.key);
      if (digit >= 1 && digit <= question.options.length) {
        event.preventDefault();
        const option = question.options[digit - 1];
        if (!option) {
          return;
        }
        if (question.kind === "multi") {
          toggleMulti(option.id, option.exclusive);
        } else {
          commitAnswer(question.id, option.id);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [commitAnswer, continueMulti, goBack, question, toggleMulti]);

  if ((walk.complete && !reviewId) || !question) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-muted-foreground">
        Scoring your stack…
      </div>
    );
  }

  const selectedIds =
    question.kind === "multi"
      ? (draftMulti ?? splitMulti(answers[question.id] ?? ""))
      : answers[question.id]
        ? [answers[question.id]]
        : [];
  const min = question.minSelections ?? 1;
  const canContinue =
    question.kind !== "multi" || selectedIds.filter(Boolean).length >= min;
  const sectionName = question.section
    ? SECTION_LABELS[question.section]
    : "Questions";

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Wordmark />
        <ThemeToggle />
      </header>
      <div className="px-5 sm:px-8">
        <div className="mx-auto max-w-xl">
          <ProgressBar
            value={progress.ratio}
            label={`Section ${progress.sectionIndex} of ${progress.sectionTotal} · ${sectionName} · Question ${progress.sectionStep} of ${progress.sectionCount} (${progress.step} of ${progress.total})`}
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
            {copy.prompt}
          </h1>
          {copy.helper ? (
            <p className="mt-3 max-w-prose text-muted-foreground">
              {copy.helper}
            </p>
          ) : null}
          {question.kind === "multi" ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Select all that apply.
            </p>
          ) : null}
          <fieldset className="mt-8 m-0 border-0 p-0">
            <legend className="sr-only">{copy.prompt}</legend>
            <div className="flex flex-col gap-2">
              {question.options.map((option, index) => (
                <OptionButton
                  key={option.id}
                  name={question.id}
                  value={option.id}
                  index={index + 1}
                  label={option.label}
                  description={option.description}
                  multi={question.kind === "multi"}
                  selected={selectedIds.includes(option.id)}
                  onSelect={() => {
                    if (question.kind === "multi") {
                      toggleMulti(option.id, option.exclusive);
                    } else {
                      commitAnswer(question.id, option.id);
                    }
                  }}
                />
              ))}
            </div>
          </fieldset>
          {question.kind === "multi" ? (
            <Button
              type="button"
              className="mt-8"
              disabled={!canContinue}
              onClick={continueMulti}
            >
              Continue
            </Button>
          ) : null}
          <p className="mt-8 font-mono text-xs text-muted-foreground">
            Press 1–{question.options.length} to choose
            {question.kind === "multi" ? " · Enter to continue" : ""} · Esc to
            go back
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
