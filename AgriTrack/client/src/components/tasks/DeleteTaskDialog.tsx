import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { type Task } from "@/api/tasks"

interface DeleteTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task | null
  onConfirm: () => void
}

export function DeleteTaskDialog({ open, onOpenChange, task, onConfirm }: DeleteTaskDialogProps) {
  const [loading, setLoading] = useState(false)

  console.log('DeleteTaskDialog rendered, open:', open, 'task:', task)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      console.log('Confirming task deletion')
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
                Delete Task
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete the task <strong>{task?.title}</strong>? This will permanently remove the task.
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
            {loading ? 'Deleting...' : 'Delete Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}