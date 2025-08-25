import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { submitFeedback, getFeedback, type Feedback } from "@/api/feedback"
import { useToast } from "@/hooks/useToast"
import { useForm } from "react-hook-form"
import { Send, MessageSquare, CheckCircle, Clock, AlertCircle } from "lucide-react"

const feedbackCategories = [
  { value: 'general_feedback', label: 'General Feedback' },
  { value: 'bug_report', label: 'Bug Report' },
  { value: 'feature_request', label: 'Feature Request' },
  { value: 'crop_recommendations', label: 'Crop Recommendations' }
]

export function Feedback() {
  const [feedbackHistory, setFeedbackHistory] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()
  const { toast } = useToast()

  console.log('Feedback component rendered')

  useEffect(() => {
    fetchFeedbackHistory()
  }, [])

  const fetchFeedbackHistory = async () => {
    try {
      console.log('Fetching feedback history...')
      const data = await getFeedback()
      setFeedbackHistory(data.feedback)
      console.log('Feedback history loaded:', data.feedback.length)
    } catch (error) {
      console.error('Error fetching feedback:', error)
      toast({
        title: "Error",
        description: "Failed to load feedback history",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitFeedback = async (data: any) => {
    setSubmitting(true)
    try {
      console.log('Submitting feedback:', data)
      const response = await submitFeedback(data)
      setFeedbackHistory(prev => [response.feedback, ...prev])
      reset()
      toast({
        title: "Success",
        description: response.message
      })
    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in_progress': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'pending': return <AlertCircle className="h-4 w-4 text-gray-600" />
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bug_report': return 'bg-red-100 text-red-800 border-red-200'
      case 'feature_request': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'crop_recommendations': return 'bg-green-100 text-green-800 border-green-200'
      case 'general_feedback': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Feedback
        </h1>
      </div>

      <Tabs defaultValue="submit" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="submit">Submit Feedback</TabsTrigger>
          <TabsTrigger value="history">My Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="submit">
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <MessageSquare className="h-5 w-5" />
                Submit Feedback
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Help us improve AgroPlanner by sharing your thoughts, reporting bugs, or suggesting new features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(handleSubmitFeedback)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-gray-700 dark:text-gray-300">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your feedback"
                      {...register('subject', { required: 'Subject is required' })}
                      className="bg-white dark:bg-gray-800"
                    />
                    {errors.subject && (
                      <p className="text-sm text-red-600">{errors.subject.message as string}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">Category</Label>
                    <Select onValueChange={(value) => setValue('category', value)}>
                      <SelectTrigger className="bg-white dark:bg-gray-800">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800">
                        {feedbackCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-red-600">{errors.category.message as string}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-700 dark:text-gray-300">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Please provide detailed feedback..."
                    {...register('message', { required: 'Message is required' })}
                    className="bg-white dark:bg-gray-800"
                    rows={6}
                  />
                  {errors.message && (
                    <p className="text-sm text-red-600">{errors.message.message as string}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {submitting ? 'Submitting...' : 'Submit Feedback'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="h-5 bg-gray-200 rounded w-48"></div>
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : feedbackHistory.length > 0 ? (
              feedbackHistory.map((feedback) => (
                <Card key={feedback._id} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                        {feedback.subject}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryColor(feedback.category)}>
                          {feedbackCategories.find(cat => cat.value === feedback.category)?.label}
                        </Badge>
                        <Badge className={getStatusColor(feedback.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(feedback.status)}
                            {feedback.status.replace('_', ' ')}
                          </div>
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Submitted on {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <p className="text-gray-700 dark:text-gray-300">{feedback.message}</p>
                    </div>
                    
                    {feedback.response && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Response:</h4>
                        <p className="text-blue-800 dark:text-blue-200">{feedback.response}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No feedback submitted yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Your feedback submissions will appear here
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}