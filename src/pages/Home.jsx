import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

function Home() {
  const [darkMode, setDarkMode] = useState(false)
  const navigate = useNavigate()


  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40"

      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm">

                <ApperIcon name="Home" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">LeadNest</h1>
                <p className="text-xs text-surface-600 dark:text-surface-400">Real Estate CRM</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"

              >
                <ApperIcon name={darkMode ? "Sun" : "Moon"} className="w-5 h-5" />
              </button>
              
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center">

                  <ApperIcon name="User" className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Agent Demo</p>

                  <p className="text-xs text-gray-600 dark:text-gray-400">demo@leadnest.com</p>

                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"

      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 sm:space-x-8 overflow-x-auto scrollbar-hide py-3">
            {[
              { name: 'Pipeline', icon: 'BarChart3', active: true, path: '/' },
              { name: 'Leads', icon: 'Users', active: false, path: '/leads' },
              { name: 'Properties', icon: 'Building2', active: false, path: '/properties' },
              { name: 'Tasks', icon: 'CheckSquare', active: false, path: '/tasks' },
              { name: 'Reports', icon: 'TrendingUp', active: false, path: '/reports' }
            ].map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => {
                  if (item.path) {
                    navigate(item.path)
                  }
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  item.active 
                    ? 'bg-primary-500 text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200'
                }`}

              >
                <ApperIcon name={item.icon} className="w-4 h-4" />
                <span className="hidden sm:inline">{item.name}</span>
              </motion.button>
            ))}
          </div>

        </div>

      </motion.nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <MainFeature />
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12"

      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">

                <ApperIcon name="Home" className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">LeadNest CRM</p>

                <p className="text-xs text-gray-600 dark:text-gray-400">Powering real estate success</p>

              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-xs text-gray-600 dark:text-gray-400">

              <span>© 2024 LeadNest</span>
              <span>Version 1.0</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>System Healthy</span>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default Home