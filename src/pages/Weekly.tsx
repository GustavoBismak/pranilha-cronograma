import { useEffect, useState } from 'react';
import { CalendarRange, Save } from 'lucide-react';
import api from '../services/api';

export default function Weekly() {
  const [weeklyPlan, setWeeklyPlan] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchWeeklyData();
  }, []);

  const fetchWeeklyData = async () => {
    const res = await api.get('/weekly');
    setWeeklyPlan(res.data);
  };

  const handleSave = () => {
    // In a real scenario we might PUT the entire array or individual items.
    // For now we simulate save
    setIsEditing(false);
  };

  const updateCell = (index: number, period: string, value: string) => {
    const newPlan = [...weeklyPlan];
    newPlan[index] = { ...newPlan[index], [period]: value };
    setWeeklyPlan(newPlan);
  };

  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  // Ensure all days exist
  const displayPlan = days.map(day => {
    return weeklyPlan.find(w => w.day === day) || { day, morning: '', afternoon: '', night: '' };
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CalendarRange className="text-blue-500" />
          Planejamento Semanal
        </h2>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition ${isEditing ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          {isEditing ? <><Save size={18} /> Salvar Alterações</> : 'Editar Tabela'}
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 border-b border-white/5 text-gray-400">
                <th className="p-4 font-medium min-w-[120px]">Dia do Mês</th>
                <th className="p-4 font-medium min-w-[200px]">Manhã</th>
                <th className="p-4 font-medium min-w-[200px]">Tarde</th>
                <th className="p-4 font-medium min-w-[200px]">Noite</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 relative">
              {displayPlan.map((row, idx) => (
                <tr key={row.day} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-medium text-gray-200">
                    {row.day}
                  </td>
                  <td className="p-4">
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={row.morning} 
                        onChange={e => updateCell(idx, 'morning', e.target.value)}
                        className="w-full bg-black/40 border border-blue-500/30 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 text-sm"
                      />
                    ) : (
                      <span className="text-gray-300 text-sm">{row.morning || '---'}</span>
                    )}
                  </td>
                  <td className="p-4">
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={row.afternoon} 
                        onChange={e => updateCell(idx, 'afternoon', e.target.value)}
                        className="w-full bg-black/40 border border-blue-500/30 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 text-sm"
                      />
                    ) : (
                      <span className="text-gray-300 text-sm">{row.afternoon || '---'}</span>
                    )}
                  </td>
                  <td className="p-4">
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={row.night} 
                        onChange={e => updateCell(idx, 'night', e.target.value)}
                        className="w-full bg-black/40 border border-blue-500/30 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 text-sm"
                      />
                    ) : (
                      <span className="text-gray-300 text-sm">{row.night || '---'}</span>
                    )}
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
