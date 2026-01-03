import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { ArrowLeft, Zap, TrendingUp, Battery, Clock, DollarSign, Lightbulb, AlertCircle, Calendar, BarChart3, ArrowRight } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ElectricityMonitor: React.FC = () => {
  const [electricityData] = useState({
    currentBalance: 145.3,
    remainingDays: 3,
    lastTopUp: { amount: 200, date: '28 Sept' },
    dailyUsage: [12, 15, 18, 14, 16, 13, 17], // Last 7 days
    monthlyUsage: 450.5,
    projectedUsage: 520,
    costThisMonth: 720,
    avgDailyUsage: 15.2,
    peakUsageHour: '19:00',
    efficiency: 82
  });

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Daily Usage (kWh)',
        data: electricityData.dailyUsage,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const chartOptions = {
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
            return value + ' kWh';
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

  const handleTopUp = () => {
    alert('Top-up functionality would be implemented here');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-3 text-gray-700 hover:text-emerald-600 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Zap className="w-6 h-6 text-emerald-600" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Electricity Management
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Power Control Center</h2>
          <p className="text-gray-600">Monitor and optimize your electricity usage with smart insights</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Battery className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white/90">Current Balance</h3>
                      <p className="text-white/70 text-sm">Available Power</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{electricityData.currentBalance}</div>
                    <div className="text-white/90 text-sm">kWh remaining</div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/90 text-sm">Usage Progress</span>
                    <span className="text-white/90 text-sm">{Math.round((electricityData.currentBalance / 500) * 100)}% remaining</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div 
                      className="bg-white h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(electricityData.currentBalance / 500) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-white/90">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">≈ {electricityData.remainingDays} days remaining</span>
                  </div>
                  <button 
                    onClick={handleTopUp}
                    className="bg-white text-emerald-600 px-6 py-2 rounded-xl font-semibold hover:bg-white/90 transition-colors flex items-center space-x-2"
                  >
                    <span>Top Up</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-sm text-gray-600">Monthly Usage</div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{electricityData.monthlyUsage}</div>
                <div className="text-sm text-gray-500">kWh this month</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-sm text-gray-600">Daily Average</div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{electricityData.avgDailyUsage}</div>
                <div className="text-sm text-gray-500">kWh per day</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="text-sm text-gray-600">Cost This Month</div>
                </div>
                <div className="text-2xl font-bold text-gray-900">R{electricityData.costThisMonth}</div>
                <div className="text-sm text-gray-500">Total spent</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-sm text-gray-600">Peak Usage</div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{electricityData.peakUsageHour}</div>
                <div className="text-sm text-gray-500">Daily peak time</div>
              </div>
            </div>

            {/* Usage Chart */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Weekly Usage Trend</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Last 7 days</span>
                </div>
              </div>
              <div className="h-64">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Efficiency Score */}
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
                      className="text-emerald-500"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={`${electricityData.efficiency}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-900">{electricityData.efficiency}%</span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Efficiency Score</h3>
                <p className="text-sm text-gray-600">Your energy efficiency this month</p>
              </div>
            </div>

            {/* Energy Tips */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Energy Saving Tips</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-700">Switch off appliances when not in use - save up to 15% monthly</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-700">Use LED lights instead of incandescent bulbs</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-700">Set geyser temperature to 60°C or lower</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-700">Load shedding prep: charge devices in advance</p>
                </div>
              </div>
            </div>

            {/* Low Balance Alert */}
            {electricityData.remainingDays <= 3 && (
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border border-red-200">
                <div className="flex items-center space-x-3 mb-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <h3 className="font-semibold text-red-900">Low Balance Alert</h3>
                </div>
                <p className="text-sm text-red-700 mb-4">Your electricity balance is running low. Consider topping up soon to avoid interruptions.</p>
                <button 
                  onClick={handleTopUp}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-red-700 transition-colors"
                >
                  Top Up Now
                </button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow group">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-200 transition-colors">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">Usage History</p>
              </button>
              
              <button className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow group">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-green-200 transition-colors">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">Set Budget Alert</p>
              </button>
            </div>

            {/* Last Top-up Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Last Top-Up</p>
                  <p className="text-sm text-gray-600">R{electricityData.lastTopUp.amount} on {electricityData.lastTopUp.date}</p>
                </div>
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectricityMonitor;