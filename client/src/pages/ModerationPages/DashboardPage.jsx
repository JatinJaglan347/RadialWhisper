import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore.js';
import { 
  Users, Shield, PlugZap, Ban, Database, MessageCircle, 
  Activity, LineChart, PieChart, Server, Cpu, Clock
} from 'lucide-react';
import { 
  Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  ComposedChart, Legend, Pie, Cell, PieChart as RechartsPieChart 
} from 'recharts';

const DashboardPage = () => {
  const { fetchOpStats, opStats } = useAuthStore();
  const [filter, setFilter] = useState('daily'); // 'daily' or 'today'

  // When filter changes, call fetchOpStats with the selected range
  useEffect(() => {
    fetchOpStats(filter);
  }, [filter]);

  // Prepare data for the user role pie chart
  const userRoleData = [
    { name: 'Users', value: opStats?.totalUsers || 0, color: '#4FC3F7' },
    { name: 'Admins', value: opStats?.totalAdmins || 0, color: '#FFB74D' },
    { name: 'Moderators', value: opStats?.totalModerators || 0, color: '#D8D9DA' }
  ];

  return (
    <div className="min-h-screen bg-[#272829] text-[#FFF6E0] p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#272829] opacity-80"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#272829] via-[#31333A] to-transparent opacity-90"></div>
      </div>
      
      {/* Animated floating orbs */}
      <div className="absolute top-40 right-20 w-64 h-64 rounded-full bg-[#61677A] blur-[100px] opacity-30 animate-pulse" style={{animationDuration: '7s'}}></div>
      <div className="absolute bottom-60 left-20 w-80 h-80 rounded-full bg-[#61677A] blur-[120px] opacity-20 animate-pulse" style={{animationDuration: '10s'}}></div>
      <div className="absolute top-20 left-1/4 w-40 h-40 rounded-full bg-[#FFF6E0] blur-[80px] opacity-10 animate-pulse" style={{animationDuration: '8s'}}></div>
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #FFF6E0 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="bg-gradient-to-r from-[#FFF6E0]/10 to-transparent p-1 inline-block rounded-full mb-2">
              <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-4 py-1 rounded-full text-sm font-medium">
                Admin Panel
              </span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">
              Dashboard
            </h1>
          </div>
          
          {/* Filter Dropdown */}
          <div className="relative">
            <select 
              className="bg-[#31333A] text-[#FFF6E0] p-3 pr-10 rounded-xl border border-[#61677A]/30 appearance-none shadow-lg"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="daily">Last 30 Days</option>
              <option value="today">Today (Last 24 Hours)</option>
            </select>
            <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#FFF6E0]/70" size={18} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<Users size={32} />} label="Total Users" value={opStats?.totalUsers || 0} />
          <StatCard icon={<Shield size={32} />} label="Total Admins" value={opStats?.totalAdmins || 0} />
          <StatCard icon={<Shield size={32} />} label="Total Moderators" value={opStats?.totalModerators || 0} />
          <StatCard icon={<Ban size={32} />} label="Banned Users" value={opStats?.totalBannedUsers || 0} />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard icon={<PlugZap size={32} />} label="Active Sockets" value={opStats?.activeSockets || 0} />
          <StatCard icon={<Database size={32} />} label="DB Read Ops" value={opStats?.totalReadOps || 0} />
          <StatCard icon={<Database size={32} />} label="DB Write Ops" value={opStats?.totalWriteOps || 0} />
        </div>
        
        {/* OpCounters Section */}
        {opStats?.opcounters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            <OpCounterCard icon={<Server size={20} />} label="Insert" value={opStats.opcounters.insert || 0} />
            <OpCounterCard icon={<Server size={20} />} label="Query" value={opStats.opcounters.query || 0} />
            <OpCounterCard icon={<Server size={20} />} label="Update" value={opStats.opcounters.update || 0} />
            <OpCounterCard icon={<Server size={20} />} label="Delete" value={opStats.opcounters.delete || 0} />
            <OpCounterCard icon={<Server size={20} />} label="Get More" value={opStats.opcounters.getmore || 0} />
            <OpCounterCard icon={<Server size={20} />} label="Command" value={opStats.opcounters.command || 0} />
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User Roles Pie Chart */}
          <ChartContainer title="User Distribution" icon={<PieChart size={24} />}>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPieChart>
                  <Pie
                    data={userRoleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {userRoleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#31333A", color: "#FFF6E0" }} />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {userRoleData.map((entry, index) => (
                  <div key={`legend-${index}`} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: entry.color }}></div>
                    <span className="text-sm">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartContainer>

          {/* Active User Trend Chart */}
          <ChartContainer title="Active User Trend" icon={<Activity size={24} />} className="col-span-1 lg:col-span-2">
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={opStats?.activeUserTrend || []}>
                <defs>
                  <linearGradient id="activeUserGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4FC3F7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4FC3F7" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#61677A" opacity={0.3} />
                <XAxis dataKey="date" stroke="#FFF6E0" />
                <YAxis stroke="#FFF6E0" />
                <Tooltip contentStyle={{ backgroundColor: "#31333A", color: "#FFF6E0" }} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#4FC3F7" 
                  strokeWidth={3}
                  dot={{ stroke: '#4FC3F7', strokeWidth: 2, r: 4, fill: '#272829' }}
                  activeDot={{ stroke: '#FFF6E0', strokeWidth: 2, r: 6, fill: '#4FC3F7' }}
                  fillOpacity={1}
                  fill="url(#activeUserGradient)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Signup Trend Chart */}
          <ChartContainer title="Signup Trend" icon={<LineChart size={24} />}>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={opStats?.signupTrend || []}>
                <defs>
                  <linearGradient id="signupGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D8D9DA" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#D8D9DA" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#61677A" opacity={0.3} />
                <XAxis dataKey="date" stroke="#FFF6E0" />
                <YAxis stroke="#FFF6E0" />
                <Tooltip contentStyle={{ backgroundColor: "#31333A", color: "#FFF6E0" }} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#D8D9DA" 
                  strokeWidth={3}
                  dot={{ stroke: '#D8D9DA', strokeWidth: 2, r: 4, fill: '#272829' }}
                  activeDot={{ stroke: '#FFF6E0', strokeWidth: 2, r: 6, fill: '#D8D9DA' }}
                  fillOpacity={1}
                  fill="url(#signupGradient)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Message Volume Trend Chart */}
          <ChartContainer title="Message Volume Trend" icon={<MessageCircle size={24} />}>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={opStats?.messageTrend || []}>
                <defs>
                  <linearGradient id="messageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFB74D" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FFB74D" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#61677A" opacity={0.3} />
                <XAxis dataKey="date" stroke="#FFF6E0" />
                <YAxis stroke="#FFF6E0" />
                <Tooltip contentStyle={{ backgroundColor: "#31333A", color: "#FFF6E0" }} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#FFB74D" 
                  strokeWidth={3}
                  dot={{ stroke: '#FFB74D', strokeWidth: 2, r: 4, fill: '#272829' }}
                  activeDot={{ stroke: '#FFF6E0', strokeWidth: 2, r: 6, fill: '#FFB74D' }}
                  fillOpacity={1}
                  fill="url(#messageGradient)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon, label, value }) => (
  <div className="p-6 bg-[#31333A]/70 rounded-xl border border-[#61677A]/30 shadow-lg backdrop-blur-sm hover:bg-[#31333A] transition-all duration-300">
    <div className="flex items-center mb-2">
      <div className="p-2 bg-[#FFF6E0]/10 rounded-lg mr-4 text-[#FFF6E0]">
        {icon}
      </div>
      <h2 className="text-xl font-semibold">{label}</h2>
    </div>
    <p className="text-3xl font-bold text-[#FFF6E0] ml-2">{value.toLocaleString()}</p>
  </div>
);

// Smaller Op Counter Card
const OpCounterCard = ({ icon, label, value }) => (
  <div className="p-4 bg-[#31333A]/50 rounded-lg border border-[#61677A]/20 shadow-md backdrop-blur-sm hover:bg-[#31333A]/70 transition-all duration-300 flex items-center">
    <div className="p-1 bg-[#FFF6E0]/10 rounded-lg mr-3 text-[#FFF6E0]">
      {icon}
    </div>
    <div>
      <div>
        <p className="text-sm font-medium text-[#D8D9DA]">{label}</p>
        <p className="text-lg font-bold text-[#FFF6E0]">{value.toLocaleString()}</p>
      </div>
    </div>
  </div>
);

// Reusable Chart Container Component
const ChartContainer = ({ title, icon, children, className = "" }) => (
  <div className={`p-6 bg-[#31333A]/70 rounded-xl border border-[#61677A]/30 shadow-lg backdrop-blur-sm hover:bg-[#31333A] transition-all duration-300 ${className}`}>
    <h2 className="text-xl font-semibold mb-6 flex items-center">
      <div className="p-1 bg-[#FFF6E0]/10 rounded-lg mr-3 text-[#FFF6E0]">
        {icon}
      </div>
      <span>{title}</span>
    </h2>
    {children}
  </div>
);

export default DashboardPage;