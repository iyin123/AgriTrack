import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { type Crop } from "@/api/crops"

interface EditCropDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  crop: Crop | null
  onSubmit: (data: { name: string; type: string; plantingDate: string; notes: string }) => void
}

const cropTypes = [
  'tomato', 'pepper', 'okra', 'amaranth', 'onion', 'jute', 'corn', 'wheat',
  'millet', 'rice', 'yam', 'cassava', 'sweet_potato', 'cocoyam'
]

export function EditCropDialog({ open, onOpenChange, crop, onSubmit }: EditCropDialogProps) {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm()

  console.log('EditCropDialog rendered, open:', open, 'crop:', crop)

  useEffect(() => {
    if (crop && open) {
      setValue('name', crop.name)
      setValue('type', crop.type)
      setValue('plantingDate', crop.plantingDate)
      setValue('notes', crop.notes || '')
    }
  }, [crop, open, setValue])

  const handleFormSubmit = async (data: any) => {
    setLoading(true)
    try {
      console.log('Updating crop data:', data)
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
            Edit Crop
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Update your crop information and notes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Crop Name</Label>
            <Input
              id="name"
              placeholder="e.g., Tomatoes Plot A"
              {...register('name', { required: 'Crop name is required' })}
              className="bg-white dark:bg-gray-800"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-gray-700 dark:text-gray-300">Crop Type</Label>
            <Select onValueChange={(value) => setValue('type', value)} defaultValue={crop?.type}>
              <SelectTrigger className="bg-white dark:bg-gray-800">
                <SelectValue placeholder="Select crop type" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800">
                {cropTypes.map((type) => (
                  <SelectItem key={type} value={type} className="capitalize">
                    {type.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-600">{errors.type.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="plantingDate" className="text-gray-700 dark:text-gray-300">Planting Date</Label>
            <Input
              id="plantingDate"
              type="date"
              {...register('plantingDate', { required: 'Planting date is required' })}
              className="bg-white dark:bg-gray-800"
            />
            {errors.plantingDate && (
              <p className="text-sm text-red-600">{errors.plantingDate.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-700 dark:text-gray-300">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this crop..."
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
              {loading ? 'Updating...' : 'Update Crop'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}