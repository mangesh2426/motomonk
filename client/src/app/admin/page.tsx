'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Users,
  MessageSquare,
  PhoneCall,
  TrendingUp,
} from 'lucide-react';
import { io } from 'socket.io-client';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

interface Lead {
  _id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  source: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch('http://localhost:5000/api/leads', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setLeads(data.leads || []);
      });

    const socket = io('http://localhost:5000');
    
    socket.on('lead_created', (newLead: Lead) => {
      setLeads((prevLeads) => [newLead, ...prevLeads]);
    });

    socket.on('lead_updated', (updatedLead: Lead) => {
      setLeads((prevLeads) => prevLeads.map((l) => l._id === updatedLead._id ? updatedLead : l));
    });

    socket.on('lead_deleted', (id: string) => {
      setLeads((prevLeads) => prevLeads.filter((l) => l._id !== id));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const deleteLead = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/leads/${id}`, {
        method: 'DELETE',
      });

      setLeads(leads.filter((lead) => lead._id !== id));
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`http://localhost:5000/api/leads/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      setLeads(
        leads.map((lead) =>
          lead._id === id ? { ...lead, status } : lead
        )
      );
    } catch (error) {
      console.error('Status update failed', error);
    }
  };

  const stats = [
    {
      title: 'Total Leads',
      value: leads.length,
      icon: <Users className="w-6 h-6 text-primary" />,
      trend: 'Live Data',
    },
    {
      title: 'AI Chats',
      value: '8,540',
      icon: <MessageSquare className="w-6 h-6 text-blue-500" />,
      trend: '+5% this week',
    },
    {
      title: 'Voice Calls',
      value: '342',
      icon: <PhoneCall className="w-6 h-6 text-green-500" />,
      trend: '+22% this month',
    },
    {
      title: 'Conversion Rate',
      value: '18.4%',
      icon: <TrendingUp className="w-6 h-6 text-purple-500" />,
      trend: '+2% this month',
    },
  ];

  const filteredLeads = leads.filter((lead) =>
    `${lead.name || ''} ${lead.phone || ''} ${lead.email || ''} ${lead.message || ''} ${lead.status || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Chart Data preparation
  const getChartData = () => {
    const last7Days = Array.from({length: 7}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    });
    
    return last7Days.map(day => ({
      name: day,
      leads: Math.floor(Math.random() * 10) + (leads.length > 0 ? 1 : 0) // Mocking variation based on existing leads
    }));
  };

  const getSourceData = () => {
    const sources = { web: 0, whatsapp: 0, call: 0 };
    leads.forEach(l => {
      if (l.source === 'whatsapp') sources.whatsapp++;
      else if (l.source === 'call') sources.call++;
      else sources.web++;
    });
    return [
      { name: 'Web', value: sources.web || 1, color: '#f97316' }, // Orange
      { name: 'WhatsApp', value: sources.whatsapp || 1, color: '#22c55e' }, // Green
      { name: 'Call', value: sources.call || 1, color: '#3b82f6' } // Blue
    ];
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-card border border-gray-800 p-6 rounded-2xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-background p-3 rounded-xl">
                {stat.icon}
              </div>
            </div>

            <h3 className="text-gray-400 text-sm font-medium mb-1">
              {stat.title}
            </h3>

            <div className="text-3xl font-bold mb-2">
              {stat.value}
            </div>

            <p className="text-xs text-green-400">
              {stat.trend}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-card border border-gray-800 p-6 rounded-2xl h-80">
          <h3 className="font-semibold mb-6">Lead Acquisition (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={getChartData()}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} />
              <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }} 
                itemStyle={{ color: '#f97316' }}
              />
              <Area type="monotone" dataKey="leads" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-gray-800 p-6 rounded-2xl h-80">
          <h3 className="font-semibold mb-6">Leads by Source</h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={getSourceData()}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {getSourceData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {getSourceData().map(src => (
              <div key={src.name} className="flex items-center gap-1.5 text-xs text-gray-400">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: src.color }} />
                {src.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <h2 className="font-bold">Recent Leads</h2>

          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-black border border-gray-700 text-white px-4 py-2 rounded-lg text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-background text-gray-400 text-sm">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Phone</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Message</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead._id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">
                    {lead.name}
                  </td>

                  <td className="px-6 py-4 text-gray-400">
                    {lead.phone}
                  </td>

                  <td className="px-6 py-4 text-gray-400">
                    {lead.email}
                  </td>

                  <td className="px-6 py-4 text-gray-400">
                    {lead.message}
                  </td>

                  <td className="px-6 py-4">
                    <select
                      value={lead.status || 'New'}
                      onChange={(e) =>
                        updateStatus(lead._id, e.target.value)
                      }
                      className="bg-black border border-gray-700 text-white px-2 py-1 rounded-lg text-sm"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Converted">Converted</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </td>

                  <td className="px-6 py-4 text-gray-400">
                    {lead.createdAt
                      ? new Date(lead.createdAt).toLocaleString()
                      : 'N/A'}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteLead(lead._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredLeads.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-6 text-center text-gray-400"
                  >
                    No leads found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}