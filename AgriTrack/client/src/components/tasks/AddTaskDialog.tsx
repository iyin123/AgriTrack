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

interface AddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { cropId: string; title: string; type: string; dueDate: string; priority: string; notes?: string }) => void
}

const taskTypes = [
  { value: 'watering', label: 'Watering' },
  { value: 'fertilizing', label: 'Fertilizing' },
  { value: 'weeding', label: 'Weeding' },
  { value: 'harvesting', label: 'Harvesting' },
  { value: 'pest_control', label: 'Pest Control' },
  { value: 'custom', label: 'Custom' }
]

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
]

export function AddTaskDialog({ open, onOpenChange, onSubmit }: AddTaskDialogProps) {
  const [loading, setLoading] = useState(false)
  const [crops, setCrops] = useState<Crop[]>([])
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm()
  const { toast } = useToast()

  console.log('AddTaskDialog rendered, open:', open)

  useEffect(() => {
    if (open) {
      fetchCrops()
    }
  }, [open])

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
      console.log('Submitting task data:', data)
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
            Add New Task
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Create a new task for your crops.
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
            <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">Task Title</Label>
            <Input
              id="title"
              placeholder="e.g., Water tomatoes"
              {...register('title', { required: 'Task title is required' })}
              className="bg-white dark:bg-gray-800"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-gray-700 dark:text-gray-300">Task Type</Label>
            <Select onValueChange={(value) => setValue('type', value)}>
              <SelectTrigger className="bg-white dark:bg-gray-800">
                <SelectValue placeholder="Select task type" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800">
                {taskTypes.map((type) => (
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
            <Label htmlFor="dueDate" className="text-gray-700 dark:text-gray-300">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              {...register('dueDate', { required: 'Due date is required' })}
              className="bg-white dark:bg-gray-800"
            />
            {errors.dueDate && (
              <p className="text-sm text-red-600">{errors.dueDate.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className="text-gray-700 dark:text-gray-300">Priority</Label>
            <Select onValueChange={(value) => setValue('priority', value)}>
              <SelectTrigger className="bg-white dark:bg-gray-800">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800">
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.priority && (
              <p className="text-sm text-red-600">{errors.priority.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-700 dark:text-gray-300">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              {...register('notes')}
              className="bg-white dark:bg-gray-800"
              rows={3}
            />
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
              {loading ? 'Adding...' : 'Add Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}