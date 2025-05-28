import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { format, isAfter, isToday, isTomorrow } from 'date-fns'

const taskStatuses = [
  { id: 'todo', name: 'To Do', color: 'blue' },
  { id: 'in-progress', name: 'In Progress', color: 'yellow' },
  { id: 'review', name: 'Review', color: 'purple' },
  { id: 'done', name: 'Done', color: 'green' }
]

const priorityLevels = [
  { value: 'low', label: 'Low', color: 'gray' },
  { value: 'medium', label: 'Medium', color: 'blue' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'urgent', label: 'Urgent', color: 'red' }
]

const taskTypes = ['Follow-up', 'Meeting', 'Property Viewing', 'Documentation', 'Research', 'Call', 'Email', 'Other']

const sampleTasks = [
  {
    id: '1',
    title: 'Follow up with Sarah Johnson',
    description: 'Call to discuss property viewing schedule',
    type: 'Follow-up',
    priority: 'high',
    status: 'todo',
    assignedTo: 'Agent Demo',
    relatedLead: 'Sarah Johnson',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    completedAt: null
  },
  {
    id: '2',
    title: 'Property viewing - Downtown Condo',
    description: 'Show Michael Chen the 2BR condo on Main Street',
    type: 'Property Viewing',
    priority: 'medium',
    status: 'in-progress',
    assignedTo: 'Agent Demo',
    relatedLead: 'Michael Chen',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    completedAt: null
  },
  {
    id: '3',
    title: 'Prepare listing documentation',
    description: 'Compile all necessary documents for the Riverside property',
    type: 'Documentation',
    priority: 'medium',
    status: 'review',
    assignedTo: 'Agent Demo',
    relatedLead: null,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    completedAt: null
  },
  {
    id: '4',
    title: 'Send welcome email to Emily Rodriguez',
    description: 'Send new client welcome package and next steps',
    type: 'Email',
    priority: 'low',
    status: 'done',
    assignedTo: 'Agent Demo',
    relatedLead: 'Emily Rodriguez',
    dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
  }
]

