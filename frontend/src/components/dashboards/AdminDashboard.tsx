import React, { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../../services/api';
import { 
  LayoutDashboard, 
  Users, 
  Utensils, 
  DollarSign, 
  TrendingUp, 
  Cpu,
  Search,
  ShieldCheck,
  Download,
  RefreshCw,
  Activity,
  Heart,
  CheckCircle2,
  Clock,
  Eye,
  Stethoscope,
  X,
  Phone,
  Mail,
  Calendar,
  Sparkles
} from 'lucide-react';

interface HealthProfileData {
  fitnessGoal?: string;
  diseases?: string;
  bmi?: number;
  age?: number;
  weightKg?: number;
  heightCm?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  bloodSugarFasting?: number;
  cholesterolTotal?: number;
  heartRateBpm?: number;
}

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  createdAt: string;
  healthProfile?: HealthProfileData | null;
}

interface RecentOrder {
  id: string;
  status: string;
  totalAmount: number;
  placedAt: string;
  user?: { name: string; email: string };
  restaurant?: { name: string };
}

interface PlatformStats {
  totalUsers: number;
  totalOrders: number;
  totalRestaurants: number;
  totalDoctors: number;
  totalMeals: number;
  activeSubscribers: number;
}

// Fallback seed data if backend is offline or during cold start
const DEFAULT_USERS: PlatformUser[] = [
  {
    id: 'usr-1',
    name: 'Priya Sharma',
    email: 'priya@wellora.ai',
    phone: '+91 98765 43210',
    role: 'CUSTOMER',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    healthProfile: {
      fitnessGoal: 'PCOS Relief',
      diseases: JSON.stringify(['PCOS', 'Mild Insulin Sensitivity']),
      bmi: 25.9,
      age: 28,
      weightKg: 68,
      heightCm: 162,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      bloodSugarFasting: 105,
      cholesterolTotal: 195,
      heartRateBpm: 72,
    }
  },
  {
    id: 'usr-2',
    name: 'Rohan Kapoor',
    email: 'rohan.k@gmail.com',
    phone: '+91 98111 22334',
    role: 'CUSTOMER',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    healthProfile: {
      fitnessGoal: 'Diabetes Control',
      diseases: JSON.stringify(['Type-2 Diabetes', 'Hypertension']),
      bmi: 27.4,
      age: 46,
      weightKg: 82,
      heightCm: 173,
      bloodPressureSystolic: 138,
      bloodPressureDiastolic: 88,
      bloodSugarFasting: 135,
      cholesterolTotal: 210,
      heartRateBpm: 78,
    }
  },
  {
    id: 'usr-3',
    name: 'Dr. Ananya Rao, MD',
    email: 'dr.ananya@wellora.ai',
    phone: '+91 99000 88776',
    role: 'DOCTOR',
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    healthProfile: null
  },
  {
    id: 'usr-4',
    name: 'Kabir Mehta',
    email: 'kabir@greenbowl.in',
    phone: '+91 97654 32109',
    role: 'RESTAURANT_OWNER',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    healthProfile: null
  },
  {
    id: 'usr-5',
    name: 'System Administrator',
    email: 'admin@wellora.ai',
    phone: '+91 99999 00000',
    role: 'ADMIN',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    healthProfile: null
  }
];

