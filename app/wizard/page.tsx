import type { Metadata } from "next";
import { Suspense } from "react";
import { WizardFlow } from "@/components/wizard/wizard-flow";

export const metadata: Metadata = {
  title: "Questionnaire",
  description:
    "Answer the questionnaire. StackPilot scores a catalog of real-world components.",
  robots: { index: false, follow: false },
};

function WizardFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center text-sm text-muted-foreground">
      Loading questionnaire…
    </div>
  );
}

export default function WizardPage() {
  return (
    <Suspense fallback={<WizardFallback />}>
      <WizardFlow />
    </Suspense>
  );
}
