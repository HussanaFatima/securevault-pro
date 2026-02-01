import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuditLog = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchAuditLogs();
    }, []);

    const fetchAuditLogs = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/audit-logs');
            setLogs(response.data);
        } catch (err) {
            console.error('Error fetching audit logs:', err);
            setError('Failed to load audit logs. Please refresh the page.');
        } finally {
            setLoading(false);
        }
    };

    const getActionColor = (action) => {
        const colors = {
            'viewed_vault': 'bg-blue-500/20 text-blue-300 border-blue-500',
            'created_vault_item': 'bg-green-500/20 text-green-300 border-green-500',
            'updated_vault_item': 'bg-yellow-500/20 text-yellow-300 border-yellow-500',
            'deleted_vault_item': 'bg-red-500/20 text-red-300 border-red-500',
        };
        return colors[action] || 'bg-gray-500/20 text-gray-300 border-gray-500';
    };

    const getActionIcon = (action) => {
        if (action.includes('viewed')) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            );
        }
        if (action.includes('created')) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            );
        }
        if (action.includes('updated')) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            );
        }
        if (action.includes('deleted')) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            );
        }
        return (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        );
    };

    const filteredLogs = logs.filter(log => {
        if (filter === 'all') return true;
        return log.action.includes(filter);
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Security Audit Logs</h1>
                    <p className="text-gray-300">Track all activities in your secure vault</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="mb-6 flex gap-3 flex-wrap">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            filter === 'all'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                    >
                        All Activities
                    </button>
                    <button
                        onClick={() => setFilter('created')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            filter === 'created'
                                ? 'bg-green-600 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                    >
                        Created
                    </button>
                    <button
                        onClick={() => setFilter('updated')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            filter === 'updated'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                    >
                        Updated
                    </button>
                    <button
                        onClick={() => setFilter('deleted')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            filter === 'deleted'
                                ? 'bg-red-600 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                    >
                        Deleted
                    </button>
                    <button
                        onClick={() => setFilter('viewed')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            filter === 'viewed'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                    >
                        Viewed
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                        <p className="text-gray-300 mt-4">Loading audit logs...</p>
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-300 mt-4 text-lg">No audit logs found</p>
                        <p className="text-gray-400 mt-2">Your activity history will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredLogs.map((log) => (
                            <div
                                key={log.id}
                                className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg border ${getActionColor(log.action)}`}>
                                        {getActionIcon(log.action)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-white font-semibold text-lg">
                                                    {log.description}
                                                </h3>
                                                <p className="text-gray-400 text-sm mt-1">
                                                    Action: <span className="text-gray-300 font-mono">{log.action}</span>
                                                </p>
                                            </div>
                                            <span className="text-gray-400 text-sm whitespace-nowrap ml-4">
                                                {new Date(log.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex gap-6 text-sm text-gray-400 mt-3">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                </svg>
                                                <span className="font-mono">{log.ip_address}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <span className="truncate max-w-md" title={log.user_agent}>
                                                    {log.user_agent.substring(0, 50)}...
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-white font-semibold mb-2">Total Logs: {filteredLogs.length}</h3>
                    <p className="text-gray-400 text-sm">
                        All actions are logged with IP address and user agent for maximum security
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuditLog;
