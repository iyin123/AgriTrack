import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { getActivities, addActivity, deleteActivity, type Activity } from "@/api/activities"
import { useToast } from "@/hooks/useToast"
import { Plus, Search, Calendar, Trash2, Camera } from "lucide-react"
import { AddActivityDialog } from "@/components/activities/AddActivityDialog"
import { DeleteActivityDialog } from "@/components/activities/DeleteActivityDialog"

export function Activities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { toast } = useToast()

  console.log('Activities component rendered')

  useEffect(() => {
    fetchActivities()
  }, [])

  useEffect(() => {
    const filtered = activities.filter(activity =>
      activity.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.notes.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredActivities(filtered)
  }, [activities, searchTerm])

  const fetchActivities = async () => {
    try {
      console.log('Fetching activities...')
      const data = await getActivities()
      setActivities(data.activities)
      console.log('Activities loaded:', data.activities.length)
    } catch (error) {
      console.error('Error fetching activities:', error)
      toast({
        title: "Error",
        description: "Failed to load activities",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddActivity = async (activityData: { cropId: string; type: string; date: string; notes: string; photos?: string[] }) => {
    try {
      console.log('Adding new activity:', activityData)
      const response = await addActivity(activityData)
      setActivities(prev => [response.activity, ...prev])
      setShowAddDialog(false)
      toast({
        title: "Success",
        description: response.message
      })
    } catch (error) {
      console.error('Error adding activity:', error)
      toast({
        title: "Error",
        description: "Failed to add activity",
        variant: "destructive"
      })
    }
  }

  const handleDeleteActivity = async () => {
    if (!selectedActivity) return

    try {
      console.log('Deleting activity:', selectedActivity._id)
      const response = await deleteActivity(selectedActivity._id)
      setActivities(prev => prev.filter(activity => activity._id !== selectedActivity._id))
      setShowDeleteDialog(false)
      setSelectedActivity(null)
      toast({
        title: "Success",
        description: response.message
      })
    } catch (error) {
      console.error('Error deleting activity:', error)
      toast({
        title: "Error",
        description: "Failed to delete activity",
        variant: "destructive"
      })
    }
  }

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'watering': return '💧'
      case 'fertilizing': return '🌱'
      case 'weeding': return '🌿'
      case 'harvesting': return '🌾'
      case 'pest_control': return '🐛'
      case 'planting': return '🌱'
      default: return '📋'
    }
  }

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'watering': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'fertilizing': return 'bg-green-100 text-green-800 border-green-200'
      case 'weeding': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'harvesting': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'pest_control': return 'bg-red-100 text-red-800 border-red-200'
      case 'planting': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
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
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-64"></div>
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
          Activities
        </h1>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Log Activity
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredActivities.map((activity) => (
          <Card key={activity._id} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getActivityTypeIcon(activity.type)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                        {activity.type.replace('_', ' ')} - {activity.cropName}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        {new Date(activity.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                    {activity.notes}
                  </p>

                  {activity.photos && activity.photos.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Camera className="h-4 w-4" />
                      <span>{activity.photos.length} photo{activity.photos.length > 1 ? 's' : ''} attached</span>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-2">
                  <Badge className={getActivityTypeColor(activity.type)}>
                    {activity.type.replace('_', ' ')}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedActivity(activity)
                      setShowDeleteDialog(true)
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredActivities.length === 0 && !loading && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {searchTerm ? 'No activities found' : 'No activities logged yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Start by logging your first farming activity'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setShowAddDialog(true)} className="bg-gradient-to-r from-green-500 to-blue-500">
              <Plus className="mr-2 h-4 w-4" />
              Log Your First Activity
            </Button>
          )}
        </div>
      )}

      <AddActivityDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddActivity}
      />

      <DeleteActivityDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        activity={selectedActivity}
        onConfirm={handleDeleteActivity}
      />
    </div>
  )
}