import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import { 
  ArrowLeft, 
  Droplets, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Calendar, 
  DollarSign,
  AlertTriangle,
  Waves,
  Thermometer,
  BarChart3,
  Target,
  Home,
  ShowerHead,
  Utensils,
  Sprout
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const WaterMonitor: React.FC = () => {
  const [waterData] = useState({
    currentUsage: 12.5, // kiloliters this month
    monthlyLimit: 30,
    dailyAverage: 0.4,
    weeklyUsage: [0.3, 0.4, 0.5, 0.3, 0.6, 0.2, 0.4], // Last 7 days in kL
    costThisMonth: 286,
    projectedCost: 420,
    waterPressure: 3.2, // bar
    temperature: 22, // celsius
    qualityScore: 95,
    leakAlert: false,
    usageByCategory: {
      bathroom: 40,
      kitchen: 25,
      laundry: 20,
      garden: 15
    },
    savingsThisMonth: 45,
    comparedToLastMonth: -12 // negative means saving
  });

  const usageChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Daily Usage (kL)',
        data: waterData.weeklyUsage,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const usageChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: '#6b7280',
          callback: function(value: any) {
            return value + ' kL';
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: '#6b7280',
        }
      }
    }
  };

  const categoryChartData = {
    labels: ['Bathroom', 'Kitchen', 'Laundry', 'Garden'],
    datasets: [
      {
        data: [
          waterData.usageByCategory.bathroom,
          waterData.usageByCategory.kitchen,
          waterData.usageByCategory.laundry,
          waterData.usageByCategory.garden
        ],
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#8b5cf6'
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
    },
  };

  const usagePercentage = (waterData.currentUsage / waterData.monthlyLimit) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Droplets className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Water Management
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Water Control Center</h2>
          <p className="text-gray-600">Monitor your water consumption and optimize usage with smart insights</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Usage Overview Card */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Droplets className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white/90">Monthly Usage</h3>
                      <p className="text-white/70 text-sm">{new Date().toLocaleString('default', { month: 'long' })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{waterData.currentUsage}</div>
                    <div className="text-white/90 text-sm">of {waterData.monthlyLimit} kL</div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/90 text-sm">Usage Progress</span>
                    <span className="text-white/90 text-sm">{usagePercentage.toFixed(1)}% used</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        usagePercentage > 80 ? 'bg-red-400' : usagePercentage > 60 ? 'bg-yellow-400' : 'bg-white'
                      }`}
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-white/90">
                    <Activity className="w-4 h-4" />
                    <span className="text-sm">Daily avg: {waterData.dailyAverage} kL</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {waterData.comparedToLastMonth < 0 ? (
                      <div className="flex items-center space-x-1 bg-green-500/20 px-3 py-1 rounded-full">
                        <TrendingDown className="w-4 h-4 text-green-200" />
                        <span className="text-sm text-green-200">{Math.abs(waterData.comparedToLastMonth)}% less</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 bg-red-500/20 px-3 py-1 rounded-full">
                        <TrendingUp className="w-4 h-4 text-red-200" />
                        <span className="text-sm text-red-200">{waterData.comparedToLastMonth}% more</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-sm text-gray-600">Cost This Month</div>
                </div>
                <div className="text-2xl font-bold text-gray-900">R{waterData.costThisMonth}</div>
                <div className="text-sm text-gray-500">Projected: R{waterData.projectedCost}</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-sm text-gray-600">Savings</div>
                </div>
                <div className="text-2xl font-bold text-gray-900">R{waterData.savingsThisMonth}</div>
                <div className="text-sm text-gray-500">vs last month</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Waves className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-sm text-gray-600">Water Pressure</div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{waterData.waterPressure}</div>
                <div className="text-sm text-gray-500">bar</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Thermometer className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="text-sm text-gray-600">Temperature</div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{waterData.temperature}°C</div>
                <div className="text-sm text-gray-500">Current temp</div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Usage Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Weekly Usage</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Last 7 days</span>
                  </div>
                </div>
                <div className="h-48">
                  <Line data={usageChartData} options={usageChartOptions} />
                </div>
              </div>

              {/* Usage Breakdown */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Usage by Category</h3>
                <div className="h-48">
                  <Doughnut data={categoryChartData} options={categoryChartOptions} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Water Quality Score */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 relative">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-blue-500"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={`${waterData.qualityScore}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-900">{waterData.qualityScore}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Water Quality</h3>
                <p className="text-sm text-gray-600">Excellent quality detected</p>
              </div>
            </div>

            {/* Usage Tips */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-cyan-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Water Saving Tips</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-700">Fix dripping taps - save up to 20L per day</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-700">Take shorter showers (5 minutes max)</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-700">Use a dishwasher instead of hand washing</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-700">Water garden early morning or evening</p>
                </div>
              </div>
            </div>

            {/* High Usage Alert */}
            {usagePercentage > 75 && (
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                <div className="flex items-center space-x-3 mb-3">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                  <h3 className="font-semibold text-orange-900">High Usage Alert</h3>
                </div>
                <p className="text-sm text-orange-700 mb-4">You're using more water than usual this month. Consider implementing water-saving measures.</p>
                <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-orange-700 transition-colors">
                  View Usage Tips
                </button>
              </div>
            )}

            {/* Category Breakdown */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Usage Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShowerHead className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Bathroom</span>
                      <span className="text-sm text-gray-600">{waterData.usageByCategory.bathroom}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${waterData.usageByCategory.bathroom}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Utensils className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Kitchen</span>
                      <span className="text-sm text-gray-600">{waterData.usageByCategory.kitchen}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${waterData.usageByCategory.kitchen}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Home className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Laundry</span>
                      <span className="text-sm text-gray-600">{waterData.usageByCategory.laundry}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${waterData.usageByCategory.laundry}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Sprout className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Garden</span>
                      <span className="text-sm text-gray-600">{waterData.usageByCategory.garden}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${waterData.usageByCategory.garden}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow group">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-200 transition-colors">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">Usage Report</p>
              </button>
              
              <button className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow group">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-cyan-200 transition-colors">
                  <Target className="w-6 h-6 text-cyan-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">Set Target</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterMonitor;