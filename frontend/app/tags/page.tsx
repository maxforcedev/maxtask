"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { FolderOpen, Home, LogOut, Tag, WorkflowIcon as Tasks, Plus, Edit, Trash2, Hash } from "lucide-react"
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
  { title: "Projetos", icon: FolderOpen, url: "/projects" },
  { title: "Tags", icon: Tag, url: "/tags", active: true },
]

const tagSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  color: z.string().min(1, "Cor é obrigatória"),
})

type TagFormData = z.infer<typeof tagSchema>

const colors = [
  { name: "Vermelho", value: "bg-red-500" },
  { name: "Rosa", value: "bg-pink-500" },
  { name: "Azul", value: "bg-blue-500" },
  { name: "Verde", value: "bg-green-500" },
  { name: "Amarelo", value: "bg-yellow-500" },
  { name: "Roxo", value: "bg-purple-500" },
  { name: "Índigo", value: "bg-indigo-500" },
  { name: "Laranja", value: "bg-orange-500" },
  { name: "Cinza", value: "bg-gray-500" },
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

function TagDialog({ tag, onSave }: { tag?: any; onSave: (data: any) => void }) {
  const [open, setOpen] = useState(false)
  const form = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: tag?.name || "",
      color: tag?.color || "bg-blue-500",
    },
  })

  const onSubmit = (data: TagFormData) => {
    onSave({ ...data, id: tag?.id || Date.now() })
    setOpen(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {tag ? (
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Tag
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tag ? "Editar Tag" : "Nova Tag"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Tag</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome da tag..." {...field} />
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
              <Button type="submit">{tag ? "Salvar" : "Criar"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default function Tags() {
  const { tasks } = useTaskContext()
  const { toast } = useToast()
  const [tags, setTags] = useState([
    { id: 1, name: "Urgente", color: "bg-red-500" },
    { id: 2, name: "Design", color: "bg-pink-500" },
    { id: 3, name: "Frontend", color: "bg-blue-500" },
    { id: 4, name: "Backend", color: "bg-green-500" },
    { id: 5, name: "Review", color: "bg-yellow-500" },
  ])

  const handleSaveTag = (tagData: any) => {
    if (tagData.id && tags.find((t) => t.id === tagData.id)) {
      setTags(tags.map((t) => (t.id === tagData.id ? tagData : t)))
      toast({
        title: "Tag atualizada!",
        description: `"${tagData.name}" foi atualizada com sucesso.`,
      })
    } else {
      setTags([...tags, { ...tagData, id: Date.now() }])
      toast({
        title: "Tag criada!",
        description: `"${tagData.name}" foi criada com sucesso.`,
      })
    }
  }

  const handleDeleteTag = (tagId: number) => {
    setTags(tags.filter((t) => t.id !== tagId))
    toast({
      title: "Tag excluída",
      description: "A tag foi excluída com sucesso.",
    })
  }

  const getTagUsage = (tagName: string) => {
    return tasks.filter((task) => task.tags.includes(tagName)).length
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Tags</h1>
              <p className="text-sm text-muted-foreground">Organize suas tarefas com tags coloridas</p>
            </div>
            <TagDialog onSave={handleSaveTag} />
          </div>
        </header>

        <div className="flex-1 space-y-6 p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tags.map((tag) => {
              const usage = getTagUsage(tag.name)

              return (
                <Card key={tag.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${tag.color}`} />
                        <CardTitle className="text-base">{tag.name}</CardTitle>
                      </div>
                      <div className="flex gap-1">
                        <TagDialog tag={tag} onSave={handleSaveTag} />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTag(tag.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge className={`${tag.color} text-white border-0`}>{tag.name}</Badge>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Hash className="h-3 w-3" />
                          <span>Usada em</span>
                        </div>
                        <span className="font-medium">{usage} tarefas</span>
                      </div>

                      {usage > 0 && (
                        <div className="text-xs text-muted-foreground">Clique para ver tarefas com esta tag</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {tags.length === 0 && (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma tag encontrada</h3>
              <p className="text-muted-foreground mb-4">Crie sua primeira tag para organizar suas tarefas.</p>
              <TagDialog onSave={handleSaveTag} />
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
