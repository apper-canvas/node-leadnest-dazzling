import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { format } from 'date-fns'

function MainFeature() {
  const [leads, setLeads] = useState([])
  const [selectedLead, setSelectedLead] = useState(null)
  const [showAddLead, setShowAddLead] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [draggedLead, setDraggedLead] = useState(null)

  const pipelineStages = [
    { id: 'new', name: 'New Leads', status: 'new', color: 'blue' },
    { id: 'contacted', name: 'Contacted', status: 'contacted', color: 'yellow' },
    { id: 'qualified', name: 'Qualified', status: 'qualified', color: 'purple' },
    { id: 'proposal', name: 'Proposal Sent', status: 'proposal', color: 'orange' },
    { id: 'won', name: 'Won', status: 'won', color: 'green' },
    { id: 'lost', name: 'Lost', status: 'lost', color: 'red' }
  ]

  const leadSources = ['Website', 'Referral', 'Social Media', 'Cold Call', 'Walk-in', 'Advertisement']
  const propertyTypes = ['House', 'Apartment', 'Condo', 'Townhouse', 'Commercial', 'Land']

  // Initialize with sample data
  useEffect(() => {
    const sampleLeads = [
      {
        id: '1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        source: 'Website',
        status: 'new',
        assignedAgent: 'Agent Demo',
        propertyPreferences: {
          type: 'House',
          bedrooms: 3,
          bathrooms: 2,
          location: 'Downtown'
        },
        budget: 450000,
        createdAt: new Date('2024-01-15'),
        lastContact: new Date('2024-01-15'),
        notes: 'Looking for family home near schools'
      },
      {
        id: '2',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@email.com',
        phone: '+1 (555) 987-6543',
        source: 'Referral',
        status: 'contacted',
        assignedAgent: 'Agent Demo',
        propertyPreferences: {
          type: 'Condo',
          bedrooms: 2,
          bathrooms: 2,
          location: 'Waterfront'
        },
        budget: 350000,
        createdAt: new Date('2024-01-10'),
        lastContact: new Date('2024-01-16'),
        notes: 'First-time buyer, pre-approved'
      },
      {
        id: '3',
        firstName: 'Emily',
        lastName: 'Rodriguez',
        email: 'emily.rodriguez@email.com',
        phone: '+1 (555) 456-7890',
        source: 'Social Media',
        status: 'qualified',
        assignedAgent: 'Agent Demo',
        propertyPreferences: {
          type: 'Apartment',
          bedrooms: 1,
          bathrooms: 1,
          location: 'City Center'
        },
        budget: 280000,
        createdAt: new Date('2024-01-08'),
        lastContact: new Date('2024-01-17'),
        notes: 'Investment property buyer'
      }
    ]
    setLeads(sampleLeads)
  }, [])

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getLeadsByStatus = (status) => {
    return filteredLeads.filter(lead => lead.status === status)
  }

  const addNewLead = (leadData) => {
    const newLead = {
      id: Date.now().toString(),
      ...leadData,
      status: 'new',
      assignedAgent: 'Agent Demo',
      createdAt: new Date(),
      lastContact: new Date()
    }
    setLeads(prev => [...prev, newLead])
    setShowAddLead(false)
    toast.success('New lead added successfully!')
  }

  const updateLeadStatus = (leadId, newStatus) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { ...lead, status: newStatus, lastContact: new Date() }
        : lead
    ))
    toast.success('Lead status updated!')
  }

  const handleDragStart = (e, lead) => {
    setDraggedLead(lead)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, newStatus) => {
    e.preventDefault()
    if (draggedLead && draggedLead.status !== newStatus) {
      updateLeadStatus(draggedLead.id, newStatus)
    }
    setDraggedLead(null)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200">
            Sales Pipeline

          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track your real estate leads through the sales process

          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
          <button
            onClick={() => setShowAddLead(true)}
            className="btn-primary flex items-center justify-center space-x-2 whitespace-nowrap"

          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
          
          <div className="flex space-x-3">
            <div className="relative flex-1 sm:flex-initial">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full sm:w-64"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field w-full sm:w-auto"
            >
              <option value="all">All Status</option>
              {pipelineStages.map(stage => (
                <option key={stage.status} value={stage.status}>
                  {stage.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Pipeline Board */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6"
      >
        {pipelineStages.map((stage, index) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="pipeline-stage"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.status)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                {stage.name}

              </h3>
              <span className={`status-badge status-${stage.status}`}>
                {getLeadsByStatus(stage.status).length}
              </span>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
              <AnimatePresence>
                {getLeadsByStatus(stage.status).map((lead) => (
                  <motion.div
                    key={lead.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ y: -2 }}
                    className="lead-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead)}
                    onClick={() => setSelectedLead(lead)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                        {lead.firstName} {lead.lastName}

                      </h4>
                      <ApperIcon name="MoreVertical" className="w-4 h-4 text-gray-400" />

                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">

                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Mail" className="w-3 h-3" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="DollarSign" className="w-3 h-3" />
                        <span>{formatCurrency(lead.budget)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Calendar" className="w-3 h-3" />
                        <span>{format(lead.lastContact, 'MMM dd')}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">

                        {lead.propertyPreferences.type}
                      </span>
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">

                        {lead.source}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Add Lead Modal */}
      <AnimatePresence>
        {showAddLead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddLead(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <AddLeadForm onSubmit={addNewLead} onCancel={() => setShowAddLead(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead Detail Modal */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedLead(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <LeadDetailView 
                lead={selectedLead} 
                onClose={() => setSelectedLead(null)}
                onStatusChange={updateLeadStatus}
                pipelineStages={pipelineStages}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Add Lead Form Component
function AddLeadForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    source: 'Website',
    propertyPreferences: {
      type: 'House',
      bedrooms: 1,
      bathrooms: 1,
      location: ''
    },
    budget: '',
    notes: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('Please fill in required fields')
      return
    }
    onSubmit({
      ...formData,
      budget: parseInt(formData.budget) || 0
    })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          Add New Lead

        </h2>
        <button
          onClick={onCancel}
          className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"

        >
          <ApperIcon name="X" className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              First Name *

            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Last Name *

            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="input-field"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *

            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone

            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Lead Source

            </label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({...formData, source: e.target.value})}
              className="input-field"
            >
              {['Website', 'Referral', 'Social Media', 'Cold Call', 'Walk-in', 'Advertisement'].map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Budget

            </label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              className="input-field"
              placeholder="$"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Property Preferences

          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Property Type

              </label>
              <select
                value={formData.propertyPreferences.type}
                onChange={(e) => setFormData({
                  ...formData,
                  propertyPreferences: {
                    ...formData.propertyPreferences,
                    type: e.target.value
                  }
                })}
                className="input-field"
              >
                {['House', 'Apartment', 'Condo', 'Townhouse', 'Commercial', 'Land'].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bedrooms

              </label>
              <select
                value={formData.propertyPreferences.bedrooms}
                onChange={(e) => setFormData({
                  ...formData,
                  propertyPreferences: {
                    ...formData.propertyPreferences,
                    bedrooms: parseInt(e.target.value)
                  }
                })}
                className="input-field"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num}+</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bathrooms

              </label>
              <select
                value={formData.propertyPreferences.bathrooms}
                onChange={(e) => setFormData({
                  ...formData,
                  propertyPreferences: {
                    ...formData.propertyPreferences,
                    bathrooms: parseInt(e.target.value)
                  }
                })}
                className="input-field"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}+</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preferred Location

            </label>
            <input
              type="text"
              value={formData.propertyPreferences.location}
              onChange={(e) => setFormData({
                ...formData,
                propertyPreferences: {
                  ...formData.propertyPreferences,
                  location: e.target.value
                }
              })}
              className="input-field"
              placeholder="e.g., Downtown, Waterfront, Suburbs"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes

          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            className="input-field h-24 resize-none"
            placeholder="Additional notes about the lead..."
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">

          <button type="button" onClick={onCancel} className="btn-ghost">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Add Lead
          </button>
        </div>
      </form>
    </div>
  )
}

// Lead Detail View Component
function LeadDetailView({ lead, onClose, onStatusChange, pipelineStages }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            {lead.firstName} {lead.lastName}

          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Lead Details & History

          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"

        >
          <ApperIcon name="X" className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Status & Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">

          <div className="flex items-center space-x-3">
            <span className={`status-badge status-${lead.status}`}>
              {pipelineStages.find(s => s.status === lead.status)?.name}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Created {format(lead.createdAt, 'MMM dd, yyyy')}

            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={lead.status}
              onChange={(e) => onStatusChange(lead.id, e.target.value)}
              className="input-field text-sm py-2"
            >
              {pipelineStages.map(stage => (
                <option key={stage.status} value={stage.status}>
                  {stage.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Contact Information

            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Mail" className="w-5 h-5 text-gray-400" />

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>

                  <p className="font-medium text-gray-800 dark:text-gray-200">{lead.email}</p>

                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <ApperIcon name="Phone" className="w-5 h-5 text-gray-400" />

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>

                  <p className="font-medium text-gray-800 dark:text-gray-200">{lead.phone}</p>

                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <ApperIcon name="UserCheck" className="w-5 h-5 text-gray-400" />

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Assigned Agent</p>

                  <p className="font-medium text-gray-800 dark:text-gray-200">{lead.assignedAgent}</p>

                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <ApperIcon name="Tag" className="w-5 h-5 text-gray-400" />

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Source</p>

                  <p className="font-medium text-gray-800 dark:text-gray-200">{lead.source}</p>

                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Property Preferences

            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Building2" className="w-5 h-5 text-gray-400" />

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Property Type</p>

                  <p className="font-medium text-gray-800 dark:text-gray-200">{lead.propertyPreferences.type}</p>

                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <ApperIcon name="BedDouble" className="w-5 h-5 text-gray-400" />

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Bedrooms / Bathrooms</p>

                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {lead.propertyPreferences.bedrooms} bed / {lead.propertyPreferences.bathrooms} bath
                  </p>

                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <ApperIcon name="MapPin" className="w-5 h-5 text-gray-400" />

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Preferred Location</p>

                  <p className="font-medium text-gray-800 dark:text-gray-200">{lead.propertyPreferences.location}</p>

                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <ApperIcon name="DollarSign" className="w-5 h-5 text-gray-400" />

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Budget</p>

                  <p className="font-medium text-gray-800 dark:text-gray-200">{formatCurrency(lead.budget)}</p>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {lead.notes && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Notes

            </h3>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">

              <p className="text-gray-700 dark:text-gray-300">{lead.notes}</p>

            </div>
          </div>
        )}

        {/* Activity Timeline */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Recent Activity

          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">

              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                <ApperIcon name="UserPlus" className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Lead created</p>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {format(lead.createdAt, 'MMM dd, yyyy \'at\' h:mm a')}

                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">

              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                <ApperIcon name="MessageSquare" className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Last contact</p>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {format(lead.lastContact, 'MMM dd, yyyy \'at\' h:mm a')}

                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button className="btn-secondary flex items-center justify-center space-x-2">
              <ApperIcon name="Phone" className="w-4 h-4" />
              <span>Call Lead</span>
            </button>
            <button className="btn-ghost flex items-center justify-center space-x-2">
              <ApperIcon name="Mail" className="w-4 h-4" />
              <span>Send Email</span>
            </button>
          </div>
          <button onClick={onClose} className="btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default MainFeature