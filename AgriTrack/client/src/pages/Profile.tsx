import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getProfile, updateProfile, uploadProfilePicture, type UserProfile } from "@/api/profile"
import { useToast } from "@/hooks/useToast"
import { useForm } from "react-hook-form"
import { User, Camera, Save, MapPin, Phone, Building } from "lucide-react"

export function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const { toast } = useToast()

  console.log('Profile component rendered')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile...')
      const data = await getProfile()
      setProfile(data.profile)
      reset(data.profile)
      console.log('Profile loaded')
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (data: any) => {
    setSaving(true)
    try {
      console.log('Updating profile:', data)
      const response = await updateProfile(data)
      setProfile(response.profile)
      toast({
        title: "Success",
        description: response.message
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      console.log('Uploading profile picture...')
      const response = await uploadProfilePicture(file)
      setProfile(prev => prev ? { ...prev, profilePicture: response.profilePicture } : null)
      toast({
        title: "Success",
        description: response.message
      })
    } catch (error) {
      console.error('Error uploading profile picture:', error)
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Profile
        </h1>
      </div>

      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
        <CardHeader>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.profilePicture} alt={`${profile.firstName} ${profile.lastName}`} />
                <AvatarFallback className="text-lg bg-gradient-to-br from-green-100 to-blue-100 text-green-700">
                  {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <label className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Camera className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                {profile.firstName} {profile.lastName}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {profile.email}
              </CardDescription>
              {profile.farmName && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  {profile.farmName}
                </p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300">First Name</Label>
                <Input
                  id="firstName"
                  {...register('firstName', { required: 'First name is required' })}
                  className="bg-white dark:bg-gray-800"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300">Last Name</Label>
                <Input
                  id="lastName"
                  {...register('lastName', { required: 'Last name is required' })}
                  className="bg-white dark:bg-gray-800"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+234 801 234 5678"
                  {...register('phone')}
                  className="bg-white dark:bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="farmName" className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Farm Name
                </Label>
                <Input
                  id="farmName"
                  placeholder="e.g., Green Valley Farm"
                  {...register('farmName')}
                  className="bg-white dark:bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="farmLocation" className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Farm Location
                </Label>
                <Input
                  id="farmLocation"
                  placeholder="e.g., Ibadan, Oyo State"
                  {...register('farmLocation')}
                  className="bg-white dark:bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="farmSize" className="text-gray-700 dark:text-gray-300">Farm Size</Label>
                <Input
                  id="farmSize"
                  placeholder="e.g., 5 acres or 10 plots"
                  {...register('farmSize')}
                  className="bg-white dark:bg-gray-800"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Account Information</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Your account details and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Email Address</Label>
              <p className="text-gray-900 dark:text-gray-100 font-medium">{profile.email}</p>
            </div>
            <div>
              <Label className="text-gray-700 dark:text-gray-300">State</Label>
              <p className="text-gray-900 dark:text-gray-100 font-medium">{profile.state}</p>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              To change your email address or state, please contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}