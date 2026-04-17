import { useEffect, useState } from 'react';
import { Target, Trophy, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import api from '../services/api';

export default function Goals() {
  const [goals, setGoals] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', progress: 0, deadline: '' });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    const res = await api.get('/goals');
    setGoals(res.data);
  };

  const addGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.deadline) return;
    
    await api.post('/goals', { id: uuidv4(), ...form, progress: parseInt(form.progress as any) || 0 });
    setForm({ title: '', progress: 0, deadline: '' });
    fetchGoals();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          Minhas Metas
        </h2>
      </div>

      <div className="glass-panel p-6">
        <form onSubmit={addGoal} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-400 mb-1">Título da Meta</label>
            <input 
              type="text" 
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-blue-500"
              placeholder="Ex: Conseguir 10 clientes SaaS"
            />
          </div>
          <div className="w-full md:w-32">
            <label className="block text-sm font-medium text-gray-400 mb-1">Progresso %</label>
            <input 
              type="number" 
              min="0" max="100"
              value={form.progress}
              onChange={e => setForm({...form, progress: parseInt(e.target.value) || 0})}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-400 mb-1">Data Alvo</label>
            <input 
              type="date" 
              value={form.deadline}
              onChange={e => setForm({...form, deadline: e.target.value})}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-xl transition flex items-center justify-center gap-2">
            <Plus size={20} /> Criar Meta
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <div key={goal.id} className="glass-panel p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Target size={100} />
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{goal.title}</h3>
                <span className="bg-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-500/30">
                  {goal.deadline}
                </span>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-gray-400 text-sm">Progresso Atual</span>
                  <span className="text-2xl font-bold text-white">{goal.progress}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-blue-400 h-3 rounded-full transition-all duration-1000 relative" 
                    style={{ width: `${goal.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
