import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Fuel, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';

export default function Uber() {
  const [history, setHistory] = useState<any[]>([]);
  const [form, setForm] = useState({ date: format(new Date(), 'yyyy-MM-dd'), earnings: '', fuel: '', fees: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase.from('uber').select('*').order('date', { ascending: true });
    if (data) setHistory(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const earnings = parseFloat(form.earnings) || 0;
    const fuel = parseFloat(form.fuel) || 0;
    const fees = parseFloat(form.fees) || 0;
    const profit = earnings - fuel - fees;

    await supabase.from('uber').insert([{ date: form.date, earnings, fuel, fees, profit }]);
    setForm({ ...form, earnings: '', fuel: '', fees: '' });
    fetchData();
  };

  const totalProfit = history.reduce((acc, curr) => acc + curr.profit, 0);
  const avgProfit = history.length > 0 ? totalProfit / history.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Controle Uber</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 lg:col-span-1">
          <h3 className="text-lg font-bold mb-4">Novo Registro</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Data</label>
              <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Ganhos Brutos (R$)</label>
              <input type="number" step="0.01" value={form.earnings} onChange={e => setForm({...form, earnings: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-blue-500" placeholder="0.00" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Combustível</label>
                <input type="number" step="0.01" value={form.fuel} onChange={e => setForm({...form, fuel: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-blue-500" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Taxas/Outros</label>
                <input type="number" step="0.01" value={form.fees} onChange={e => setForm({...form, fees: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-blue-500" placeholder="0.00" />
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">Lucro Estimado</span>
                <span className="text-xl font-bold text-emerald-400">
                  R$ {((parseFloat(form.earnings)||0) - (parseFloat(form.fuel)||0) - (parseFloat(form.fees)||0)).toFixed(2)}
                </span>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition duration-200">
                Salvar Registro
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-4 flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400"><DollarSign size={24} /></div>
              <div>
                <p className="text-sm text-gray-400">Lucro Total</p>
                <p className="text-xl font-bold">R$ {totalProfit.toFixed(2)}</p>
              </div>
            </div>
            <div className="glass-panel p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><TrendingUp size={24} /></div>
              <div>
                <p className="text-sm text-gray-400">Média Diária</p>
                <p className="text-xl font-bold">R$ {avgProfit.toFixed(2)}</p>
              </div>
            </div>
            <div className="glass-panel p-4 flex items-center gap-4">
              <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400"><Fuel size={24} /></div>
              <div>
                <p className="text-sm text-gray-400">Dias Trabalhados</p>
                <p className="text-xl font-bold">{history.length}</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 h-[300px]">
            <h3 className="text-lg font-bold mb-4">Evolução do Lucro</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#4b5563" fontSize={12} tickFormatter={str => str.substring(5)} />
                <YAxis stroke="#4b5563" fontSize={12} />
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1d24', borderColor: '#374151', borderRadius: '12px' }}
                  itemStyle={{ color: '#10b981' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
