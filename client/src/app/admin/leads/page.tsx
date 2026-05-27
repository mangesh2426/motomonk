'use client';

import { useEffect, useState } from 'react';
import { Search, Filter, Download, UserPlus, MoreVertical, Trash2 } from 'lucide-react';

import { io } from 'socket.io-client';

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

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    
    const headers = ['Name', 'Phone', 'Email', 'Source', 'Status', 'Date Added', 'Message'];
    const csvContent = [
      headers.join(','),
      ...leads.map(lead => [
        `"${lead.name || ''}"`,
        `"${lead.phone || ''}"`,
        `"${lead.email || ''}"`,
        `"${lead.source || ''}"`,
        `"${lead.status || ''}"`,
        `"${lead.createdAt ? new Date(lead.createdAt).toISOString() : ''}"`,
        `"${lead.message?.replace(/"/g, '""') || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(l => l._id));
    }
  };

  const toggleSelectLead = (id: string) => {
    if (selectedLeads.includes(id)) {
      setSelectedLeads(prev => prev.filter(leadId => leadId !== id));
    } else {
      setSelectedLeads(prev => [...prev, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedLeads.length} leads?`)) return;
    
    // In a real app we'd have a bulk delete endpoint, doing it sequentially here for demo
    for (const id of selectedLeads) {
      try {
        const token = localStorage.getItem('adminToken');
        await fetch(`https://motomonk.onrender.com/api/leads/${id}`, { 
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch(e) {
        console.error(e);
      }
    }
    setSelectedLeads([]);
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch('https://motomonk.onrender.com/api/leads', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setLeads(data.leads || []);
      })
      .catch((err) => console.error('Failed to fetch leads', err));

    const socket = io('https://motomonk.onrender.com');
    
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

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = `${lead.name || ''} ${lead.phone || ''} ${lead.email || ''}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Leads Management</h1>
          <p className="text-gray-400 mt-1">View and manage all your incoming leads.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportCSV} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-gray-800 px-4 py-2 rounded-xl transition-all">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button className="flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]">
            <UserPlus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      <div className="bg-card border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 md:p-6 border-b border-gray-800 flex flex-col md:flex-row gap-4 justify-between items-center bg-white/[0.02]">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black border border-gray-700 text-white pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {selectedLeads.length > 0 && (
              <button 
                onClick={handleBulkDelete}
                className="flex items-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors border border-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedLeads.length})
              </button>
            )}
            
            <Filter className="w-4 h-4 text-gray-400 hidden md:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-auto bg-black border border-gray-700 text-white px-4 py-2.5 rounded-xl text-sm outline-none focus:border-primary"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/40 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">
                  <input 
                    type="checkbox" 
                    className="rounded bg-black border-gray-700 text-primary focus:ring-primary cursor-pointer w-4 h-4"
                    checked={filteredLeads.length > 0 && selectedLeads.length === filteredLeads.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-4 font-semibold">Lead Details</th>
                <th className="px-6 py-4 font-semibold">Contact Info</th>
                <th className="px-6 py-4 font-semibold">Source</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date Added</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filteredLeads.map((lead) => (
                <tr key={lead._id} className={`hover:bg-white/[0.02] transition-colors group ${selectedLeads.includes(lead._id) ? 'bg-primary/5' : ''}`}>
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded bg-black border-gray-700 text-primary focus:ring-primary cursor-pointer w-4 h-4"
                      checked={selectedLeads.includes(lead._id)}
                      onChange={() => toggleSelectLead(lead._id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{lead.name}</div>
                    <div className="text-xs text-gray-500 mt-1 truncate max-w-[200px]">{lead.message || 'No message'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300">{lead.phone}</div>
                    <div className="text-xs text-gray-500 mt-1">{lead.email || 'No email'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 capitalize">
                      {lead.source || 'Web'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      lead.status === 'New' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                      lead.status === 'Qualified' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      lead.status === 'Converted' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                      'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    }`}>
                      {lead.status || 'New'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric'
                    }) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-8 h-8 mb-3 opacity-20" />
                      <p>No leads found matching your criteria</p>
                    </div>
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
