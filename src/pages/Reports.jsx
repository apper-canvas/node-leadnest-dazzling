import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Chart from 'react-apexcharts'
import { format, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns'
import ApperIcon from '../components/ApperIcon'

const Reports = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('30days')
  const [selectedTeamMember, setSelectedTeamMember] = useState('all')
  const [isExporting, setIsExporting] = useState(false)
  const [activeReportTab, setActiveReportTab] = useState('overview')

  // Sample data - in real app this would come from an API
  const [reportsData, setReportsData] = useState({
    salesPerformance: {
      revenue: {
        current: 125000,
        previous: 98000,
        change: 27.6
      },
      deals: {
        closed: 24,
        inProgress: 18,
        conversion: 62.5
      },
      monthlyRevenue: [
        { month: 'Jan', revenue: 45000 },
        { month: 'Feb', revenue: 52000 },
        { month: 'Mar', revenue: 48000 },
        { month: 'Apr', revenue: 65000 },
        { month: 'May', revenue: 72000 },
        { month: 'Jun', revenue: 85000 }
      ]
    },
    leadAnalytics: {
      totalLeads: 142,
      qualifiedLeads: 89,
      conversionRate: 62.7,
      sources: [
        { name: 'Website', count: 45, percentage: 31.7 },
        { name: 'Referral', count: 38, percentage: 26.8 },
        { name: 'Social Media', count: 32, percentage: 22.5 },
        { name: 'Email Campaign', count: 27, percentage: 19.0 }
      ],
      pipelineData: [
        { stage: 'New', count: 25, value: 125000 },
        { stage: 'Qualified', count: 18, value: 230000 },
        { stage: 'Proposal', count: 12, value: 180000 },
        { stage: 'Negotiation', count: 8, value: 160000 },
        { stage: 'Closed Won', count: 6, value: 95000 }
      ]
    },
    taskMetrics: {
      completionRate: 78.5,
      averageTime: 2.4,
      overdueTasks: 12,
      productivity: [
        { day: 'Mon', completed: 15, assigned: 18 },
        { day: 'Tue', completed: 22, assigned: 25 },
        { day: 'Wed', completed: 18, assigned: 20 },
        { day: 'Thu', completed: 25, assigned: 28 },
        { day: 'Fri', completed: 20, assigned: 22 }
      ]
    },
    teamPerformance: [
      { name: 'Sarah Johnson', deals: 8, revenue: 45000, tasks: 24 },
      { name: 'Mike Chen', deals: 6, revenue: 38000, tasks: 18 },
      { name: 'Emily Davis', deals: 5, revenue: 32000, tasks: 22 },
      { name: 'David Wilson', deals: 5, revenue: 28000, tasks: 16 }
    ]
  })

  const dateRangeOptions = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'custom', label: 'Custom Range' }
  ]

  const teamMembers = [
    { value: 'all', label: 'All Team Members' },
    { value: 'sarah', label: 'Sarah Johnson' },
    { value: 'mike', label: 'Mike Chen' },
    { value: 'emily', label: 'Emily Davis' },
    { value: 'david', label: 'David Wilson' }
  ]

  const reportTabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'sales', label: 'Sales', icon: 'TrendingUp' },
    { id: 'leads', label: 'Leads', icon: 'Users' },
    { id: 'tasks', label: 'Tasks', icon: 'CheckSquare' },
    { id: 'team', label: 'Team', icon: 'UsersRound' }
  ]

  // Chart configurations
  const revenueChartOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      sparkline: { enabled: false }
    },
    colors: ['#FF7A59'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: reportsData.salesPerformance.monthlyRevenue.map(item => item.month)
    },
    yaxis: {
      labels: {
        formatter: (value) => `$${(value / 1000).toFixed(0)}k`
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value.toLocaleString()}`
      }
    }
  }

  const leadSourceChartOptions = {
    chart: {
      type: 'donut'
    },
    colors: ['#FF7A59', '#0091AE', '#10B981', '#F59E0B'],
    labels: reportsData.leadAnalytics.sources.map(source => source.name),
    legend: {
      position: 'bottom'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%'
        }
      }
    }
  }

  const pipelineChartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false }
    },
    colors: ['#0091AE'],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4
      }
    },
    xaxis: {
      categories: reportsData.leadAnalytics.pipelineData.map(item => item.stage)
    },
    yaxis: {
      labels: {
        formatter: (value) => `$${(value / 1000).toFixed(0)}k`
      }
    }
  }

  const taskProductivityOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false }
    },
    colors: ['#10B981', '#EF4444'],
    plotOptions: {
      bar: {
        columnWidth: '60%'
      }
    },
    xaxis: {
      categories: reportsData.taskMetrics.productivity.map(item => item.day)
    },
    legend: {
      position: 'top'
    }
  }

  const handleDateRangeChange = (range) => {
    setSelectedDateRange(range)
    toast.info(`Date range updated to ${dateRangeOptions.find(opt => opt.value === range)?.label}`)
    // In real app, this would trigger data refetch
  }

  const handleTeamMemberChange = (member) => {
    setSelectedTeamMember(member)
    toast.info(`Filter updated to ${teamMembers.find(tm => tm.value === member)?.label}`)
    // In real app, this would trigger data refetch
  }

  const handleExportReport = async (format) => {
    setIsExporting(true)
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success(`Report exported successfully as ${format.toUpperCase()}`)
    } catch (error) {
      toast.error('Failed to export report')
    } finally {
      setIsExporting(false)
    }
  }

  const handleRefreshData = async () => {
    try {
      toast.info('Refreshing report data...')
      // Simulate data refresh
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Report data refreshed successfully')
    } catch (error) {
      toast.error('Failed to refresh data')
    }
  }

  const StatCard = ({ title, value, change, icon, color = 'hubspot-orange' }) => (
    <motion.div
      className="card-hubspot p-6"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-${color}/10 flex items-center justify-center`}>
          <ApperIcon name={icon} className={`w-6 h-6 text-${color}`} />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm ${
            change > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <ApperIcon 
              name={change > 0 ? 'TrendingUp' : 'TrendingDown'} 
              className="w-4 h-4" 
            />
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-hubspot-gray-800">{value}</p>
        <p className="text-sm text-hubspot-gray-500">{title}</p>
      </div>
    </motion.div>
  )

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${reportsData.salesPerformance.revenue.current.toLocaleString()}`}
          change={reportsData.salesPerformance.revenue.change}
          icon="DollarSign"
          color="hubspot-orange"
        />
        <StatCard
          title="Active Leads"
          value={reportsData.leadAnalytics.totalLeads}
          change={12.5}
          icon="Users"
          color="hubspot-blue"
        />
        <StatCard
          title="Tasks Completed"
          value={`${reportsData.taskMetrics.completionRate}%`}
          change={5.2}
          icon="CheckSquare"
          color="green-500"
        />
        <StatCard
          title="Deals Closed"
          value={reportsData.salesPerformance.deals.closed}
          change={8.7}
          icon="Target"
          color="purple-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-hubspot p-6">
          <h3 className="text-lg font-semibold text-hubspot-gray-800 mb-4">Revenue Trend</h3>
          <Chart
            options={revenueChartOptions}
            series={[{
              name: 'Revenue',
              data: reportsData.salesPerformance.monthlyRevenue.map(item => item.revenue)
            }]}
            type="area"
            height={300}
          />
        </div>

        <div className="card-hubspot p-6">
          <h3 className="text-lg font-semibold text-hubspot-gray-800 mb-4">Lead Sources</h3>
          <Chart
            options={leadSourceChartOptions}
            series={reportsData.leadAnalytics.sources.map(source => source.count)}
            type="donut"
            height={300}
          />
        </div>
      </div>
    </div>
  )

  const renderSalesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${reportsData.salesPerformance.revenue.current.toLocaleString()}`}
          change={reportsData.salesPerformance.revenue.change}
          icon="DollarSign"
        />
        <StatCard
          title="Deals Closed"
          value={reportsData.salesPerformance.deals.closed}
          icon="Target"
        />
        <StatCard
          title="Conversion Rate"
          value={`${reportsData.salesPerformance.deals.conversion}%`}
          icon="TrendingUp"
        />
      </div>

      <div className="card-hubspot p-6">
        <h3 className="text-lg font-semibold text-hubspot-gray-800 mb-4">Monthly Revenue Performance</h3>
        <Chart
          options={revenueChartOptions}
          series={[{
            name: 'Revenue',
            data: reportsData.salesPerformance.monthlyRevenue.map(item => item.revenue)
          }]}
          type="area"
          height={400}
        />
      </div>
    </div>
  )

  const renderLeadsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Leads"
          value={reportsData.leadAnalytics.totalLeads}
          icon="Users"
          color="hubspot-blue"
        />
        <StatCard
          title="Qualified Leads"
          value={reportsData.leadAnalytics.qualifiedLeads}
          icon="UserCheck"
          color="green-500"
        />
        <StatCard
          title="Conversion Rate"
          value={`${reportsData.leadAnalytics.conversionRate}%`}
          icon="TrendingUp"
          color="purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-hubspot p-6">
          <h3 className="text-lg font-semibold text-hubspot-gray-800 mb-4">Lead Sources Distribution</h3>
          <Chart
            options={leadSourceChartOptions}
            series={reportsData.leadAnalytics.sources.map(source => source.count)}
            type="donut"
            height={350}
          />
        </div>

        <div className="card-hubspot p-6">
          <h3 className="text-lg font-semibold text-hubspot-gray-800 mb-4">Pipeline Value by Stage</h3>
          <Chart
            options={pipelineChartOptions}
            series={[{
              name: 'Value',
              data: reportsData.leadAnalytics.pipelineData.map(item => item.value)
            }]}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  )

  const renderTasksTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Completion Rate"
          value={`${reportsData.taskMetrics.completionRate}%`}
          icon="CheckSquare"
          color="green-500"
        />
        <StatCard
          title="Average Time"
          value={`${reportsData.taskMetrics.averageTime} days`}
          icon="Clock"
          color="hubspot-blue"
        />
        <StatCard
          title="Overdue Tasks"
          value={reportsData.taskMetrics.overdueTasks}
          icon="AlertTriangle"
          color="red-500"
        />
      </div>

      <div className="card-hubspot p-6">
        <h3 className="text-lg font-semibold text-hubspot-gray-800 mb-4">Weekly Task Productivity</h3>
        <Chart
          options={taskProductivityOptions}
          series={[
            {
              name: 'Completed',
              data: reportsData.taskMetrics.productivity.map(item => item.completed)
            },
            {
              name: 'Assigned',
              data: reportsData.taskMetrics.productivity.map(item => item.assigned)
            }
          ]}
          type="bar"
          height={400}
        />
      </div>
    </div>
  )

  const renderTeamTab = () => (
    <div className="space-y-6">
      <div className="card-hubspot p-6">
        <h3 className="text-lg font-semibold text-hubspot-gray-800 mb-4">Team Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-hubspot-gray-200">
                <th className="text-left py-3 px-4 font-medium text-hubspot-gray-600">Team Member</th>
                <th className="text-left py-3 px-4 font-medium text-hubspot-gray-600">Deals Closed</th>
                <th className="text-left py-3 px-4 font-medium text-hubspot-gray-600">Revenue Generated</th>
                <th className="text-left py-3 px-4 font-medium text-hubspot-gray-600">Tasks Completed</th>
                <th className="text-left py-3 px-4 font-medium text-hubspot-gray-600">Performance</th>
              </tr>
            </thead>
            <tbody>
              {reportsData.teamPerformance.map((member, index) => {
                const performance = Math.round((member.deals * 10 + member.revenue / 1000 + member.tasks * 2) / 3)
                return (
                  <motion.tr
                    key={member.name}
                    className="border-b border-hubspot-gray-100 hover:bg-hubspot-gray-50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-hubspot-orange rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium text-hubspot-gray-800">{member.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-hubspot-gray-600">{member.deals}</td>
                    <td className="py-4 px-4 text-hubspot-gray-600">${member.revenue.toLocaleString()}</td>
                    <td className="py-4 px-4 text-hubspot-gray-600">{member.tasks}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-hubspot-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-hubspot-orange rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(performance, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm text-hubspot-gray-600">{performance}%</span>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-hubspot-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-hubspot-gray-800">Reports & Analytics</h1>
            <p className="text-hubspot-gray-600 mt-1">Comprehensive insights into your business performance</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Date Range Selector */}
            <select
              value={selectedDateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className="input-hubspot text-sm py-2 px-3 min-w-[140px]"
            >
              {dateRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Team Member Filter */}
            <select
              value={selectedTeamMember}
              onChange={(e) => handleTeamMemberChange(e.target.value)}
              className="input-hubspot text-sm py-2 px-3 min-w-[160px]"
            >
              {teamMembers.map(member => (
                <option key={member.value} value={member.value}>
                  {member.label}
                </option>
              ))}
            </select>

            {/* Action Buttons */}
            <button
              onClick={handleRefreshData}
              className="btn-secondary text-sm py-2 px-3 flex items-center gap-2"
            >
              <ApperIcon name="RefreshCw" className="w-4 h-4" />
              Refresh
            </button>

            <div className="relative group">
              <button className="btn-hubspot text-sm py-2 px-3 flex items-center gap-2">
                <ApperIcon name="Download" className="w-4 h-4" />
                Export
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-hubspot border border-hubspot-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="p-2">
                  {['PDF', 'Excel', 'CSV'].map(format => (
                    <button
                      key={format}
                      onClick={() => handleExportReport(format.toLowerCase())}
                      disabled={isExporting}
                      className="w-full text-left px-3 py-2 text-sm text-hubspot-gray-700 hover:bg-hubspot-gray-50 rounded-md transition-colors disabled:opacity-50"
                    >
                      Export as {format}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Report Tabs */}
        <motion.div
          className="border-b border-hubspot-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex space-x-8 overflow-x-auto">
            {reportTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveReportTab(tab.id)}
                className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeReportTab === tab.id
                    ? 'border-hubspot-orange text-hubspot-orange'
                    : 'border-transparent text-hubspot-gray-500 hover:text-hubspot-gray-700'
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Report Content */}
        <motion.div
          key={activeReportTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeReportTab === 'overview' && renderOverviewTab()}
          {activeReportTab === 'sales' && renderSalesTab()}
          {activeReportTab === 'leads' && renderLeadsTab()}
          {activeReportTab === 'tasks' && renderTasksTab()}
          {activeReportTab === 'team' && renderTeamTab()}
        </motion.div>
      </div>
    </div>
  )
}

export default Reports