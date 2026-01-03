import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Zap, 
  Power, 
  Clock, 
  Settings, 
  Calendar, 
  Activity,
  Timer,
  Lightbulb,
  AlertTriangle,
  BarChart3,
  Target,
  Package,
  Snowflake,
  ShowerHead,
  Waves,
  Zap as ZapIcon,
  Fan
} from 'lucide-react';

interface Appliance {
  id: string;
  name: string;
  icon: React.ReactNode;
  isOn: boolean;
  powerUsage: number; // watts
  estimatedCost: number; // per hour
  category: 'essential' | 'high-usage' | 'convenience' | 'seasonal';
  efficiency: number; // percentage
  schedule?: {
    startTime: string;
    endTime: string;
    enabled: boolean;
  };
}

const ApplianceManager: React.FC = () => {
  const [appliances, setAppliances] = useState<Appliance[]>([
    {
      id: '1',
      name: 'Washing Machine',
      icon: <Package className="w-6 h-6" />,
      isOn: false,
      powerUsage: 2200,
      estimatedCost: 3.5,
      category: 'convenience',
      efficiency: 85,
      schedule: { startTime: '06:00', endTime: '22:00', enabled: true }
    },
    {
      id: '2',
      name: 'Refrigerator',
      icon: <Snowflake className="w-6 h-6" />,
      isOn: true,
      powerUsage: 150,
      estimatedCost: 0.24,
      category: 'essential',
      efficiency: 92,
      schedule: { startTime: '00:00', endTime: '23:59', enabled: true }
    },
    {
      id: '3',
      name: 'Geyser',
      icon: <ShowerHead className="w-6 h-6" />,
      isOn: true,
      powerUsage: 3000,
      estimatedCost: 4.8,
      category: 'high-usage',
      efficiency: 78,
      schedule: { startTime: '05:00', endTime: '23:00', enabled: true }
    },
    {
      id: '4',
      name: 'Pool Pump',
      icon: <Waves className="w-6 h-6" />,
      isOn: false,
      powerUsage: 1100,
      estimatedCost: 1.76,
      category: 'seasonal',
      efficiency: 88,
      schedule: { startTime: '08:00', endTime: '16:00', enabled: false }
    },
    {
      id: '5',
      name: 'Air Conditioner',
      icon: <Fan className="w-6 h-6" />,
      isOn: false,
      powerUsage: 2500,
      estimatedCost: 4.0,
      category: 'high-usage',
      efficiency: 82,
      schedule: { startTime: '18:00', endTime: '06:00', enabled: false }
    },
    {
      id: '6',
      name: 'Microwave',
      icon: <ZapIcon className="w-6 h-6" />,
      isOn: false,
      powerUsage: 1200,
      estimatedCost: 1.92,
      category: 'convenience',
      efficiency: 90,
      schedule: { startTime: '06:00', endTime: '22:00', enabled: false }
    }
  ]);

  const toggleAppliance = (id: string) => {
    setAppliances(appliances.map(appliance => 
      appliance.id === id 
        ? { ...appliance, isOn: !appliance.isOn }
        : appliance
    ));
  };

  const getTotalPowerUsage = () => {
    return appliances
      .filter(appliance => appliance.isOn)
      .reduce((total, appliance) => total + appliance.powerUsage, 0);
  };

  const getTotalCostPerHour = () => {
    return appliances
      .filter(appliance => appliance.isOn)
      .reduce((total, appliance) => total + appliance.estimatedCost, 0);
  };

  const getAverageEfficiency = () => {
    const activeAppliances = appliances.filter(appliance => appliance.isOn);
    if (activeAppliances.length === 0) return 0;
    return activeAppliances.reduce((total, appliance) => total + appliance.efficiency, 0) / activeAppliances.length;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'essential': return 'bg-green-100 text-green-800';
      case 'high-usage': return 'bg-red-100 text-red-800';
      case 'convenience': return 'bg-blue-100 text-blue-800';
      case 'seasonal': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAppliancesByCategory = (category: string) => {
    return appliances.filter(appliance => appliance.category === category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-3 text-gray-700 hover:text-indigo-600 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Settings className="w-6 h-6 text-indigo-600" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Appliance Management
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Smart Appliance Control</h2>
          <p className="text-gray-600">Monitor, control, and optimize your home appliances for maximum efficiency</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Stats and Controls */}
          <div className="lg:col-span-3 space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Power className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white/80">Current Usage</div>
                    <div className="text-2xl font-bold">{getTotalPowerUsage()}W</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white/80">Cost/Hour</div>
                    <div className="text-2xl font-bold">R{getTotalCostPerHour().toFixed(2)}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white/80">Active Devices</div>
                    <div className="text-2xl font-bold">{appliances.filter(a => a.isOn).length}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white/80">Avg Efficiency</div>
                    <div className="text-2xl font-bold">{getAverageEfficiency().toFixed(0)}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Appliances by Category */}
            {['essential', 'high-usage', 'convenience', 'seasonal'].map(category => {
              const categoryAppliances = getAppliancesByCategory(category);
              if (categoryAppliances.length === 0) return null;

              return (
                <div key={category} className="bg-white rounded-3xl shadow-lg p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 capitalize">
                      {category === 'high-usage' ? 'High Usage' : category} Appliances
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(category)}`}>
                      {categoryAppliances.length} devices
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categoryAppliances.map((appliance) => (
                      <div key={appliance.id} className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              appliance.isOn ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'
                            }`}>
                              {appliance.icon}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{appliance.name}</h4>
                              <p className="text-sm text-gray-600">
                                {appliance.powerUsage}W • R{appliance.estimatedCost}/hour
                              </p>
                            </div>
                          </div>

                          {/* Enhanced Toggle Switch */}
                          <div className="flex flex-col items-end space-y-2">
                            <button
                              onClick={() => toggleAppliance(appliance.id)}
                              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                appliance.isOn ? 'bg-indigo-600' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-lg ${
                                  appliance.isOn ? 'translate-x-7' : 'translate-x-1'
                                }`}
                              />
                            </button>
                            <div className={`text-xs font-medium ${
                              appliance.isOn ? 'text-green-600' : 'text-gray-500'
                            }`}>
                              {appliance.isOn ? 'ON' : 'OFF'}
                            </div>
                          </div>
                        </div>

                        {/* Efficiency Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">Efficiency</span>
                            <span className="text-sm font-medium text-gray-900">{appliance.efficiency}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                appliance.efficiency > 85 ? 'bg-green-500' : 
                                appliance.efficiency > 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${appliance.efficiency}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Schedule and Actions */}
                        <div className="flex items-center justify-between">
                          {appliance.schedule && appliance.schedule.enabled ? (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{appliance.schedule.startTime} - {appliance.schedule.endTime}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">No schedule</span>
                          )}

                          <div className="flex space-x-2">
                            <button className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-600 hover:text-indigo-600">
                              <Timer className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-600 hover:text-indigo-600">
                              <Settings className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Energy Efficiency Score */}
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
                      className="text-indigo-500"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={`${getAverageEfficiency()}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-900">{getAverageEfficiency().toFixed(0)}%</span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Energy Efficiency</h3>
                <p className="text-sm text-gray-600">Overall system performance</p>
              </div>
            </div>

            {/* Load Shedding Alert */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
              <div className="flex items-center space-x-3 mb-3">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                <h3 className="font-semibold text-orange-900">Load Shedding Alert</h3>
              </div>
              <p className="text-sm text-orange-700 mb-2">Stage 2 - Today 18:00-20:30</p>
              <p className="text-xs text-orange-600 mb-4">Essential appliances will be prioritized automatically</p>
              <div className="text-xs text-orange-600">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Refrigerator - Will continue</span>
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Geyser - Will be paused</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Pool Pump - Will be paused</span>
                </div>
              </div>
            </div>

            {/* Energy Saving Tips */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Smart Energy Tips</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-700">Schedule high-usage appliances during off-peak hours</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-700">Set geyser to heat only when needed</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-700">Use appliance timers to avoid standby power</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-700">Regular maintenance improves efficiency by 10-15%</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-4">
              <button className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow group">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-indigo-200 transition-colors">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">Schedule All</p>
              </button>
              
              <button className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow group">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-purple-200 transition-colors">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">Usage Report</p>
              </button>

              <button className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow group">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-teal-200 transition-colors">
                  <Zap className="w-6 h-6 text-teal-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">Auto Optimize</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplianceManager;