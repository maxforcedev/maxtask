"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
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
import { FolderOpen, Home, LogOut, Tag, WorkflowIcon as Tasks, Plus, Edit, Trash2, Users, Calendar } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTaskContext } from "@/components/task-context"
import { useToast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/dashboard" },
  { title: "Tarefas", icon: Tasks, url: "/" },
  { title: "Projetos", icon: FolderOpen, url: "/projects", active: true },
  { title: "Tags", icon: Tag, url: "/tags" },
]

const projectSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  color: z.string().min(1, "Cor é obrigatória"),
})

type ProjectFormData = z.infer<typeof projectSchema>

const colors = [
  { name: "Azul", value: "bg-blue-500" },
  { name: "Verde", value: "bg-green-500" },
  { name: "Roxo", value: "bg-purple-500" },
  { name: "Vermelho", value: "bg-red-500" },
  { name: "Amarelo", value: "bg-yellow-500" },
  { name: "Rosa", value: "bg-pink-500" },
  { name: "Índigo", value: "bg-indigo-500" },
  { name: "Laranja", value: "bg-orange-500" },
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
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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

function ProjectDialog({ project, onSave }: { project?: any; onSave: (data: any) => void }) {
  const [open, setOpen] = useState(false)
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      color: project?.color || "bg-blue-500",
    },
  })

  const onSubmit = (data: ProjectFormData) => {
    onSave({ ...data, id: project?.id || Date.now() })
    setOpen(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {project ? (
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project ? "Editar Projeto" : "Novo Projeto"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Projeto</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do projeto..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição opcional..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        className={`w-8 h-8 rounded-full ${color.value} ${
                          field.value === color.value ? "ring-2 ring-offset-2 ring-primary" : ""
                        }`}
                        onClick={() => field.onChange(color.value)}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{project ? "Salvar" : "Criar"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default function Projects() {
  const { tasks } = useTaskContext()
  const { toast } = useToast()
  const [projects, setProjects] = useState([
    { id: 1, name: "Website Redesign", description: "Redesign completo do site", color: "bg-blue-500" },
    { id: 2, name: "Mobile App", description: "Desenvolvimento do app mobile", color: "bg-green-500" },
    { id: 3, name: "Marketing Campaign", description: "Campanha de marketing digital", color: "bg-purple-500" },
  ])

  const handleSaveProject = (projectData: any) => {
    if (projectData.id && projects.find((p) => p.id === projectData.id)) {
      setProjects(projects.map((p) => (p.id === projectData.id ? projectData : p)))
      toast({
        title: "Projeto atualizado!",
        description: `"${projectData.name}" foi atualizado com sucesso.`,
      })
    } else {
      setProjects([...projects, { ...projectData, id: Date.now() }])
      toast({
        title: "Projeto criado!",
        description: `"${projectData.name}" foi criado com sucesso.`,
      })
    }
  }

  const handleDeleteProject = (projectId: number) => {
    setProjects(projects.filter((p) => p.id !== projectId))
    toast({
      title: "Projeto excluído",
      description: "O projeto foi excluído com sucesso.",
    })
  }

  const getProjectStats = (projectName: string) => {
    const projectTasks = tasks.filter((t) => t.project === projectName)
    return {
      total: projectTasks.length,
      completed: projectTasks.filter((t) => t.status === "Concluídas").length,
      inProgress: projectTasks.filter((t) => t.status === "Em Andamento").length,
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Projetos</h1>
              <p className="text-sm text-muted-foreground">Gerencie seus projetos e acompanhe o progresso</p>
            </div>
            <ProjectDialog onSave={handleSaveProject} />
          </div>
        </header>

        <div className="flex-1 space-y-6 p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const stats = getProjectStats(project.name)
              const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

              return (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${project.color}`} />
                        <div>
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          {project.description && (
                            <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <ProjectDialog project={project} onSave={handleSaveProject} />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Estatísticas */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <div className="text-xs text-muted-foreground">Total</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                        <div className="text-xs text-muted-foreground">Em Andamento</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                        <div className="text-xs text-muted-foreground">Concluídas</div>
                      </div>
                    </div>

                    {/* Barra de Progresso */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso</span>
                        <span>{completionRate}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${project.color} transition-all duration-300`}
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                    </div>

                    {/* Informações Adicionais */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>1 membro</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Ativo</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum projeto encontrado</h3>
              <p className="text-muted-foreground mb-4">Crie seu primeiro projeto para organizar suas tarefas.</p>
              <ProjectDialog onSave={handleSaveProject} />
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
