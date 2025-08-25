import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getDashboardStats, getWeatherData, type DashboardStats, type WeatherData } from "@/api/dashboard"
import { getMonthlyRecommendations, type MonthlyRecommendation } from "@/api/recommendations"
import { getTasks, type Task } from "@/api/tasks"
import { useToast } from "@/hooks/useToast"
import {
  Sprout,
  CheckSquare,
  Activity,
  Plus,
  Calendar,
  Thermometer,
  Droplets,
  Sun,
  TrendingUp
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [recommendations, setRecommendations] = useState<MonthlyRecommendation | null>(null)
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  console.log('Dashboard component rendered')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('Fetching dashboard data...')
        const [statsData, weatherData, recommendationsData, tasksData] = await Promise.all([
          getDashboardStats(),
          getWeatherData(),
          getMonthlyRecommendations(),
          getTasks()
        ])

        setStats(statsData.stats)
        setWeather(weatherData.weather)
        setRecommendations(recommendationsData.recommendations)
        setUpcomingTasks(tasksData.tasks.filter(task => !task.completed).slice(0, 5))
        console.log('Dashboard data loaded successfully')
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/crops')} className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
            <Plus className="mr-2 h-4 w-4" />
            Add Crop
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Active Crops
            </CardTitle>
            <Sprout className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">{stats?.totalActiveCrops}</div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Growing strong
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Upcoming Tasks
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">{stats?.upcomingTasks}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Next 7 days
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Completed Tasks
            </CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">{stats?.completedTasksThisMonth}</div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
              Recent Activities
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">{stats?.recentActivities}</div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Weather Widget */}
        <Card className="bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-900/20 dark:to-sky-800/20 border-sky-200 dark:border-sky-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sky-700 dark:text-sky-300">
              <Sun className="h-5 w-5" />
              Weather Today
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-sky-800 dark:text-sky-200">{weather?.temperature}°C</p>
                <p className="text-sm text-sky-600 dark:text-sky-400">{weather?.condition}</p>
              </div>
              <Sun className="h-12 w-12 text-yellow-500" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-sky-700 dark:text-sky-300">Humidity: {weather?.humidity}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-red-500" />
                <span className="text-sky-700 dark:text-sky-300">Rainfall: {weather?.rainfall}mm</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Recommendations */}
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <Calendar className="h-5 w-5" />
              This Month's Crops
            </CardTitle>
            <CardDescription className="text-emerald-600 dark:text-emerald-400">
              Recommended for {recommendations?.month} {recommendations?.year}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations?.crops.slice(0, 3).map((crop) => (
                <div key={crop._id} className="flex items-center gap-3 p-2 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <span className="text-2xl">{crop.icon}</span>
                  <div>
                    <p className="font-medium text-emerald-800 dark:text-emerald-200">{crop.name}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">{crop.expectedHarvestTime}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4 border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-600 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
              onClick={() => navigate('/recommendations')}
            >
              View All Recommendations
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <CheckSquare className="h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task._id} className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <div>
                    <p className="font-medium text-amber-800 dark:text-amber-200">{task.title}</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400">{task.cropName}</p>
                  </div>
                  <Badge 
                    variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-900/20"
              onClick={() => navigate('/tasks')}
            >
              View All Tasks
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}