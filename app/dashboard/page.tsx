import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Activity,
  Bot,
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  Pause,
  Play,
  Settings,
  ShoppingBag,
  Star,
  TrendingUp,
  Users,
  XCircle,
  BarChart3,
} from "lucide-react"

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [botActive, setBotActive] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace("/") // redirect to landing if not logged in
      } else {
        setLoading(false)
      }
    }

    checkSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/")
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  // --- Static data for UI (replace with your real data later)
  const renovationDate = new Date("2025-08-16T03:00:00.000Z")
  const daysUntilRenovation = Math.ceil((renovationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const integrationStatus = { tiendanube: true, gmail: false, whatsapp: true }
  const recentConversations = [
    { id: 1, customer: "María González", time: "hace 5 min", status: "resuelto" },
    { id: 2, customer: "Carlos López", time: "hace 12 min", status: "en progreso" },
    { id: 3, customer: "Ana Martínez", time: "hace 1 hora", status: "resuelto" },
    { id: 4, customer: "Pedro Rodríguez", time: "hace 2 horas", status: "resuelto" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                  <p className="text-sm text-slate-600">Panel de control principal</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="capitalize">
                Plan free
              </Badge>
              <Avatar>
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  D
                </AvatarFallback>
              </Avatar>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">Demo User</p>
                <p className="text-xs text-slate-600">demo@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Top Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Consultas Restantes */}
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Consultas Restantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">84</div>
                <Progress value={84} className="h-2 bg-blue-400" />
                <p className="text-xs opacity-90 mt-2">de 100 consultas mensuales</p>
              </CardContent>
            </Card>

            {/* Próxima Renovación */}
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Próxima Renovación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{daysUntilRenovation}</div>
                <div className="flex items-center text-sm opacity-90">
                  <Calendar className="h-4 w-4 mr-1" />
                  días restantes
                </div>
                <p className="text-xs opacity-90 mt-1">{renovationDate.toLocaleDateString()}</p>
              </CardContent>
            </Card>

            {/* Estado del Bot */}
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Estado del Bot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold">{botActive ? "Activo" : "Pausado"}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={() => setBotActive(!botActive)}
                  >
                    {botActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex items-center text-sm opacity-90">
                  <div className={`w-2 h-2 rounded-full mr-2 ${botActive ? "bg-green-300" : "bg-red-300"}`} />
                  {botActive ? "Funcionando correctamente" : "Bot pausado"}
                </div>
              </CardContent>
            </Card>

            {/* Tiempo Promedio */}
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Tiempo Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">2.3s</div>
                <div className="flex items-center text-sm opacity-90">
                  <Clock className="h-4 w-4 mr-1" />
                  tiempo de respuesta
                </div>
                <p className="text-xs opacity-90 mt-1">Excelente rendimiento</p>
              </CardContent>
            </Card>
          </div>

          {/* Middle Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Estado de Integraciones */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Estado de Integraciones
                </CardTitle>
                <CardDescription>Conexiones con servicios externos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tiendanube */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ShoppingBag className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium">Tiendanube</p>
                      <p className="text-sm text-slate-600">https://demo.mitiendanube.com</p>
                    </div>
                  </div>
                  <Badge variant={integrationStatus.tiendanube ? "default" : "destructive"}>
                    {integrationStatus.tiendanube ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" /> Conectado
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" /> Desconectado
                      </>
                    )}
                  </Badge>
                </div>

                {/* Gmail */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-8 w-8 text-red-600" />
                    <div>
                      <p className="font-medium">Gmail</p>
                      <p className="text-sm text-slate-600">Integración de email</p>
                    </div>
                  </div>
                  <Badge variant={integrationStatus.gmail ? "default" : "destructive"}>
                    {integrationStatus.gmail ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" /> Conectado
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" /> Desconectado
                      </>
                    )}
                  </Badge>
                </div>

                {/* WhatsApp */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <p className="text-sm text-slate-600">Mensajería instantánea</p>
                    </div>
                  </div>
                  <Badge variant={integrationStatus.whatsapp ? "default" : "destructive"}>
                    {integrationStatus.whatsapp ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" /> Conectado
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" /> Desconectado
                      </>
                    )}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Satisfacción */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Satisfacción
                </CardTitle>
                <CardDescription>Calificación promedio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-500 mb-2">4.8</div>
                  <div className="flex justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${star <= 4 ? "text-yellow-400 fill-current" : "text-slate-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 mb-4">Basado en 127 evaluaciones</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <span className="w-12">5★</span>
                      <Progress value={75} className="flex-1 mx-2" />
                      <span className="w-8">75%</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="w-12">4★</span>
                      <Progress value={20} className="flex-1 mx-2" />
                      <span className="w-8">20%</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="w-12">3★</span>
                      <Progress value={5} className="flex-1 mx-2" />
                      <span className="w-8">5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Últimas Conversaciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Últimas Conversaciones
                  </div>
                  <Button variant="outline" size="sm">
                    Ver todas
                  </Button>
                </CardTitle>
                <CardDescription>Conversaciones recientes atendidas por el bot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentConversations.map((conversation) => (
                    <div key={conversation.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {conversation.customer
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{conversation.customer}</p>
                          <p className="text-xs text-slate-600">{conversation.time}</p>
                        </div>
                      </div>
                      <Badge variant={conversation.status === "resuelto" ? "default" : "secondary"}>
                        {conversation.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Estadísticas Adicionales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Estadísticas del Mes
                </CardTitle>
                <CardDescription>Resumen de actividad mensual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Conversaciones totales</span>
                    </div>
                    <span className="font-bold">1,247</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Resueltas automáticamente</span>
                    </div>
                    <span className="font-bold">1,089</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Tasa de resolución</span>
                    </div>
                    <span className="font-bold">87.3%</span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">Última actividad</span>
                    </div>
                    <span className="text-sm text-slate-600">{new Date().toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

    checkSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/")
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  // --- Static data for UI (replace with your real data later)
  const renovationDate = new Date("2025-08-16T03:00:00.000Z")
  const daysUntilRenovation = Math.ceil((renovationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const integrationStatus = { tiendanube: true, gmail: false, whatsapp: true }
  const recentConversations = [
    { id: 1, customer: "María González", time: "hace 5 min", status: "resuelto" },
    { id: 2, customer: "Carlos López", time: "hace 12 min", status: "en progreso" },
    { id: 3, customer: "Ana Martínez", time: "hace 1 hora", status: "resuelto" },
    { id: 4, customer: "Pedro Rodríguez", time: "hace 2 horas", status: "resuelto" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                  <p className="text-sm text-slate-600">Panel de control principal</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="capitalize">
                Plan free
              </Badge>
              <Avatar>
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  D
                </AvatarFallback>
              </Avatar>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">Demo User</p>
                <p className="text-xs text-slate-600">demo@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Top Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Consultas Restantes */}
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Consultas Restantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">84</div>
                <Progress value={84} className="h-2 bg-blue-400" />
                <p className="text-xs opacity-90 mt-2">de 100 consultas mensuales</p>
              </CardContent>
            </Card>

            {/* Próxima Renovación */}
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Próxima Renovación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{daysUntilRenovation}</div>
                <div className="flex items-center text-sm opacity-90">
                  <Calendar className="h-4 w-4 mr-1" />
                  días restantes
                </div>
                <p className="text-xs opacity-90 mt-1">{renovationDate.toLocaleDateString()}</p>
              </CardContent>
            </Card>

            {/* Estado del Bot */}
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Estado del Bot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold">{botActive ? "Activo" : "Pausado"}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={() => setBotActive(!botActive)}
                  >
                    {botActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex items-center text-sm opacity-90">
                  <div className={`w-2 h-2 rounded-full mr-2 ${botActive ? "bg-green-300" : "bg-red-300"}`} />
                  {botActive ? "Funcionando correctamente" : "Bot pausado"}
                </div>
              </CardContent>
            </Card>

            {/* Tiempo Promedio */}
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Tiempo Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">2.3s</div>
                <div className="flex items-center text-sm opacity-90">
                  <Clock className="h-4 w-4 mr-1" />
                  tiempo de respuesta
                </div>
                <p className="text-xs opacity-90 mt-1">Excelente rendimiento</p>
              </CardContent>
            </Card>
          </div>

          {/* Middle Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Estado de Integraciones */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Estado de Integraciones
                </CardTitle>
                <CardDescription>Conexiones con servicios externos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tiendanube */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ShoppingBag className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium">Tiendanube</p>
                      <p className="text-sm text-slate-600">https://demo.mitiendanube.com</p>
                    </div>
                  </div>
                  <Badge variant={integrationStatus.tiendanube ? "default" : "destructive"}>
                    {integrationStatus.tiendanube ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" /> Conectado
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" /> Desconectado
                      </>
                    )}
                  </Badge>
                </div>

                {/* Gmail */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-8 w-8 text-red-600" />
                    <div>
                      <p className="font-medium">Gmail</p>
                      <p className="text-sm text-slate-600">Integración de email</p>
                    </div>
                  </div>
                  <Badge variant={integrationStatus.gmail ? "default" : "destructive"}>
                    {integrationStatus.gmail ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" /> Conectado
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" /> Desconectado
                      </>
                    )}
                  </Badge>
                </div>

                {/* WhatsApp */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <p className="text-sm text-slate-600">Mensajería instantánea</p>
                    </div>
                  </div>
                  <Badge variant={integrationStatus.whatsapp ? "default" : "destructive"}>
                    {integrationStatus.whatsapp ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" /> Conectado
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" /> Desconectado
                      </>
                    )}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Satisfacción */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Satisfacción
                </CardTitle>
                <CardDescription>Calificación promedio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-500 mb-2">4.8</div>
                  <div className="flex justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${star <= 4 ? "text-yellow-400 fill-current" : "text-slate-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 mb-4">Basado en 127 evaluaciones</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <span className="w-12">5★</span>
                      <Progress value={75} className="flex-1 mx-2" />
                      <span className="w-8">75%</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="w-12">4★</span>
                      <Progress value={20} className="flex-1 mx-2" />
                      <span className="w-8">20%</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="w-12">3★</span>
                      <Progress value={5} className="flex-1 mx-2" />
                      <span className="w-8">5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Últimas Conversaciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Últimas Conversaciones
                  </div>
                  <Button variant="outline" size="sm">
                    Ver todas
                  </Button>
                </CardTitle>
                <CardDescription>Conversaciones recientes atendidas por el bot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentConversations.map((conversation) => (
                    <div key={conversation.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {conversation.customer
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{conversation.customer}</p>
                          <p className="text-xs text-slate-600">{conversation.time}</p>
                        </div>
                      </div>
                      <Badge variant={conversation.status === "resuelto" ? "default" : "secondary"}>
                        {conversation.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Estadísticas Adicionales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Estadísticas del Mes
                </CardTitle>
                <CardDescription>Resumen de actividad mensual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Conversaciones totales</span>
                    </div>
                    <span className="font-bold">1,247</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Resueltas automáticamente</span>
                    </div>
                    <span className="font-bold">1,089</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Tasa de resolución</span>
                    </div>
                    <span className="font-bold">87.3%</span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">Última actividad</span>
                    </div>
                    <span className="text-sm text-slate-600">{new Date().toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

