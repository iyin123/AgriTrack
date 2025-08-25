import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTasks, addTask, updateTaskCompletion, deleteTask, type Task } from "@/api/tasks"
import { getCrops } from "@/api/crops"
import { useToast } from "@/hooks/useToast"
import { Plus, Search, Calendar, CheckCircle, Clock, Trash2 } from "lucide-react"
import { AddTaskDialog } from "@/components/tasks/AddTaskDialog"
import { DeleteTaskDialog } from "@/components/tasks/DeleteTaskDialog"

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("pending")
  const { toast } = useToast()

  console.log('Tasks component rendered')

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    let filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.cropName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (activeTab === "pending") {
      filtered = filtered.filter(task => !task.completed)
    } else if (activeTab === "completed") {
      filtered = filtered.filter(task => task.completed)
    }

    setFilteredTasks(filtered)
  }, [tasks, searchTerm, activeTab])

  const fetchTasks = async () => {
    try {
      console.log('Fetching tasks...')
      const data = await getTasks()
      setTasks(data.tasks)
      console.log('Tasks loaded:', data.tasks.length)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async (taskData: { cropId: string; title: string; type: string; dueDate: string; priority: string; notes?: string }) => {
    try {
      console.log('Adding new task:', taskData)
      const response = await addTask(taskData)
      setTasks(prev => [...prev, response.task])
      setShowAddDialog(false)
      toast({
        title: "Success",
        description: response.message
      })
    } catch (error) {
      console.error('Error adding task:', error)
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive"
      })
    }
  }

  const handleToggleComplete = async (task: Task) => {
    try {
      console.log('Toggling task completion:', task._id, !task.completed)
      const response = await updateTaskCompletion(task._id, !task.completed)
      setTasks(prev => prev.map(t => t._id === task._id ? { ...t, completed: !t.completed } : t))
      toast({
        title: "Success",
        description: response.message
      })
    } catch (error) {
      console.error('Error updating task:', error)
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      })
    }
  }

  const handleDeleteTask = async () => {
    if (!selectedTask) return

    try {
      console.log('Deleting task:', selectedTask._id)
      const response = await deleteTask(selectedTask._id)
      setTasks(prev => prev.filter(task => task._id !== selectedTask._id))
      setShowDeleteDialog(false)
      setSelectedTask(null)
      toast({
        title: "Success",
        description: response.message
      })
    } catch (error) {
      console.error('Error deleting task:', error)
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive"
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'watering': return '💧'
      case 'fertilizing': return '🌱'
      case 'weeding': return '🌿'
      case 'harvesting': return '🌾'
      case 'pest_control': return '🐛'
      default: return '📋'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
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
          Tasks
        </h1>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <TaskList
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onDelete={(task) => {
              setSelectedTask(task)
              setShowDeleteDialog(true)
            }}
            getPriorityColor={getPriorityColor}
            getTaskTypeIcon={getTaskTypeIcon}
          />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <TaskList
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onDelete={(task) => {
              setSelectedTask(task)
              setShowDeleteDialog(true)
            }}
            getPriorityColor={getPriorityColor}
            getTaskTypeIcon={getTaskTypeIcon}
          />
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <TaskList
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onDelete={(task) => {
              setSelectedTask(task)
              setShowDeleteDialog(true)
            }}
            getPriorityColor={getPriorityColor}
            getTaskTypeIcon={getTaskTypeIcon}
          />
        </TabsContent>
      </Tabs>

      {filteredTasks.length === 0 && !loading && (
        <div className="text-center py-12">
          <CheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {searchTerm ? 'No tasks found' : activeTab === 'completed' ? 'No completed tasks' : 'No tasks yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first task'}
          </p>
          {!searchTerm && activeTab !== 'completed' && (
            <Button onClick={() => setShowAddDialog(true)} className="bg-gradient-to-r from-green-500 to-blue-500">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Task
            </Button>
          )}
        </div>
      )}

      <AddTaskDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddTask}
      />

      <DeleteTaskDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        task={selectedTask}
        onConfirm={handleDeleteTask}
      />
    </div>
  )
}

interface TaskListProps {
  tasks: Task[]
  onToggleComplete: (task: Task) => void
  onDelete: (task: Task) => void
  getPriorityColor: (priority: string) => string
  getTaskTypeIcon: (type: string) => string
}

function TaskList({ tasks, onToggleComplete, onDelete, getPriorityColor, getTaskTypeIcon }: TaskListProps) {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card key={task._id} className={`bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 transition-all duration-200 ${task.completed ? 'opacity-75' : 'hover:shadow-lg hover:scale-[1.02]'}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => onToggleComplete(task)}
                className="mt-1"
              />

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getTaskTypeIcon(task.type)}</span>
                  <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                    {task.title}
                  </h3>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                  <span>Crop: {task.cropName}</span>
                </div>

                {task.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2 rounded">
                    {task.notes}
                  </p>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}