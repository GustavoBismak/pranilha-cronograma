import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Fuel, TrendingUp, Pencil, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';

export default function Uber() {
  const [history, setHistory] = useState<any[]>([]);
  const [form, setForm] = useState({ date: format(new Date(), 'yyyy-MM-dd'), earnings: '', fuel: '', fees: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

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

    if (editingId) {
      await supabase.from('uber').update({ date: form.date, earnings, fuel, fees, profit }).eq('id', editingId);
      setEditingId(null);
    } else {
      await supabase.from('uber').insert([{ date: form.date, earnings, fuel, fees, profit }]);
    }

    setForm({ date: format(new Date(), 'yyyy-MM-dd'), earnings: '', fuel: '', fees: '' });
    fetchData();
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      date: item.date,
      earnings: item.earnings.toString(),
      fuel: item.fuel.toString(),
      fees: item.fees.toString()
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      await supabase.from('uber').delete().eq('id', id);
      fetchData();
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ date: format(new Date(), 'yyyy-MM-dd'), earnings: '', fuel: '', fees: '' });
  };

  const totalProfit = history.reduce((acc, curr) => acc + curr.profit, 0);
  const avgProfit = history.length > 0 ? totalProfit / history.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Controle Uber</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 lg:col-span-1 h-fit sticky top-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">{editingId ? 'Editar Registro' : 'Novo Registro'}</h3>
            {editingId && (
              <button onClick={cancelEdit} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            )}
          </div>
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
              <button type="submit" className={`w-full ${editingId ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-3 rounded-xl transition duration-200`}>
                {editingId ? 'Atualizar Registro' : 'Salvar Registro'}
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

          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold mb-4">Histórico de Registros</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-sm border-b border-white/10">
                    <th className="pb-3 font-medium">Data</th>
                    <th className="pb-3 font-medium">Ganhos</th>
                    <th className="pb-3 font-medium">Custos</th>
                    <th className="pb-3 font-medium text-emerald-400">Lucro</th>
                    <th className="pb-3 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[...history].reverse().map((item) => (
                    <tr key={item.id} className="group hover:bg-white/5 transition-colors">
                      <td className="py-4 text-sm">{item.date}</td>
                      <td className="py-4 text-sm font-mono text-gray-300">R$ {item.earnings.toFixed(2)}</td>
                      <td className="py-4 text-sm font-mono text-gray-500">R$ {(item.fuel + item.fees).toFixed(2)}</td>
                      <td className="py-4 text-sm font-mono font-bold text-emerald-400">R$ {item.profit.toFixed(2)}</td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-blue-400 transition hover:bg-blue-400/10 rounded-lg">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-400 transition hover:bg-red-400/10 rounded-lg">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-gray-500">Nenhum registro encontrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
