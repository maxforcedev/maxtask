"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Plus, X, Upload, Paperclip } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useTaskContext } from "@/components/task-context"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  projectId: z.string().optional(),
  tagIds: z.array(z.string()).default([]),
  deadline: z.date().optional(),
  status: z.enum(["A Fazer", "Em Andamento", "Concluídas"]),
})

type FormData = z.infer<typeof formSchema>

interface Project {
  id: number
  name: string
  color: string
}

interface Tag {
  id: number
  name: string
  color: string
}

interface EditTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: any
  projects: Project[]
  tags: Tag[]
}

export function EditTaskDialog({ open, onOpenChange, task, projects, tags }: EditTaskDialogProps) {
  const { updateTask } = useTaskContext()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const [subtasks, setSubtasks] = useState<Array<{ id: string; title: string }>>([])

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      projectId: "0",
      tagIds: [],
      status: "A Fazer",
    },
  })

  // Reset form when dialog opens/closes or task changes
  useEffect(() => {
    if (open && task) {
      // Reset form with task data
      form.reset({
        title: task.title || "",
        description: task.description || "",
        projectId: projects.find((p) => p.name === task.project)?.id.toString() || "0",
        tagIds:
          task.tags
            ?.map((tagName: string) => {
              const tag = tags.find((t) => t.name === tagName)
              return tag?.id.toString()
            })
            .filter(Boolean) || [],
        deadline: task.deadline ? new Date(task.deadline) : undefined,
        status: task.status || "A Fazer",
      })

      // Initialize subtasks
      if (task.subtasks && Array.isArray(task.subtasks)) {
        const taskSubtasks = task.subtasks.map((subtask: any) => ({
          id: crypto.randomUUID(),
          title: typeof subtask === "string" ? subtask : subtask.title || "",
        }))
        setSubtasks(taskSubtasks.length > 0 ? taskSubtasks : [{ id: crypto.randomUUID(), title: "" }])
      } else {
        setSubtasks([{ id: crypto.randomUUID(), title: "" }])
      }

      // Reset attachments
      setAttachments([])
    } else if (!open) {
      // Reset everything when dialog closes
      form.reset()
      setSubtasks([{ id: crypto.randomUUID(), title: "" }])
      setAttachments([])
    }
  }, [open, task, form, projects, tags])

  const addSubtask = () => {
    setSubtasks([...subtasks, { id: crypto.randomUUID(), title: "" }])
  }

  const removeSubtaskItem = (id: string) => {
    if (subtasks.length > 1) {
      setSubtasks(subtasks.filter((subtask) => subtask.id !== id))
    }
  }

  const updateSubtask = (id: string, title: string) => {
    setSubtasks(subtasks.map((subtask) => (subtask.id === id ? { ...subtask, title } : subtask)))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setAttachments([...attachments, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const toggleTag = (tagId: string) => {
    const currentTags = form.getValues("tagIds")
    const newTags = currentTags.includes(tagId) ? currentTags.filter((id) => id !== tagId) : [...currentTags, tagId]
    form.setValue("tagIds", newTags)
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)

    try {
      // Simular salvamento
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Encontrar projeto selecionado
      const selectedProject = projects.find((p) => p.id.toString() === data.projectId)

      // Encontrar tags selecionadas
      const selectedTagNames = data.tagIds
        .map((tagId) => {
          const tag = tags.find((t) => t.id.toString() === tagId)
          return tag?.name || ""
        })
        .filter(Boolean)

      const updatedTask = {
        title: data.title,
        description: data.description || "",
        status: data.status,
        project: selectedProject?.name || "Sem projeto",
        projectColor: selectedProject?.color || "bg-gray-500",
        tags: selectedTagNames,
        deadline: data.deadline ? format(data.deadline, "yyyy-MM-dd") : task.deadline,
      }

      updateTask(task.id, updatedTask)

      toast({
        title: "Tarefa atualizada! ✨",
        description: `"${data.title}" foi atualizada com sucesso.`,
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Erro ao atualizar tarefa",
        description: "Não foi possível atualizar a tarefa. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const selectedTags = form.watch("tagIds") || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Editar Tarefa</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Título */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Título da tarefa *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o título da tarefa..."
                      className="text-base border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descrição */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Adicione uma descrição detalhada..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A Fazer">A Fazer</SelectItem>
                        <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                        <SelectItem value="Concluídas">Concluídas</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Projeto */}
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Projeto</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar projeto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Nenhum projeto</SelectItem>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id.toString()}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${project.color}`} />
                              {project.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Prazo */}
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Prazo</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Selecionar data</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tags */}
            <FormField
              control={form.control}
              name="tagIds"
              render={() => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Tags</FormLabel>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => {
                        const isSelected = selectedTags.includes(tag.id.toString())
                        return (
                          <Badge
                            key={tag.id}
                            variant={isSelected ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer transition-all hover:scale-105",
                              isSelected && `${tag.color} text-white border-transparent`,
                              !isSelected && "hover:bg-muted",
                            )}
                            onClick={() => toggleTag(tag.id.toString())}
                          >
                            {tag.name}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subtarefas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Subtarefas</label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addSubtask}
                  className="text-primary hover:text-primary/80"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              </div>
              <div className="space-y-2">
                {subtasks.map((subtask, index) => (
                  <div key={subtask.id} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                    <Input
                      placeholder={`Subtarefa ${index + 1}`}
                      value={subtask.title}
                      onChange={(e) => updateSubtask(subtask.id, e.target.value)}
                      className="flex-1"
                    />
                    {subtasks.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSubtaskItem(subtask.id)}
                        className="text-muted-foreground hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Upload de arquivos */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Anexos</label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 hover:border-muted-foreground transition-colors">
                <input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload-edit" />
                <label htmlFor="file-upload-edit" className="flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Clique para fazer upload ou arraste arquivos aqui
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">PDF, DOC, IMG até 10MB</span>
                </label>
              </div>

              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm flex-1">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                        className="text-muted-foreground hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
