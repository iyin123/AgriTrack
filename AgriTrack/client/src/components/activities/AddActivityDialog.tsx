import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { getCrops, type Crop } from "@/api/crops"
import { useToast } from "@/hooks/useToast"

interface AddActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { cropId: string; type: string; date: string; notes: string; photos?: string[] }) => void
}

const activityTypes = [
  { value: 'watering', label: 'Watering' },
  { value: 'fertilizing', label: 'Fertilizing' },
  { value: 'weeding', label: 'Weeding' },
  { value: 'harvesting', label: 'Harvesting' },
  { value: 'pest_control', label: 'Pest Control' },
  { value: 'planting', label: 'Planting' },
  { value: 'other', label: 'Other' }
]

export function AddActivityDialog({ open, onOpenChange, onSubmit }: AddActivityDialogProps) {
  const [loading, setLoading] = useState(false)
  const [crops, setCrops] = useState<Crop[]>([])
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm()
  const { toast } = useToast()

  console.log('AddActivityDialog rendered, open:', open)

  useEffect(() => {
    if (open) {
      fetchCrops()
      // Set default date to today
      setValue('date', new Date().toISOString().split('T')[0])
    }
  }, [open, setValue])

  const fetchCrops = async () => {
    try {
      const data = await getCrops()
      setCrops(data.crops)
    } catch (error) {
      console.error('Error fetching crops:', error)
      toast({
        title: "Error",
        description: "Failed to load crops",
        variant: "destructive"
      })
    }
  }

  const handleFormSubmit = async (data: any) => {
    setLoading(true)
    try {
      console.log('Submitting activity data:', data)
      await onSubmit(data)
      reset()
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Log Activity
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Record a farming activity you've completed.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cropId" className="text-gray-700 dark:text-gray-300">Select Crop</Label>
            <Select onValueChange={(value) => setValue('cropId', value)}>
              <SelectTrigger className="bg-white dark:bg-gray-800">
                <SelectValue placeholder="Choose a crop" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800">
                {crops.map((crop) => (
                  <SelectItem key={crop._id} value={crop._id}>
                    {crop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.cropId && (
              <p className="text-sm text-red-600">{errors.cropId.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-gray-700 dark:text-gray-300">Activity Type</Label>
            <Select onValueChange={(value) => setValue('type', value)}>
              <SelectTrigger className="bg-white dark:bg-gray-800">
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800">
                {activityTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-600">{errors.type.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-gray-700 dark:text-gray-300">Date</Label>
            <Input
              id="date"
              type="date"
              {...register('date', { required: 'Date is required' })}
              className="bg-white dark:bg-gray-800"
            />
            {errors.date && (
              <p className="text-sm text-red-600">{errors.date.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-700 dark:text-gray-300">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Describe what you did..."
              {...register('notes', { required: 'Notes are required' })}
              className="bg-white dark:bg-gray-800"
              rows={4}
            />
            {errors.notes && (
              <p className="text-sm text-red-600">{errors.notes.message as string}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              {loading ? 'Logging...' : 'Log Activity'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}