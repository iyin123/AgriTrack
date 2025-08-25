import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { getCrops, addCrop, updateCrop, deleteCrop, type Crop } from "@/api/crops"
import { useToast } from "@/hooks/useToast"
import { Plus, Search, Edit, Trash2, Calendar, Sprout } from "lucide-react"
import { AddCropDialog } from "@/components/crops/AddCropDialog"
import { EditCropDialog } from "@/components/crops/EditCropDialog"
import { DeleteCropDialog } from "@/components/crops/DeleteCropDialog"

export function Crops() {
  const [crops, setCrops] = useState<Crop[]>([])
  const [filteredCrops, setFilteredCrops] = useState<Crop[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { toast } = useToast()

  console.log('Crops component rendered')

  useEffect(() => {
    fetchCrops()
  }, [])

  useEffect(() => {
    const filtered = crops.filter(crop =>
      crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCrops(filtered)
  }, [crops, searchTerm])

  const fetchCrops = async () => {
    try {
      console.log('Fetching crops...')
      const data = await getCrops()
      setCrops(data.crops)
      console.log('Crops loaded:', data.crops.length)
    } catch (error) {
      console.error('Error fetching crops:', error)
      toast({
        title: "Error",
        description: "Failed to load crops",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddCrop = async (cropData: { name: string; type: string; plantingDate: string; notes: string }) => {
    try {
      console.log('Adding new crop:', cropData)
      const response = await addCrop(cropData)
      setCrops(prev => [...prev, response.crop])
      setShowAddDialog(false)
      toast({
        title: "Success",
        description: response.message
      })
    } catch (error) {
      console.error('Error adding crop:', error)
      toast({
        title: "Error",
        description: "Failed to add crop",
        variant: "destructive"
      })
    }
  }

  const handleEditCrop = async (cropData: { name: string; type: string; plantingDate: string; notes: string }) => {
    if (!selectedCrop) return

    try {
      console.log('Updating crop:', selectedCrop._id, cropData)
      const response = await updateCrop(selectedCrop._id, cropData)
      setCrops(prev => prev.map(crop => crop._id === selectedCrop._id ? response.crop : crop))
      setShowEditDialog(false)
      setSelectedCrop(null)
      toast({
        title: "Success",
        description: response.message
      })
    } catch (error) {
      console.error('Error updating crop:', error)
      toast({
        title: "Error",
        description: "Failed to update crop",
        variant: "destructive"
      })
    }
  }

  const handleDeleteCrop = async () => {
    if (!selectedCrop) return

    try {
      console.log('Deleting crop:', selectedCrop._id)
      const response = await deleteCrop(selectedCrop._id)
      setCrops(prev => prev.filter(crop => crop._id !== selectedCrop._id))
      setShowDeleteDialog(false)
      setSelectedCrop(null)
      toast({
        title: "Success",
        description: response.message
      })
    } catch (error) {
      console.error('Error deleting crop:', error)
      toast({
        title: "Error",
        description: "Failed to delete crop",
        variant: "destructive"
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-200'
      case 'attention': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200'
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
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
          My Crops
        </h1>
        <Button 
          onClick={() => setShowAddDialog(true)}
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Crop
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search crops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCrops.map((crop) => (
          <Card key={crop._id} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-200 hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {crop.name}
                </CardTitle>
                <Badge className={getStatusColor(crop.status)}>
                  {crop.status}
                </Badge>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {crop.type}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Planted: {new Date(crop.plantingDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Sprout className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Harvest: {crop.daysUntilHarvest > 0 ? `${crop.daysUntilHarvest} days` : 'Ready!'}
                  </span>
                </div>
              </div>

              {crop.notes && (
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2 rounded">
                  {crop.notes}
                </p>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCrop(crop)
                    setShowEditDialog(true)
                  }}
                  className="flex-1"
                >
                  <Edit className="mr-2 h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCrop(crop)
                    setShowDeleteDialog(true)
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCrops.length === 0 && !loading && (
        <div className="text-center py-12">
          <Sprout className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {searchTerm ? 'No crops found' : 'No crops yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first crop to track its progress'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setShowAddDialog(true)} className="bg-gradient-to-r from-green-500 to-blue-500">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Crop
            </Button>
          )}
        </div>
      )}

      <AddCropDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddCrop}
      />

      <EditCropDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        crop={selectedCrop}
        onSubmit={handleEditCrop}
      />

      <DeleteCropDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        crop={selectedCrop}
        onConfirm={handleDeleteCrop}
      />
    </div>
  )
}