function Tasks() {
  const [tasks, setTasks] = useState(sampleTasks)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [showTaskDetail, setShowTaskDetail] = useState(false)

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.relatedLead && task.relatedLead.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getTasksByStatus = (status) => {
    return filteredTasks.filter(task => task.status === status)
  }

  const addNewTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      status: 'todo',
      assignedTo: 'Agent Demo',
      createdAt: new Date(),
      completedAt: null
    }
    setTasks(prev => [...prev, newTask])
    toast.success('Task created successfully!')
  }

  const updateTask = (taskId, updatedData) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            ...updatedData,
            completedAt: updatedData.status === 'done' && task.status !== 'done' 
              ? new Date() 
              : updatedData.status !== 'done' 
              ? null 
              : task.completedAt
          }
        : task
    ))
    toast.success('Task updated successfully!')
  }

  const deleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(task => task.id !== taskId))
      toast.success('Task deleted successfully!')
      setShowTaskDetail(false)
      setSelectedTask(null)
    }
  }

  const updateTaskStatus = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus })
  }

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('text/plain', task.id)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, newStatus) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('text/plain')
    updateTaskStatus(taskId, newStatus)
  }

  const getPriorityColor = (priority) => {
    const priorityObj = priorityLevels.find(p => p.value === priority)
    return priorityObj ? priorityObj.color : 'gray'
  }

  const formatDueDate = (date) => {
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    return format(date, 'MMM d')
  }

  const isDueToday = (date) => isToday(date)
  const isOverdue = (date) => isAfter(new Date(), date) && !isToday(date)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
              <p className="mt-2 text-gray-600">Organize and track your daily tasks and activities</p>
            </div>
            <button
              onClick={() => setShowTaskForm(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <ApperIcon name="Plus" size={20} />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              {taskStatuses.map(status => (
                <option key={status.id} value={status.id}>{status.name}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              {priorityLevels.map(priority => (
                <option key={priority.value} value={priority.value}>{priority.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Task Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {taskStatuses.map(status => (
            <div key={status.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className={`px-4 py-3 bg-${status.color}-50 border-b border-gray-200`}>
                <h3 className="font-semibold text-gray-900 flex items-center justify-between">
                  {status.name}
                  <span className={`bg-${status.color}-100 text-${status.color}-800 text-xs px-2 py-1 rounded-full`}>
                    {getTasksByStatus(status.id).length}
                  </span>
                </h3>
              </div>
              <div
                className="p-4 min-h-[400px] space-y-3"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status.id)}
              >
                <AnimatePresence>
                  {getTasksByStatus(status.id).map(task => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      onClick={() => {
                        setSelectedTask(task)
                        setShowTaskDetail(true)
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm leading-tight">{task.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium bg-${getPriorityColor(task.priority)}-100 text-${getPriorityColor(task.priority)}-800`}>
                          {priorityLevels.find(p => p.value === task.priority)?.label}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded">{task.type}</span>
                        <span className={`${
                          isOverdue(task.dueDate) ? 'text-red-600 font-medium' :
                          isDueToday(task.dueDate) ? 'text-orange-600 font-medium' :
                          'text-gray-500'
                        }`}>
                          {formatDueDate(task.dueDate)}
                        </span>
                      </div>
                      
                      {task.relatedLead && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-gray-600">
                          <ApperIcon name="User" size={12} />
                          <span>{task.relatedLead}</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Form Modal */}
      <AnimatePresence>
        {showTaskForm && (
          <TaskForm
            task={editingTask}
            onSubmit={(taskData) => {
              if (editingTask) {
                updateTask(editingTask.id, taskData)
              } else {
                addNewTask(taskData)
              }
              setShowTaskForm(false)
              setEditingTask(null)
            }}
            onCancel={() => {
              setShowTaskForm(false)
              setEditingTask(null)
            }}
          />
        )}
      </AnimatePresence>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {showTaskDetail && selectedTask && (
          <TaskDetailView
            task={selectedTask}
            onClose={() => {
              setShowTaskDetail(false)
              setSelectedTask(null)
            }}
            onEdit={(task) => {
              setEditingTask(task)
              setShowTaskForm(true)
              setShowTaskDetail(false)
            }}
            onDelete={deleteTask}
            onStatusChange={(taskId, newStatus) => {
              updateTaskStatus(taskId, newStatus)
              setSelectedTask(prev => ({ ...prev, status: newStatus }))
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function TaskForm({ task, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    type: task?.type || 'Follow-up',
    priority: task?.priority || 'medium',
    relatedLead: task?.relatedLead || '',
    dueDate: task?.dueDate ? format(task.dueDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error('Please enter a task title')
      return
    }
    
    onSubmit({
      ...formData,
      dueDate: new Date(formData.dueDate)
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {task ? 'Edit Task' : 'Add New Task'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Describe the task details..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {taskTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {priorityLevels.map(priority => (
                    <option key={priority.value} value={priority.value}>{priority.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Related Lead</label>
              <input
                type="text"
                value={formData.relatedLead}
                onChange={(e) => setFormData(prev => ({ ...prev, relatedLead: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Lead name (optional)"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                {task ? 'Update Task' : 'Add Task'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}

function TaskDetailView({ task, onClose, onEdit, onDelete, onStatusChange }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
              <p className="text-gray-600 text-sm mt-1">Task Details</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${getPriorityColor(task.priority)}-100 text-${getPriorityColor(task.priority)}-800`}>
                {priorityLevels.find(p => p.value === task.priority)?.label} Priority
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{task.description || 'No description provided.'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Type</h3>
                <p className="text-gray-600">{task.type}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Status</h3>
                <select
                  value={task.status}
                  onChange={(e) => onStatusChange(task.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {taskStatuses.map(status => (
                    <option key={status.id} value={status.id}>{status.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Due Date</h3>
                <p className={`text-sm ${
                  isOverdue(task.dueDate) ? 'text-red-600 font-medium' :
                  isDueToday(task.dueDate) ? 'text-orange-600 font-medium' :
                  'text-gray-600'
                }`}>
                  {format(task.dueDate, 'MMM d, yyyy')}
                  {isOverdue(task.dueDate) && ' (Overdue)'}
                  {isDueToday(task.dueDate) && ' (Due Today)'}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Assigned To</h3>
                <p className="text-gray-600">{task.assignedTo}</p>
              </div>
            </div>
            
            {task.relatedLead && (
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Related Lead</h3>
                <p className="text-gray-600">{task.relatedLead}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Created</h3>
                <p className="text-gray-600 text-sm">{format(task.createdAt, 'MMM d, yyyy h:mm a')}</p>
              </div>
              {task.completedAt && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Completed</h3>
                  <p className="text-gray-600 text-sm">{format(task.completedAt, 'MMM d, yyyy h:mm a')}</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => onEdit(task)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <ApperIcon name="Edit" size={16} />
                Edit Task
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <ApperIcon name="Trash2" size={16} />
                Delete
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function getPriorityColor(priority) {
  const priorityObj = priorityLevels.find(p => p.value === priority)
  return priorityObj ? priorityObj.color : 'gray'
}

function isDueToday(date) {
  return isToday(date)
}

function isOverdue(date) {
  return isAfter(new Date(), date) && !isToday(date)
}

export default Tasks