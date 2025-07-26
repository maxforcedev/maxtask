"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
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
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  CheckCircle2,
  Clock,
  Edit,
  Eye,
  Filter,
  FolderOpen,
  Home,
  LogOut,
  Plus,
  Tag,
  WorkflowIcon as Tasks,
  ChevronDown,
  Trash2,
} from "lucide-react"

import { NewTaskDialog } from "./components/new-task-dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTaskContext } from "@/components/task-context"
import { useToast } from "@/hooks/use-toast"
import { EditTaskDialog } from "./components/edit-task-dialog"

// Dados mock
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

const menuItems = [
  { title: "Dashboard", icon: Home, url: "#" },
  { title: "Tarefas", icon: Tasks, url: "#", active: true },
  { title: "Projetos", icon: FolderOpen, url: "#" },
  { title: "Tags", icon: Tag, url: "#" },
]

function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Tasks className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold">MaxTask</span>
          </div>
          <ThemeToggle />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.active}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <LogOut />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

function TaskCard({ task, projects, tags }: { task: any; projects: any; tags: any }) {
  const { updateTask, deleteTask } = useTaskContext()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "A Fazer":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      case "Em Andamento":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Concluídas":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getTagColor = (tagName: string) => {
    const tag = tags.find((t) => t.name === tagName)
    return tag?.color || "bg-gray-500"
  }

  const handleCompleteTask = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simular API call
      updateTask(task.id, { status: "Concluídas" })
      toast({
        title: "Tarefa concluída!",
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
      await new Promise((resolve) => setTimeout(resolve, 300)) // Simular API call
      deleteTask(task.id)
      toast({
        title: "Tarefa excluída",
        description: `"${task.title}" foi excluída com sucesso.`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a tarefa.",
        variant: "destructive",
      })
    }
  }

  const isOverdue = new Date(task.deadline) < new Date() && task.status !== "Concluídas"

  return (
    <Card className="hover:shadow-md transition-shadow dark:hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-medium">{task.title}</CardTitle>
          <div className="flex gap-1">
            <Link href={`/task/${task.id}`}>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => setIsEditOpen(true)}>
              <Edit className="h-4 w-4" />
            </Button>
            {task.status !== "Concluídas" && (
              <Button variant="ghost" size="sm" onClick={handleCompleteTask} disabled={isLoading}>
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
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
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1">
          {task.tags.map((tagName: string) => (
            <Badge key={tagName} variant="secondary" className={`${getTagColor(tagName)} text-white text-xs`}>
              {tagName}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm">
          <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
          <div
            className={`flex items-center gap-1 ${isOverdue ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}
          >
            <Clock className="h-3 w-3" />
            <span>{new Date(task.deadline).toLocaleDateString("pt-BR")}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${task.projectColor}`} />
            <span className="text-muted-foreground">{task.project}</span>
          </div>
          <span className="text-muted-foreground">
            {task.subtasks.completed}/{task.subtasks.total} subtarefas
          </span>
        </div>
      </CardContent>
      <EditTaskDialog open={isEditOpen} onOpenChange={setIsEditOpen} task={task} projects={projects} tags={tags} />
    </Card>
  )
}

export default function MaxTask() {
  const { tasks } = useTaskContext()
  const [statusFilter, setStatusFilter] = useState<string>("Todos")
  const [projectFilter, setProjectFilter] = useState<string>("Todos")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false)

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = statusFilter === "Todos" || task.status === statusFilter
    const projectMatch = projectFilter === "Todos" || task.project === projectFilter
    const tagMatch = selectedTags.length === 0 || selectedTags.some((tag) => task.tags.includes(tag))

    return statusMatch && projectMatch && tagMatch
  })

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "A Fazer").length,
    inProgress: tasks.filter((t) => t.status === "Em Andamento").length,
    completed: tasks.filter((t) => t.status === "Concluídas").length,
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Minhas Tarefas</h1>
              <p className="text-sm text-muted-foreground">
                {taskStats.total} tarefas • {taskStats.completed} concluídas • {taskStats.inProgress} em andamento
              </p>
            </div>
            <Button onClick={() => setIsNewTaskOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </div>
        </header>

        <div className="flex-1 space-y-4 p-4">
          {/* Filtros */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filtros:</span>
            </div>

            {/* Filtro de Status */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Status: {statusFilter}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("Todos")}>Todos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("A Fazer")}>A Fazer</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Em Andamento")}>Em Andamento</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Concluídas")}>Concluídas</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filtro de Projeto */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Projeto: {projectFilter}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setProjectFilter("Todos")}>Todos</DropdownMenuItem>
                {projects.map((project) => (
                  <DropdownMenuItem key={project.id} onClick={() => setProjectFilter(project.name)}>
                    <div className={`w-3 h-3 rounded-full ${project.color} mr-2`} />
                    {project.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filtro de Tags */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Tags ({selectedTags.length})
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {tags.map((tag) => (
                  <DropdownMenuCheckboxItem
                    key={tag.id}
                    checked={selectedTags.includes(tag.name)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedTags([...selectedTags, tag.name])
                      } else {
                        setSelectedTags(selectedTags.filter((t) => t !== tag.name))
                      }
                    }}
                  >
                    <div className={`w-3 h-3 rounded-full ${tag.color} mr-2`} />
                    {tag.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Limpar filtros */}
            {(statusFilter !== "Todos" || projectFilter !== "Todos" || selectedTags.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatusFilter("Todos")
                  setProjectFilter("Todos")
                  setSelectedTags([])
                }}
              >
                Limpar filtros
              </Button>
            )}
          </div>

          {/* Lista de Tarefas */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} projects={projects} tags={tags} />
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <Tasks className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma tarefa encontrada</h3>
              <p className="text-muted-foreground">Tente ajustar os filtros ou criar uma nova tarefa.</p>
            </div>
          )}
        </div>
        <NewTaskDialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen} projects={projects} tags={tags} />
      </SidebarInset>
    </SidebarProvider>
  )
}
