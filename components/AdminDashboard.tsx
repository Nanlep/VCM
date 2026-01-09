
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, FileText, Shield, Briefcase, TrendingUp, DollarSign, Activity, Search, Download, LogOut } from 'lucide-react';
import { Button } from './Button';
import { AdminStats, AuditLogEntry, ConsultantApplication } from '../types';
import { getAdminStats, getAuditLogs, getConsultantApplications } from '../services/adminService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface AdminDashboardProps {
  onExit: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'logs' | 'partners'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [applications, setApplications] = useState<ConsultantApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [s, l, a] = await Promise.all([
        getAdminStats(),
        getAuditLogs(),
        getConsultantApplications()
      ]);
      setStats(s);
      setLogs(l);
      setApplications(a);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
           <p className="text-slate-500 font-medium">Loading Admin Console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col fixed h-full z-20 shadow-2xl">
         <div className="p-6 border-b border-slate-800 bg-slate-900">
             <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
                 <Shield className="text-red-500" /> SUPER ADMIN
             </div>
             <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">System Control</div>
         </div>
         
         <nav className="flex-1 p-4 space-y-2">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                <LayoutDashboard size={18} /> Overview
            </button>
            <button 
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                <Users size={18} /> User Management
            </button>
            <button 
                onClick={() => setActiveTab('logs')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'logs' ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                <FileText size={18} /> Audit Logs
            </button>
            <button 
                onClick={() => setActiveTab('partners')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'partners' ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                <Briefcase size={18} /> Partners <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{applications.filter(a => a.status === 'pending').length}</span>
            </button>
         </nav>

         <div className="p-4 border-t border-slate-800 space-y-2">
             <button onClick={onExit} className="w-full flex items-center gap-2 text-slate-400 hover:text-white text-sm px-4 py-2 hover:bg-slate-800 rounded transition-colors">
                 <Activity size={16} /> Exit to App
             </button>
             <button onClick={onLogout} className="w-full flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm px-4 py-2 hover:bg-slate-800 rounded transition-colors">
                 <LogOut size={16} /> Sign Out
             </button>
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
         <header className="flex justify-between items-center mb-8">
             <div>
                 <h1 className="text-2xl font-bold text-slate-800 capitalize">{activeTab}</h1>
                 <p className="text-slate-500 text-sm">Real-time system monitoring and management.</p>
             </div>
             <div className="flex items-center gap-3">
                 <div className="bg-white border border-slate-200 rounded-full px-4 py-2 flex items-center gap-2 text-sm text-slate-500 shadow-sm">
                     <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                     Systems Operational
                 </div>
                 <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold border-2 border-slate-200 shadow-md">
                     SA
                 </div>
             </div>
         </header>

         {activeTab === 'overview' && stats && (
             <div className="space-y-8 animate-in fade-in duration-300">
                 {/* KPI Cards */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                         <div className="flex justify-between items-start mb-4">
                             <div className="p-3 bg-brand-50 rounded-lg text-brand-600"><Users size={24} /></div>
                             <span className="text-green-500 text-xs font-bold flex items-center gap-1"><TrendingUp size={12}/> +12%</span>
                         </div>
                         <div className="text-3xl font-bold text-slate-900">{stats.totalUsers}</div>
                         <div className="text-sm text-slate-500">Total Registered Users</div>
                     </div>
                     <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                         <div className="flex justify-between items-start mb-4">
                             <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><LayoutDashboard size={24} /></div>
                             <span className="text-green-500 text-xs font-bold flex items-center gap-1"><TrendingUp size={12}/> +5%</span>
                         </div>
                         <div className="text-3xl font-bold text-slate-900">{stats.totalSessions}</div>
                         <div className="text-sm text-slate-500">Strategy Sessions Created</div>
                     </div>
                     <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                         <div className="flex justify-between items-start mb-4">
                             <div className="p-3 bg-green-50 rounded-lg text-green-600"><DollarSign size={24} /></div>
                             <span className="text-green-500 text-xs font-bold flex items-center gap-1"><TrendingUp size={12}/> +24%</span>
                         </div>
                         <div className="text-3xl font-bold text-slate-900">${stats.totalRevenue.toLocaleString()}</div>
                         <div className="text-sm text-slate-500">Total Revenue (MRR)</div>
                     </div>
                     <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                         <div className="flex justify-between items-start mb-4">
                             <div className="p-3 bg-purple-50 rounded-lg text-purple-600"><Shield size={24} /></div>
                             <span className="text-slate-400 text-xs font-bold">SOC 2 Ready</span>
                         </div>
                         <div className="text-3xl font-bold text-slate-900">{stats.complianceScore}%</div>
                         <div className="text-sm text-slate-500">Security Compliance Score</div>
                     </div>
                 </div>

                 {/* Charts Row */}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                         <h3 className="font-bold text-slate-800 mb-6">User Growth (30 Days)</h3>
                         <div className="h-64">
                             <ResponsiveContainer width="100%" height="100%">
                                 <LineChart data={[
                                     {name: 'W1', val: 10}, {name: 'W2', val: 25}, {name: 'W3', val: 45}, {name: 'W4', val: 80}
                                 ]}>
                                     <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                                     <Tooltip />
                                     <Line type="monotone" dataKey="val" stroke="#0d9488" strokeWidth={3} dot={{r: 4, fill:'#0d9488'}} />
                                 </LineChart>
                             </ResponsiveContainer>
                         </div>
                     </div>
                     <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                         <h3 className="font-bold text-slate-800 mb-6">Activity by Event Type</h3>
                         <div className="h-64">
                             <ResponsiveContainer width="100%" height="100%">
                                 <BarChart data={[
                                     {name: 'Logins', val: 120}, {name: 'Votes', val: 450}, {name: 'Sessions', val: 80}, {name: 'Exports', val: 45}
                                 ]}>
                                     <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                                     <Tooltip cursor={{fill: '#f1f5f9'}} />
                                     <Bar dataKey="val" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                 </BarChart>
                             </ResponsiveContainer>
                         </div>
                     </div>
                 </div>
             </div>
         )}

         {activeTab === 'users' && (
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
                 <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                     <div className="relative">
                         <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                         <input type="text" placeholder="Search users..." className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand-500 w-64" />
                     </div>
                     <Button size="sm" variant="outline"><Download size={14} className="mr-2"/> Export CSV</Button>
                 </div>
                 <table className="w-full text-sm text-left">
                     <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
                         <tr>
                             <th className="px-6 py-4">User</th>
                             <th className="px-6 py-4">Role</th>
                             <th className="px-6 py-4">Status</th>
                             <th className="px-6 py-4">Last Active</th>
                             <th className="px-6 py-4 text-right">Actions</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                         {/* Mock Users Table Rows */}
                         {[1,2,3,4,5].map(i => (
                             <tr key={i} className="hover:bg-slate-50">
                                 <td className="px-6 py-4">
                                     <div className="font-bold text-slate-800">User {i}</div>
                                     <div className="text-xs text-slate-500">user{i}@example.com</div>
                                 </td>
                                 <td className="px-6 py-4"><span className="bg-brand-50 text-brand-700 px-2 py-1 rounded text-xs font-bold">Pro Plan</span></td>
                                 <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Active</span></td>
                                 <td className="px-6 py-4 text-slate-500">2 hours ago</td>
                                 <td className="px-6 py-4 text-right text-slate-400 hover:text-brand-600 cursor-pointer font-bold">Manage</td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
         )}

         {activeTab === 'logs' && (
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
                 <div className="p-4 border-b border-slate-100 bg-slate-50">
                     <h3 className="font-bold text-slate-700">System Audit Trail (Immutable)</h3>
                 </div>
                 <div className="overflow-x-auto">
                     <table className="w-full text-sm text-left font-mono">
                         <thead className="bg-white text-slate-500 uppercase text-xs font-bold border-b border-slate-100">
                             <tr>
                                 <th className="px-6 py-3">Timestamp</th>
                                 <th className="px-6 py-3">Action</th>
                                 <th className="px-6 py-3">User ID</th>
                                 <th className="px-6 py-3">IP Address</th>
                                 <th className="px-6 py-3">Resource</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                             {logs.map(log => (
                                 <tr key={log.id} className="hover:bg-slate-50">
                                     <td className="px-6 py-3 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                                     <td className="px-6 py-3 font-bold text-slate-700">{log.action}</td>
                                     <td className="px-6 py-3 text-brand-600">{log.user_id}</td>
                                     <td className="px-6 py-3 text-slate-400">{log.ip_address}</td>
                                     <td className="px-6 py-3 text-slate-500 truncate max-w-xs">{log.metadata}</td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
             </div>
         )}

         {activeTab === 'partners' && (
             <div className="space-y-4 animate-in fade-in duration-300">
                 {applications.map(app => (
                     <div key={app.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                         <div>
                             <div className="flex items-center gap-3 mb-1">
                                 <h4 className="font-bold text-lg text-slate-900">{app.full_name}</h4>
                                 <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${app.status === 'pending' ? 'bg-amber-100 text-amber-700' : app.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{app.status}</span>
                             </div>
                             <div className="text-sm text-slate-500 flex gap-4">
                                 <span>{app.email}</span>
                                 <a href={`https://${app.linkedin_url}`} target="_blank" className="text-brand-600 hover:underline">LinkedIn Profile</a>
                                 <span className="text-slate-400">Applied: {new Date(app.created_at).toLocaleDateString()}</span>
                             </div>
                         </div>
                         <div className="flex gap-2">
                             {app.status === 'pending' && (
                                 <>
                                     <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 border-red-200">Reject</Button>
                                     <Button size="sm" className="bg-green-600 hover:bg-green-700">Approve & Certify</Button>
                                 </>
                             )}
                             {app.status !== 'pending' && (
                                 <Button size="sm" variant="ghost" disabled>Archived</Button>
                             )}
                         </div>
                     </div>
                 ))}
                 {applications.length === 0 && (
                     <div className="text-center p-12 text-slate-400">No applications found.</div>
                 )}
             </div>
         )}
      </main>
    </div>
  );
};
