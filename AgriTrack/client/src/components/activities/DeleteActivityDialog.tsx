import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { type Activity } from "@/api/activities"

interface DeleteActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activity: Activity | null
  onConfirm: () => void
}

export function DeleteActivityDialog({ open, onOpenChange, activity, onConfirm }: DeleteActivityDialogProps) {
  const [loading, setLoading] = useState(false)

  console.log('DeleteActivityDialog rendered, open:', open, 'activity:', activity)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      console.log('Confirming activity deletion')
      await onConfirm()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Delete Activity
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete this <strong>{activity?.type.replace('_', ' ')}</strong> activity for <strong>{activity?.cropName}</strong>? This will permanently remove the activity record.
          </p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Activity'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}