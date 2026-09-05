"use client";

import { useRouter } from "next/navigation";
import { OptionButton } from "@/components/wizard/option-button";
import { wizardHref } from "@/lib/engine";
import { getWizardProgress, QUESTIONS } from "@/lib/questions";

export function HeroQuestion() {
  const router = useRouter();
  const question = QUESTIONS[0];
  const progress = getWizardProgress({});

  if (!question) {
    return null;
  }

  return (
    <div>
      <p className="font-mono text-xs text-muted-foreground">
        Question 1 of {progress.total}
      </p>
      <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
        {question.prompt}
      </h2>
      <fieldset className="mt-6 m-0 border-0 p-0">
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
              onSelect={() =>
                router.push(wizardHref({ [question.id]: option.id }))
              }
            />
          ))}
        </div>
      </fieldset>
    </div>
  );
}
