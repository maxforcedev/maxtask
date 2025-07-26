"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Download,
  Edit,
  FolderOpen,
  Paperclip,
  Clock,
  AlertCircle,
  Trash2,
} from "lucide-react"
import { useTaskContext } from "@/components/task-context"
import { useToast } from "@/hooks/use-toast"
import { EditTaskDialog } from "@/app/components/edit-task-dialog"

// Dados mock detalhados da tarefa
const getTaskDetails = (id: number) => ({
  id,
  title: "Implementar sistema de autenticação",
  description:
    "Desenvolver um sistema completo de autenticação com login, registro, recuperação de senha e verificação de email. O sistema deve ser seguro, escalável e seguir as melhores práticas de segurança.",
  status: "Em Andamento",
  project: "Mobile App",
  projectColor: "bg-green-500",
  tags: ["Backend", "Frontend", "Urgente"],
  deadline: "2024-01-20",
  createdAt: "2024-01-10",
  subtasks: [
    { id: 1, title: "Configurar JWT tokens", completed: true },
    { id: 2, title: "Criar middleware de autenticação", completed: true },
    { id: 3, title: "Implementar login social", completed: false },
    { id: 4, title: "Adicionar validação de email", completed: false },
    { id: 5, title: "Testes de segurança", completed: false },
  ],
  attachments: [
    { id: 1, name: "auth-requirements.pdf", size: "2.3 MB", type: "pdf" },
    { id: 2, name: "user-flow-diagram.png", size: "1.8 MB", type: "image" },
    { id: 3, name: "api-documentation.docx", size: "856 KB", type: "document" },
  ],
})

const projects = [
  { id: 1, name: "Website Redesign", color: "bg-blue-500" },
  { id: 2, name: "Mobile App", color: "bg-green-500" },
  { id: 3, name: "Marketing Campaign", color: "bg-purple-500" },
]

const tags = [
  { id: 1, name: "Urgente", color: "bg-red-500" },
  { id: 2, name: "Design", color: "bg-pink-500" },
  { id: 3, name: "Frontend", color: "bg-blue-500" },
  { id: 4, name: "Backend", color: "bg-green-500" },
  { id: 5, name: "Review", color: "bg-yellow-500" },
]

export default function TaskDetails() {
  const router = useRouter()
  const params = useParams()
  const { updateTask, deleteTask } = useTaskContext()
  const { toast } = useToast()
  const [task, setTask] = useState(getTaskDetails(Number(params.id)))
  const [isLoading, setIsLoading] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "A Fazer":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
      case "Em Andamento":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700"
      case "Concluídas":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return "📄"
      case "image":
        return "🖼️"
      case "document":
        return "📝"
      default:
        return "📎"
    }
  }

  const toggleSubtask = (subtaskId: number) => {
    setTask((prev) => ({
      ...prev,
      subtasks: prev.subtasks.map((subtask) =>
        subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask,
      ),
    }))

    toast({
      title: "Subtarefa atualizada",
      description: "O progresso da subtarefa foi salvo.",
    })
  }

  const markAsCompleted = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setTask((prev) => ({ ...prev, status: "Concluídas" }))
      updateTask(task.id, { status: "Concluídas" })
      toast({
        title: "Tarefa concluída! 🎉",
        description: `"${task.title}" foi marcada como concluída.`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível concluir a tarefa.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTask = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      deleteTask(task.id)
      toast({
        title: "Tarefa excluída",
        description: `"${task.title}" foi excluída com sucesso.`,
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a tarefa.",
        variant: "destructive",
      })
    }
  }

  const handleDownload = (fileName: string) => {
    toast({
      title: "Download iniciado",
      description: `Baixando ${fileName}...`,
    })
    // Simular download
  }

  const completedSubtasks = task.subtasks.filter((subtask) => subtask.completed).length
  const totalSubtasks = task.subtasks.length
  const progressPercentage = (completedSubtasks / totalSubtasks) * 100

  const isOverdue = new Date(task.deadline) < new Date() && task.status !== "Concluídas"
  const daysUntilDeadline = Math.ceil((new Date(task.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24))

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="flex-1" />
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
            onClick={() => setIsEditOpen(true)}
          >
            <Edit className="h-4 w-4" />
            Editar Tarefa
          </Button>
          {task.status !== "Concluídas" && (
            <Button onClick={markAsCompleted} className="flex items-center gap-2" disabled={isLoading}>
              <CheckCircle2 className="h-4 w-4" />
              {isLoading ? "Concluindo..." : "Marcar como Concluída"}
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-red-500 hover:text-red-700 bg-transparent"
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir tarefa</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir "{task.title}"? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteTask} className="bg-red-500 hover:bg-red-600">
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Título e Informações Principais */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-semibold">{task.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Criado em {new Date(task.createdAt).toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>
              </div>
              <Badge className={`${getStatusColor(task.status)} font-medium`}>{task.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Descrição */}
            <div>
              <h3 className="text-sm font-medium mb-2">Descrição</h3>
              <p className="text-muted-foreground leading-relaxed">{task.description}</p>
            </div>

            {/* Projeto e Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Projeto</h3>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  <div className={`w-3 h-3 rounded-full ${task.projectColor}`} />
                  <span className="text-sm font-medium">{task.project}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tagName) => {
                    const tag = tags.find((t) => t.name === tagName)
                    return (
                      <Badge key={tagName} className={`${tag?.color || "bg-gray-500"} text-white border-0`}>
                        {tagName}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Prazo */}
            <div>
              <h3 className="text-sm font-medium mb-3">Prazo de Entrega</h3>
              <div
                className={`flex items-center gap-2 p-3 rounded-lg ${
                  isOverdue ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300" : "bg-muted"
                }`}
              >
                {isOverdue ? (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <Clock className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm font-medium">
                  {new Date(task.deadline).toLocaleDateString("pt-BR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                {!isOverdue && daysUntilDeadline >= 0 && (
                  <span className="text-xs text-muted-foreground">
                    ({daysUntilDeadline === 0 ? "Hoje" : `${daysUntilDeadline} dias restantes`})
                  </span>
                )}
                {isOverdue && (
                  <span className="text-xs text-red-600 font-medium dark:text-red-400">
                    Atrasado há {Math.abs(daysUntilDeadline)} dias
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subtarefas */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Subtarefas</CardTitle>
              <div className="text-sm text-muted-foreground">
                {completedSubtasks} de {totalSubtasks} concluídas
              </div>
            </div>
            {/* Barra de Progresso */}
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {task.subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <Checkbox
                    checked={subtask.completed}
                    onCheckedChange={() => toggleSubtask(subtask.id)}
                    className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                  <span className={`flex-1 text-sm ${subtask.completed ? "line-through text-muted-foreground" : ""}`}>
                    {subtask.title}
                  </span>
                  {subtask.completed && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Anexos */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Paperclip className="h-5 w-5" />
              Anexos ({task.attachments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {task.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="text-2xl">{getFileIcon(attachment.type)}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{attachment.name}</div>
                    <div className="text-xs text-muted-foreground">{attachment.size}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 bg-transparent"
                    onClick={() => handleDownload(attachment.name)}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <EditTaskDialog open={isEditOpen} onOpenChange={setIsEditOpen} task={task} projects={projects} tags={tags} />
    </div>
  )
}
