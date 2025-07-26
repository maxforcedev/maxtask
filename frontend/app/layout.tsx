import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TaskProvider } from "@/components/task-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MaxTask - Sistema de Gerenciamento de Tarefas",
  description: "Gerencie suas tarefas de forma eficiente e produtiva",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TaskProvider>{children}</TaskProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
