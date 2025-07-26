"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Task {
  id: number
  title: string
  description?: string
  status: "A Fazer" | "Em Andamento" | "Concluídas"
  project: string
  projectColor: string
  tags: string[]
  deadline: string
  createdAt: string
  subtasks: { completed: number; total: number }
}

interface TaskContextType {
  tasks: Task[]
  updateTask: (id: number, updates: Partial<Task>) => void
  deleteTask: (id: number) => void
  addTask: (task: Omit<Task, "id">) => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Criar wireframes da homepage",
    description: "Desenvolver wireframes detalhados para a nova homepage do site, incluindo versões desktop e mobile.",
    status: "A Fazer",
    project: "Website Redesign",
    projectColor: "bg-blue-500",
    tags: ["Design", "Urgente"],
    deadline: "2024-01-15",
    createdAt: "2024-01-10",
    subtasks: { completed: 2, total: 5 },
  },
  {
    id: 2,
    title: "Implementar sistema de autenticação",
    description:
      "Desenvolver um sistema completo de autenticação com login, registro, recuperação de senha e verificação de email.",
    status: "Em Andamento",
    project: "Mobile App",
    projectColor: "bg-green-500",
    tags: ["Backend", "Frontend"],
    deadline: "2024-01-20",
    createdAt: "2024-01-08",
    subtasks: { completed: 3, total: 4 },
  },
  {
    id: 3,
    title: "Revisar conteúdo do blog",
    description: "Revisar e otimizar todo o conteúdo do blog para SEO e engajamento.",
    status: "Concluídas",
    project: "Marketing Campaign",
    projectColor: "bg-purple-500",
    tags: ["Review"],
    deadline: "2024-01-10",
    createdAt: "2024-01-05",
    subtasks: { completed: 3, total: 3 },
  },
  {
    id: 4,
    title: "Otimizar performance da API",
    description: "Melhorar a performance da API reduzindo tempo de resposta e otimizando queries do banco de dados.",
    status: "A Fazer",
    project: "Mobile App",
    projectColor: "bg-green-500",
    tags: ["Backend"],
    deadline: "2024-01-25",
    createdAt: "2024-01-12",
    subtasks: { completed: 0, total: 3 },
  },
]

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)))
  }

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const addTask = (newTask: Omit<Task, "id">) => {
    const id = Math.max(...tasks.map((t) => t.id)) + 1
    setTasks((prev) => [...prev, { ...newTask, id }])
  }

  return <TaskContext.Provider value={{ tasks, updateTask, deleteTask, addTask }}>{children}</TaskContext.Provider>
}

export function useTaskContext() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider")
  }
  return context
}
