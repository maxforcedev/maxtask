"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { Mail, ArrowLeft, WorkflowIcon as Tasks, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"

const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { toast } = useToast()

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)

    try {
      // Simular envio de email
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setEmailSent(true)
      toast({
        title: "Email enviado! 📧",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      })
    } catch (error) {
      toast({
        title: "Erro ao enviar email",
        description: "Ocorreu um erro ao enviar o email. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Email reenviado! 📧",
        description: "Um novo email foi enviado para sua caixa de entrada.",
      })
    } catch (error) {
      toast({
        title: "Erro ao reenviar email",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Tasks className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold">MaxTask</h1>
            </div>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1" />
                <ThemeToggle />
              </div>
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl font-semibold">Email Enviado!</CardTitle>
              <CardDescription className="text-center">
                Enviamos um link para redefinir sua senha para:
                <br />
                <strong className="text-foreground">{form.getValues("email")}</strong>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Próximos passos:</h3>
                  <ol className="text-sm text-muted-foreground space-y-1 text-left">
                    <li>1. Verifique sua caixa de entrada</li>
                    <li>2. Clique no link no email</li>
                    <li>3. Crie uma nova senha</li>
                    <li>4. Faça login com a nova senha</li>
                  </ol>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Não recebeu o email? Verifique sua pasta de spam ou</p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary"
                    onClick={handleResendEmail}
                    disabled={isLoading}
                  >
                    {isLoading ? "Reenviando..." : "clique aqui para reenviar"}
                  </Button>
                </div>

                <div className="pt-4">
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full bg-transparent">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Voltar para o login
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-xs text-muted-foreground">
            <p>© 2024 MaxTask. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Tasks className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold">MaxTask</h1>
          </div>
          <p className="text-muted-foreground">Recupere o acesso à sua conta</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold">Esqueci minha senha</CardTitle>
              <ThemeToggle />
            </div>
            <CardDescription>Digite seu email e enviaremos um link para redefinir sua senha</CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input type="email" placeholder="seu@email.com" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Botão Enviar */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Enviando..." : "Enviar link de recuperação"}
                </Button>
              </form>
            </Form>

            {/* Informações adicionais */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2 text-sm">💡 Dica de segurança</h3>
              <p className="text-xs text-muted-foreground">
                Por segurança, só enviaremos o email se o endereço estiver cadastrado em nosso sistema. O link expira em
                1 hora.
              </p>
            </div>

            {/* Link para voltar */}
            <div className="mt-6 text-center">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para o login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-muted-foreground">
          <p>© 2024 MaxTask. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}