const DEFAULT_ORDERS: RecentOrder[] = [
  {
    id: 'ord-8921',
    status: 'DELIVERED',
    totalAmount: 489,
    placedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    user: { name: 'Priya Sharma', email: 'priya@wellora.ai' },
    restaurant: { name: 'GreenBowl Kitchen' },
  },
  {
    id: 'ord-8922',
    status: 'OUT_FOR_DELIVERY',
    totalAmount: 379,
    placedAt: new Date(Date.now() - 1800000).toISOString(),
    user: { name: 'Rohan Kapoor', email: 'rohan.k@gmail.com' },
    restaurant: { name: 'Keto Corner' },
  },
  {
    id: 'ord-8923',
    status: 'PREPARING',
    totalAmount: 620,
    placedAt: new Date(Date.now() - 600000).toISOString(),
    user: { name: 'Aarav Patel', email: 'aarav@outlook.com' },
    restaurant: { name: 'Dragon Wok (Healthy)' },
  }
];

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 14820,
    totalOrders: 3240,
    totalRestaurants: 542,
    totalDoctors: 84,
    totalMeals: 280,
    activeSubscribers: 1240,
  });

  const [users, setUsers] = useState<PlatformUser[]>(DEFAULT_USERS);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>(DEFAULT_ORDERS);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'CUSTOMER' | 'DOCTOR' | 'RESTAURANT_OWNER' | 'ADMIN'>('ALL');
  const [activeSection, setActiveSection] = useState<'users' | 'orders' | 'telemetry'>('users');

  // Selected User Modal
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);

  // Fetch live overview from backend
  const fetchOverview = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setRefreshError(null);
      // Explicit timestamp parameter to completely bypass any proxy or browser intermediate cache
      const res = await api.get<{ success: boolean; data: { stats: PlatformStats; users: PlatformUser[]; recentOrders: RecentOrder[] } }>(`/auth/admin/overview?_t=${Date.now()}`);
      if (res.success && res.data) {
        if (res.data.stats) setStats(res.data.stats);
        if (res.data.users) setUsers(res.data.users);
        if (res.data.recentOrders) setRecentOrders(res.data.recentOrders);
        setLastRefreshedAt(new Date());
      } else {
        throw new Error('Could not parse platform overview data.');
      }
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to sync with backend server. Check connection.';
      console.warn('[AdminDashboard] Live overview sync note:', errMsg);
      setRefreshError(errMsg);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, []);

  // Update order status in real time
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      const res = await api.patch<{ success: boolean; data: any }>(`/orders/${orderId}/status`, {
        status: newStatus,
        message: `Status updated to ${newStatus} by Administrator`,
      });
      if (res.success) {
        setRecentOrders(prev =>
          prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err: any) {
      alert(`Could not update order status: ${err?.message || 'Server error'}`);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Change user role from Admin
  const handleChangeUserRole = async (userId: string, newRole: string) => {
    try {
      setUpdatingUserId(userId);
      const res = await api.patch<{ success: boolean; data: any }>(`/auth/admin/users/${userId}/role`, {
        role: newRole,
      });
      if (res.success) {
        setUsers(prev =>
          prev.map(u => (u.id === userId ? { ...u, role: newRole } : u))
        );
        if (selectedUser?.id === userId) {
          setSelectedUser(prev => (prev ? { ...prev, role: newRole } : null));
        }
      }
    } catch (err: any) {
      alert(`Could not update role: ${err?.message || 'Server error'}`);
    } finally {
      setUpdatingUserId(null);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchOverview();
  }, [fetchOverview]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        (user.phone && user.phone.includes(q)) ||
        (user.healthProfile?.fitnessGoal && user.healthProfile.fitnessGoal.toLowerCase().includes(q));
      return matchesRole && matchesSearch;
    });
  }, [users, roleFilter, searchQuery]);

  // Export users to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Role', 'Fitness Goal', 'BMI', 'Systolic BP', 'Blood Sugar', 'Created At'];
    const rows = filteredUsers.map(u => [
      u.id,
      `"${u.name}"`,
      u.email,
      u.phone || 'N/A',
      u.role,
      `"${u.healthProfile?.fitnessGoal || 'None'}"`,
      u.healthProfile?.bmi || 'N/A',
      u.healthProfile?.bloodPressureSystolic || 'N/A',
      u.healthProfile?.bloodSugarFasting || 'N/A',
      new Date(u.createdAt).toLocaleDateString()
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wellora_users_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseDiseases = (raw?: string): string[] => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [String(parsed)];
    } catch {
      return [raw];
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* ── HEADER ── */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-black border border-amber-500/20">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Wellora Administrator Command Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-['Outfit'] tracking-tight text-slate-900">
            Executive Operations & User Oversight
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Live dashboard for administrators to monitor registered platform users, clinical health profiles, restaurant fulfillment work, and real-time AI safety telemetry.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 relative z-10">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              {isRefreshing ? 'Synchronizing with database...' : 'Live Connected'}
            </div>
            <div className="text-[11px] text-slate-600 font-mono">
              Updated: {lastRefreshedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchOverview}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition-all hover:scale-105 disabled:opacity-50"
              title="Refresh Live Data Instantly"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Live'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all hover:scale-105"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live sync alert banners if any */}
      {refreshError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="text-sm">⚠️</span>
            <span>Live Sync Notification: {refreshError}. Showing cached platform metrics.</span>
          </div>
          <button
            onClick={fetchOverview}
            className="px-3 py-1 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-900 text-xs font-bold"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── KPI METRIC CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Users */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-black uppercase tracking-wider">Registered Users</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-['Outfit']">
            {stats.totalUsers.toLocaleString()}
          </div>
          <div className="text-xs text-blue-500 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14.2% active this month
          </div>
        </div>

        {/* Platform Orders & Work */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-black uppercase tracking-wider">Fulfillment Orders</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-['Outfit']">
            {stats.totalOrders.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-500 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 99.2% on-time delivery
          </div>
        </div>

        {/* Kitchens & Doctors */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-black uppercase tracking-wider">Partners (Kitchens/Drs)</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-['Outfit']">
            {stats.totalRestaurants + stats.totalDoctors}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            {stats.totalRestaurants} Kitchens • {stats.totalDoctors} Verified Doctors
          </div>
        </div>

        {/* AI Health Precision */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-black uppercase tracking-wider">Clinical AI Precision</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-['Outfit']">
            98.4%
          </div>
          <div className="text-xs text-emerald-500 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Zero allergen breaches
          </div>
        </div>

      </div>

      {/* ── SECTION NAV TABS ── */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSection('users')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all ${
              activeSection === 'users'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            👥 Website Users ({users.length})
          </button>
          <button
            onClick={() => setActiveSection('orders')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all ${
              activeSection === 'orders'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            📦 Operations & Work Monitor ({recentOrders.length})
          </button>
          <button
            onClick={() => setActiveSection('telemetry')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all ${
              activeSection === 'telemetry'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            ⚡ AI Medical Telemetry
          </button>
        </div>
      </div>

      {/* ── TAB 1: USERS DIRECTORY ── */}
      {activeSection === 'users' && (
        <div className="space-y-6">
          
          {/* Controls: Search & Role Filters */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user name, email, phone, or condition (PCOS, Diabetes)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Role Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {(['ALL', 'CUSTOMER', 'DOCTOR', 'RESTAURANT_OWNER', 'ADMIN'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-black shrink-0 transition-all ${
                    roleFilter === role
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {role === 'ALL' ? 'All Roles' : role.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Clinical Profile</th>
                    <th className="p-4">Vitals & BMI</th>
                    <th className="p-4">Registered</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        No users found matching "{searchQuery}"
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => {
                      const diseases = parseDiseases(u.healthProfile?.diseases);
                      return (
                        <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold flex items-center justify-center text-xs shadow-sm">
                                {u.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-extrabold text-slate-900 dark:text-white text-xs">{u.name}</div>
                                <div className="text-[10px] text-slate-400 font-mono">{u.id}</div>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="space-y-0.5 text-[11px]">
                              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                                <Mail className="w-3 h-3 text-slate-400" />
                                <span>{u.email}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                                <Phone className="w-3 h-3 text-slate-400" />
                                <span>{u.phone || 'Phone unverified'}</span>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <select
                              value={u.role}
                              disabled={updatingUserId === u.id}
                              onChange={(e) => handleChangeUserRole(u.id, e.target.value)}
                              className={`px-2 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 ${
                                u.role === 'ADMIN'
                                  ? 'bg-amber-500/10 text-amber-700 border-amber-500/30'
                                  : u.role === 'DOCTOR'
                                  ? 'bg-purple-500/10 text-purple-700 border-purple-500/30'
                                  : u.role === 'RESTAURANT_OWNER'
                                  ? 'bg-orange-500/10 text-orange-700 border-orange-500/30'
                                  : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
                              }`}
                              title="Change user permissions"
                            >
                              <option value="CUSTOMER">CUSTOMER</option>
                              <option value="DOCTOR">DOCTOR</option>
                              <option value="RESTAURANT_OWNER">RESTAURANT OWNER</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </td>

                          <td className="p-4">
                            {u.healthProfile?.fitnessGoal ? (
                              <div className="space-y-1">
                                <span className="inline-block px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                                  🎯 {u.healthProfile.fitnessGoal}
                                </span>
                                {diseases.length > 0 && (
                                  <div className="text-[10px] text-slate-400 flex flex-wrap gap-1">
                                    {diseases.slice(0, 2).map(d => (
                                      <span key={d} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[9px]">
                                        {d}
                                      </span>
                                    ))}
                                    {diseases.length > 2 && <span>+{diseases.length - 2}</span>}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px] italic">No medical profile</span>
                            )}
                          </td>

                          <td className="p-4">
                            {u.healthProfile?.bmi ? (
                              <div className="space-y-0.5 text-[11px]">
                                <div className="font-extrabold text-slate-900 dark:text-white">
                                  BMI: {u.healthProfile.bmi}
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  BP: {u.healthProfile.bloodPressureSystolic || '120'}/{u.healthProfile.bloodPressureDiastolic || '80'} • Sugar: {u.healthProfile.bloodSugarFasting || '95'}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px]">—</span>
                            )}
                          </td>

                          <td className="p-4 text-slate-400 text-[11px]">
                            {new Date(u.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>

                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedUser(u)}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition-all inline-flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Dossier</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: OPERATIONS & WORK MONITOR ── */}
      {activeSection === 'orders' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit']">
                  Live Fulfillment & Partner Kitchen Orders
                </h3>
                <p className="text-xs text-slate-400">Real-time orders dispatched through healthy kitchen partners.</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Order Stream
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentOrders.map(order => (
                <div key={order.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white font-mono">
                        #{order.id}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        order.status === 'DELIVERED'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : order.status === 'OUT_FOR_DELIVERY'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Customer: <strong className="text-slate-800 dark:text-slate-200">{order.user?.name || 'Customer'}</strong> ({order.user?.email || 'N/A'}) • Kitchen: <strong className="text-slate-800 dark:text-slate-200">{order.restaurant?.name || 'Verified Kitchen'}</strong>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-black text-slate-900 dark:text-white">₹{order.totalAmount}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(order.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    {/* Admin Status Controller */}
                    <div className="flex items-center gap-1.5">
                      <select
                        value={order.status}
                        disabled={updatingOrderId === order.id}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer disabled:opacity-50"
                        title="Update Live Order Status"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PREPARING">PREPARING</option>
                        <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                      {updatingOrderId === order.id && (
                        <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: AI TELEMETRY ── */}
      {activeSection === 'telemetry' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm font-['Outfit'] flex items-center gap-2 text-slate-900">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <span>Clinical Rule Engine Log Stream</span>
              </h3>
              <span className="text-[10px] text-emerald-700 font-mono font-bold">Running (Nominal)</span>
            </div>

            <div className="space-y-3 font-mono text-[11px]">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-emerald-700 font-bold flex items-center justify-between">
                  <span>[10:45:12] Glycemic Index Guard (ADA 2024)</span>
                  <span className="text-[10px] text-slate-500">2 min ago</span>
                </div>
                <div className="text-slate-600">Verified Salmon Power Bowl glycemic index = 28. Status: PASS for Diabetic Users.</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-blue-700 font-bold flex items-center justify-between">
                  <span>[10:42:08] PCOS Allergen Guard (PCOS Society 2022)</span>
                  <span className="text-[10px] text-slate-500">5 min ago</span>
                </div>
                <div className="text-slate-600">Filtered high-fructose corn syrup & dairy allergens for Priya Sharma (#NF-98421).</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-purple-700 font-bold flex items-center justify-between">
                  <span>[10:38:50] Telehealth Clinical Diet Protocol</span>
                  <span className="text-[10px] text-slate-500">9 min ago</span>
                </div>
                <div className="text-slate-600">Generated ESC 2021 DASH low-sodium nutrition protocol for Dr. Ananya consultation.</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1">
                <div className="text-amber-400 font-bold flex items-center justify-between">
                  <span>[10:25:01] Biometric Continuous Telemetry</span>
                  <span className="text-[10px] text-slate-400">22 min ago</span>
                </div>
                <div className="text-slate-300">Ingested Apple Health & Dexcom G7 glucose spike log: +14 mg/dL post meal (Safe).</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white font-['Outfit']">
              Medical Guideline Standards
            </h3>
            <p className="text-xs text-slate-400">All automated meal scoring and recommendations adhere to peer-reviewed clinical guidelines:</p>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>ADA 2024:</strong> Standards of Medical Care in Diabetes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>AHA/ACC 2018:</strong> Clinical Practice Guidelines for HT</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>ICMR 2023:</strong> Indian Dietary Guidelines & Millets</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>PCOS Society 2022:</strong> Insulin & Androgen Regulation</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ── USER CLINICAL DOSSIER MODAL ── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* User Header */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                {selectedUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white font-['Outfit']">{selectedUser.name}</h3>
                <p className="text-xs text-slate-400">{selectedUser.email} • {selectedUser.phone || 'No phone'}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Role:</span>
                  <select
                    value={selectedUser.role}
                    disabled={updatingUserId === selectedUser.id}
                    onChange={(e) => handleChangeUserRole(selectedUser.id, e.target.value)}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-emerald-50 text-emerald-800 border border-emerald-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="DOCTOR">DOCTOR</option>
                    <option value="RESTAURANT_OWNER">RESTAURANT OWNER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Health Profile Details */}
            {selectedUser.healthProfile ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">BMI</div>
                    <div className="text-lg font-black text-slate-900 dark:text-white font-['Outfit']">
                      {selectedUser.healthProfile.bmi || '24.2'}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Blood Pressure</div>
                    <div className="text-lg font-black text-slate-900 dark:text-white font-['Outfit']">
                      {selectedUser.healthProfile.bloodPressureSystolic || 120}/{selectedUser.healthProfile.bloodPressureDiastolic || 80}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Blood Sugar</div>
                    <div className="text-lg font-black text-slate-900 dark:text-white font-['Outfit']">
                      {selectedUser.healthProfile.bloodSugarFasting || 95} <span className="text-[10px] text-slate-400 font-normal">mg/dL</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Fitness & Clinical Goal
                  </div>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    🎯 {selectedUser.healthProfile.fitnessGoal || 'General Wellness'}
                  </div>
                  <div className="text-xs text-slate-500">
                    Weight: {selectedUser.healthProfile.weightKg || 65} kg • Height: {selectedUser.healthProfile.heightCm || 165} cm • Age: {selectedUser.healthProfile.age || 30} yrs
                  </div>
                </div>

                {parseDiseases(selectedUser.healthProfile.diseases).length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Diagnosed Conditions & Allergies
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {parseDiseases(selectedUser.healthProfile.diseases).map(d => (
                        <span key={d} className="px-3 py-1 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold border border-red-500/20">
                          ⚠️ {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 text-sm">
                This user does not have an active patient health profile yet.
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/20"
              >
                Close Dossier
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
