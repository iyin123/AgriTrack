import { NavLink, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Sprout, 
  CheckSquare, 
  Activity, 
  Calendar, 
  User, 
  MessageSquare,
  Leaf
} from "lucide-react"

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Crops', href: '/crops', icon: Sprout },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Activities', href: '/activities', icon: Activity },
  { name: 'Monthly Recommendations', href: '/recommendations', icon: Calendar },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Feedback', href: '/feedback', icon: MessageSquare },
]

export function Sidebar() {
  const location = useLocation()
  console.log('Sidebar rendered, current location:', location.pathname)

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-r border-gray-200/50 dark:border-gray-700/50">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <Leaf className="h-8 w-8 text-green-600" />
          <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            AgroPlanner
          </span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105",
                  isActive
                    ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-green-600 dark:hover:text-green-400"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            )
          })}
        </nav>
      </div>
    </div>
  )
}