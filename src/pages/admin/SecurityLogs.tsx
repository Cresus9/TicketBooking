import React, { useState } from 'react';
import { Shield, Search, AlertTriangle, Ban } from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';

export default function SecurityLogs() {
  const { logs, blockedIPs, blockIP } = useSecurity();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip.includes(searchTerm) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const handleBlockIP = (ip: string) => {
    if (window.confirm(`Are you sure you want to block IP ${ip}?`)) {
      blockIP(ip, 'Manual block by admin', 60); // Block for 60 minutes
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Security Logs</h1>
        <div className="flex gap-4">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Export Logs
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Severities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Security Logs Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Timestamp</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Action</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">IP Address</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Details</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Severity</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-500">{log.ip}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{log.details}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      log.severity === 'high'
                        ? 'bg-red-100 text-red-800'
                        : log.severity === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleBlockIP(log.ip)}
                      className="text-gray-400 hover:text-red-600"
                      title="Block IP"
                    >
                      <Ban className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Blocked IPs */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Blocked IP Addresses</h2>
        <div className="space-y-4">
          {blockedIPs.map((blocked) => (
            <div
              key={`${blocked.ip}-${blocked.timestamp}`}
              className="flex items-center justify-between p-4 bg-red-50 rounded-lg"
            >
              <div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="font-mono font-medium text-red-900">{blocked.ip}</span>
                </div>
                <p className="mt-1 text-sm text-red-700">{blocked.reason}</p>
              </div>
              <div className="text-sm text-red-600">
                Expires: {new Date(blocked.expiresAt).toLocaleString()}
              </div>
            </div>
          ))}
          {blockedIPs.length === 0 && (
            <p className="text-gray-500 text-center py-4">No blocked IP addresses</p>
          )}
        </div>
      </div>
    </div>
  );
}