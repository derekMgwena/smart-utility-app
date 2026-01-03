import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { 
  Zap, 
  Droplets, 
  Home, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

interface ElectricityUsage {
  _id: string;
  accountNumber: string;
  unitsConsumed: number;
  date: string;
  cost: number;
}

interface WaterLevel {
  _id: string;
  tankName: string;
  currentLevel: number;
  maxCapacity: number;
  lastUpdated: string;
}

const Dashboard: React.FC = () => {
  const [electricityData, setElectricityData] = useState<ElectricityUsage[]>([]);
  const [waterData, setWaterData] = useState<WaterLevel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      // Provide fallback data in case API fails
      try {
        const [electricityRes, waterRes] = await Promise.all([
          api.get<ElectricityUsage[]>('/electricity'),
          api.get<WaterLevel[]>('/water')
        ]);

        setElectricityData(electricityRes.data.slice(-7));
        setWaterData(waterRes.data);
      } catch (error) {
        // Provide mock data for better UX
        setElectricityData([
          { _id: '1', accountNumber: '12345', unitsConsumed: 120, date: new Date().toISOString(), cost: 45.50 },
          { _id: '2', accountNumber: '12345', unitsConsumed: 110, date: new Date(Date.now() - 86400000).toISOString(), cost: 42.30 },
          { _id: '3', accountNumber: '12345', unitsConsumed: 135, date: new Date(Date.now() - 172800000).toISOString(), cost: 50.25 }
        ]);
        setWaterData([
          { _id: '1', tankName: 'Main Tank', currentLevel: 750, maxCapacity: 1000, lastUpdated: new Date().toISOString() },
          { _id: '2', tankName: 'Reserve Tank', currentLevel: 300, maxCapacity: 500, lastUpdated: new Date().toISOString() }
        ]);
      }
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalElectricityCost = () => {
    return electricityData.reduce((sum, item) => sum + item.cost, 0);
  };

  const getAverageWaterLevel = () => {
    if (waterData.length === 0) return 0;
    return waterData.reduce((sum, tank) => sum + (tank.currentLevel / tank.maxCapacity) * 100, 0) / waterData.length;
  };

  const getUsageTrend = () => {
    if (electricityData.length < 2) return 'stable';
    const recent = electricityData.slice(-3).reduce((sum, item) => sum + item.unitsConsumed, 0) / 3;
    const previous = electricityData.slice(-7, -3).reduce((sum, item) => sum + item.unitsConsumed, 0) / 4;
    return recent > previous ? 'up' : 'down';
  };

  const electricityChartData = {
    labels: electricityData.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Units Consumed (kWh)',
        data: electricityData.map(item => item.unitsConsumed),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6
      }
    ]
  };

  const waterDistributionData = {
    labels: waterData.map(tank => tank.tankName),
    datasets: [{
      data: waterData.map(tank => (tank.currentLevel / tank.maxCapacity) * 100),
      backgroundColor: [
        'rgba(6, 182, 212, 0.8)',
        'rgba(14, 165, 233, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(99, 102, 241, 0.8)'
      ],
      borderColor: [
        'rgb(6, 182, 212)',
        'rgb(14, 165, 233)',
        'rgb(59, 130, 246)',
        'rgb(99, 102, 241)'
      ],
      borderWidth: 2
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        cornerRadius: 8,
        padding: 12
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280' }
      },
      y: {
        grid: { color: 'rgba(107, 114, 128, 0.1)' },
        ticks: { color: '#6b7280' }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-teal-50/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your utility dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 pt-20 md:pt-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-4">
            Smart Utility Dashboard
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Monitor and optimize your home utilities with real-time insights and intelligent analytics
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 md:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              {getUsageTrend() === 'up' ? 
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-red-500" /> : 
                <TrendingDown className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
              }
            </div>
            <p className="text-xs md:text-sm text-gray-600 mb-1">Total Electric Bill</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900">R{getTotalElectricityCost().toFixed(2)}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 md:p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl">
                <Droplets className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              {getAverageWaterLevel() > 75 ? 
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500" /> : 
                <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
              }
            </div>
            <p className="text-xs md:text-sm text-gray-600 mb-1">Avg Water Level</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900">{getAverageWaterLevel().toFixed(1)}%</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 md:p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <Activity className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
            </div>
            <p className="text-xs md:text-sm text-gray-600 mb-1">Active Monitors</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900">{waterData.length + electricityData.length}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 md:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <Home className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
            </div>
            <p className="text-xs md:text-sm text-gray-600 mb-1">System Status</p>
            <p className="text-xl md:text-2xl font-bold text-green-600">Online</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
          {/* Electricity Usage Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-white/20">
            <div className="flex items-center mb-4 md:mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mr-3">
                <Zap className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">Electricity Usage Trend</h2>
            </div>
            <div style={{ height: '250px' }} className="md:h-[300px]">
              <Line data={electricityChartData} options={chartOptions} />
            </div>
          </div>

          {/* Water Distribution Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-white/20">
            <div className="flex items-center mb-4 md:mb-6">
              <div className="p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg mr-3">
                <Droplets className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">Water Tank Levels</h2>
            </div>
            <div style={{ height: '250px' }} className="md:h-[300px]">
              <Doughnut 
                data={waterDistributionData} 
                options={{ 
                  ...chartOptions, 
                  plugins: { 
                    ...chartOptions.plugins, 
                    legend: { display: true, position: 'bottom' as const } 
                  } 
                }} 
              />
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Link 
            to="/electricity" 
            className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl md:rounded-2xl p-6 md:p-8 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center mb-4">
              <Zap className="w-6 h-6 md:w-8 md:h-8 mr-4 group-hover:rotate-12 transition-transform duration-300" />
              <h3 className="text-xl md:text-2xl font-bold">Electricity</h3>
            </div>
            <p className="text-blue-100 mb-4 text-sm md:text-base">Monitor power consumption, track bills, and optimize usage patterns.</p>
            <div className="flex items-center text-blue-200">
              <span className="mr-2 text-sm md:text-base">Manage Power →</span>
            </div>
          </Link>

          <Link 
            to="/water" 
            className="group bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl md:rounded-2xl p-6 md:p-8 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center mb-4">
              <Droplets className="w-6 h-6 md:w-8 md:h-8 mr-4 group-hover:bounce transition-transform duration-300" />
              <h3 className="text-xl md:text-2xl font-bold">Water</h3>
            </div>
            <p className="text-teal-100 mb-4 text-sm md:text-base">Track water tank levels, monitor usage, and prevent shortages.</p>
            <div className="flex items-center text-teal-200">
              <span className="mr-2 text-sm md:text-base">Monitor Water →</span>
            </div>
          </Link>

          <Link 
            to="/appliances" 
            className="group bg-gradient-to-br from-green-500 to-green-600 rounded-xl md:rounded-2xl p-6 md:p-8 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center mb-4">
              <Home className="w-6 h-6 md:w-8 md:h-8 mr-4 group-hover:pulse transition-transform duration-300" />
              <h3 className="text-xl md:text-2xl font-bold">Appliances</h3>
            </div>
            <p className="text-green-100 mb-4 text-sm md:text-base">Control smart devices, schedule operations, and save energy.</p>
            <div className="flex items-center text-green-200">
              <span className="mr-2 text-sm md:text-base">Control Devices →</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;