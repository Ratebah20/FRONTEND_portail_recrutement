import "@/styles/globals.css"
import type React from "react"
import { QueryProvider } from "@/src/providers/QueryProvider"
import { ThemeProvider } from "@/components/theme-provider"
import { APIDebug } from "@/src/components/debug/APIDebug"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portail de Recrutement IA",
  description: "Système de gestion des candidatures avec analyse IA",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <APIDebug />
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}