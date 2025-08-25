import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMonthlyRecommendations, getRecommendationHistory, type MonthlyRecommendation, type CropRecommendation } from "@/api/recommendations"
import { addCrop } from "@/api/crops"
import { useToast } from "@/hooks/useToast"
import { Calendar, Sprout, Plus, Clock, Sun, Droplets, Lightbulb, ChevronDown, ChevronUp } from "lucide-react"

export function MonthlyRecommendations() {
  const [currentRecommendations, setCurrentRecommendations] = useState<MonthlyRecommendation | null>(null)
  const [history, setHistory] = useState<MonthlyRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCrop, setExpandedCrop] = useState<string | null>(null)
  const { toast } = useToast()

  console.log('MonthlyRecommendations component rendered')

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      console.log('Fetching recommendations...')
      const [currentData, historyData] = await Promise.all([
        getMonthlyRecommendations(),
        getRecommendationHistory()
      ])
      setCurrentRecommendations(currentData.recommendations)
      setHistory(historyData.history)
      console.log('Recommendations loaded')
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      toast({
        title: "Error",
        description: "Failed to load recommendations",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddCropFromRecommendation = async (crop: CropRecommendation) => {
    try {
      console.log('Adding crop from recommendation:', crop.name)
      const response = await addCrop({
        name: crop.name,
        type: crop.type,
        plantingDate: new Date().toISOString().split('T')[0],
        notes: `Added from ${currentRecommendations?.month} recommendations`
      })
      toast({
        title: "Success",
        description: `${crop.name} added to your crops!`
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Monthly Recommendations
        </h1>
      </div>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">This Month</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          {currentRecommendations && (
            <>
              {/* Header Card */}
              <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <Calendar className="h-6 w-6" />
                    {currentRecommendations.month} {currentRecommendations.year} Recommendations
                  </CardTitle>
                  <CardDescription className="text-green-600 dark:text-green-400">
                    Personalized crop suggestions for optimal farming success
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Sun className="h-4 w-4 text-yellow-500" />
                    <span className="text-green-700 dark:text-green-300">
                      Weather Forecast: {currentRecommendations.weatherForecast}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-green-700 dark:text-green-300 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      General Tips for This Month:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-green-600 dark:text-green-400">
                      {currentRecommendations.generalTips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Crops */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {currentRecommendations.crops.map((crop) => (
                  <Card key={crop._id} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-200 hover:scale-105">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{crop.icon}</span>
                          <div>
                            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {crop.name}
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                              {crop.description}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="text-gray-700 dark:text-gray-300">
                            Plant: {crop.optimalPlantingDates}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-green-600" />
                          <span className="text-gray-700 dark:text-gray-300">
                            Harvest: {crop.expectedHarvestTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4 text-yellow-600" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {crop.weatherConsiderations}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedCrop(expandedCrop === crop._id ? null : crop._id)}
                        className="w-full"
                      >
                        {expandedCrop === crop._id ? (
                          <>
                            <ChevronUp className="mr-2 h-4 w-4" />
                            Hide Details
                          </>
                        ) : (
                          <>
                            <ChevronDown className="mr-2 h-4 w-4" />
                            Show Planting Tips
                          </>
                        )}
                      </Button>

                      {expandedCrop === crop._id && (
                        <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">Planting Tips:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                            {crop.plantingTips.map((tip, index) => (
                              <li key={index}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <Button
                        onClick={() => handleAddCropFromRecommendation(crop)}
                        className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add to My Crops
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {history.length > 0 ? (
            <div className="space-y-4">
              {history.map((recommendation) => (
                <Card key={recommendation._id} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Calendar className="h-5 w-5" />
                      {recommendation.month} {recommendation.year}
                    </CardTitle>
                    <CardDescription>
                      {recommendation.weatherForecast}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">General Tips:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        {recommendation.generalTips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No recommendation history yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Previous months' recommendations will appear here
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}