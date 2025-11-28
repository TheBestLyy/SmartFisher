
import React, { useState } from 'react';
import { Plus, MapPin, Calendar, Ruler, Weight, Search, Edit2 } from 'lucide-react';
import { CatchLog } from '../types';
import AddCatchLog from './AddCatchLog';

const mockLogs: CatchLog[] = [
    {
        id: '1',
        species: '大口黑鲈 (Largemouth Bass)',
        weight: 1.2,
        length: 35,
        location: '杭州青山湖',
        date: '2023-10-15',
        note: '清晨路亚，用软虫德州钓组，水草边缘接口明显。',
        image: 'https://picsum.photos/400/300?random=10'
    },
    {
        id: '2',
        species: '鲤鱼',
        weight: 3.5,
        length: 48,
        location: '钱塘江',
        date: '2023-10-12',
        note: '台钓，7.2米竿，螺鲤饵。手感极佳。',
        image: 'https://picsum.photos/400/300?random=11'
    }
];

const Journal: React.FC = () => {
    const [logs, setLogs] = useState<CatchLog[]>(mockLogs);
    const [isAdding, setIsAdding] = useState(false);
    const [editingLog, setEditingLog] = useState<CatchLog | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSaveLog = (logData: Omit<CatchLog, 'id'>, id?: string) => {
        if (id) {
            // Edit existing
            setLogs(logs.map(log => 
                log.id === id ? { ...logData, id } : log
            ));
        } else {
            // Create new
            const newLog: CatchLog = {
                id: Date.now().toString(),
                ...logData
            };
            setLogs([newLog, ...logs]);
        }
    };

    const handleDeleteLog = (id: string) => {
        setLogs(logs.filter(log => log.id !== id));
    };

    const filteredLogs = logs.filter(log => 
        log.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.note.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-24 px-4 pt-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">我的鱼护</h1>
                    <p className="text-slate-500 text-sm">记录每一次爆护时刻</p>
                </div>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors active:scale-95"
                >
                    <Plus size={24} />
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-slate-400" />
                </div>
                <input 
                    type="text"
                    placeholder="搜索鱼种、地点..."
                    className="w-full bg-white pl-10 pr-4 py-3 rounded-xl border border-slate-100 shadow-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="space-y-4">
                {filteredLogs.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                        <p>没有找到相关记录</p>
                    </div>
                ) : (
                    filteredLogs.map(log => (
                        <div key={log.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 active:scale-[0.99] transition-transform group">
                            <div className="relative h-48">
                                <img src={log.image} alt={log.species} className="w-full h-full object-cover" />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                    <h3 className="text-white font-bold text-lg">{log.species}</h3>
                                    <div className="flex items-center text-white/90 text-xs mt-1">
                                        <Calendar size={12} className="mr-1" />
                                        {log.date}
                                    </div>
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingLog(log);
                                    }}
                                    className="absolute top-3 right-3 bg-black/40 text-white p-2 rounded-full backdrop-blur-sm hover:bg-blue-600 transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between mb-3">
                                    <div className="flex items-center text-slate-600 bg-slate-50 px-3 py-1 rounded-lg">
                                        <Weight size={16} className="mr-1 text-blue-500" />
                                        <span className="font-semibold">{log.weight} kg</span>
                                    </div>
                                    <div className="flex items-center text-slate-600 bg-slate-50 px-3 py-1 rounded-lg">
                                        <Ruler size={16} className="mr-1 text-orange-500" />
                                        <span className="font-semibold">{log.length} cm</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center text-slate-400 text-xs mb-3">
                                    <MapPin size={12} className="mr-1" />
                                    {log.location}
                                </div>
                                
                                <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                                    {log.note}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {(isAdding || editingLog) && (
                <AddCatchLog 
                    initialData={editingLog}
                    onClose={() => {
                        setIsAdding(false);
                        setEditingLog(null);
                    }} 
                    onSave={handleSaveLog} 
                    onDelete={handleDeleteLog}
                />
            )}
        </div>
    );
};

export default Journal;
