'use client';

import { useState } from 'react';
import { Search, Phone, Play, Download, MoreVertical, Filter, Pause } from 'lucide-react';

const DUMMY_CALLS = [
  { id: 1, phone: '+1 (555) 019-2831', duration: '03:45', date: 'Oct 24, 2023 - 10:30 AM', status: 'Completed', aiAgent: 'Sales Bot' },
  { id: 2, phone: '+1 (555) 923-1029', duration: '01:12', date: 'Oct 24, 2023 - 09:15 AM', status: 'Completed', aiAgent: 'Support Bot' },
  { id: 3, phone: '+1 (555) 438-9912', duration: '00:45', date: 'Oct 23, 2023 - 04:20 PM', status: 'Dropped', aiAgent: 'Sales Bot' },
  { id: 4, phone: '+1 (555) 762-3841', duration: '05:20', date: 'Oct 23, 2023 - 01:10 PM', status: 'Completed', aiAgent: 'Sales Bot' },
];

export default function CallsPage() {
  const [playingId, setPlayingId] = useState<number | null>(null);

  const togglePlay = (id: number) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">AI Call Records</h1>
          <p className="text-gray-400 mt-1">Review and analyze AI voice agent conversations.</p>
        </div>
      </div>

      <div className="bg-card border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 md:p-6 border-b border-gray-800 flex flex-col md:flex-row gap-4 justify-between items-center bg-white/[0.02]">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search phone numbers..."
              className="w-full bg-black border border-gray-700 text-white pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="w-4 h-4 text-gray-400 hidden md:block" />
            <select className="w-full md:w-auto bg-black border border-gray-700 text-white px-4 py-2.5 rounded-xl text-sm outline-none focus:border-primary">
              <option value="All">All Agents</option>
              <option value="Sales">Sales Bot</option>
              <option value="Support">Support Bot</option>
            </select>
            <select className="w-full md:w-auto bg-black border border-gray-700 text-white px-4 py-2.5 rounded-xl text-sm outline-none focus:border-primary">
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Dropped">Dropped</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/40 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Caller Info</th>
                <th className="px-6 py-4 font-semibold">AI Agent</th>
                <th className="px-6 py-4 font-semibold">Duration</th>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Recording</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {DUMMY_CALLS.map((call) => (
                <tr key={call.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                        <Phone className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="font-medium text-white">{call.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">{call.aiAgent}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-400">{call.duration}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-400">{call.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      call.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {call.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => togglePlay(call.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          playingId === call.id 
                            ? 'bg-primary text-white shadow-[0_0_10px_rgba(249,115,22,0.5)]' 
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {playingId === call.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>
                      <div className="h-1.5 w-24 bg-gray-800 rounded-full overflow-hidden">
                        {playingId === call.id && (
                          <div className="h-full bg-primary w-1/2 animate-pulse rounded-full" />
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors" title="Download Transcript">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
