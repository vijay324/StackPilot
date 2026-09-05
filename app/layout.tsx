import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "StackPilot",
    template: "%s · StackPilot",
  },
  description: "Pick your stack. Scale with confidence.",
  applicationName: "StackPilot",
  authors: [{ name: "StackPilot contributors" }],
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: runs before paint to restore theme
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem("stackpilot-theme")==="light")document.documentElement.classList.remove("dark")}catch(e){}})()`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
