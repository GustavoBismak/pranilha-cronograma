import { useEffect, useState } from 'react';
import { Plus, Check, Trash2, Bell } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Routine() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState({ title: '', time: '', type: 'estudo', send_reminder: false });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('routine').select('*');
    if (data) setTasks(data.sort((a: any, b: any) => a.time.localeCompare(b.time)));
    setIsLoading(false);
  };
  const importFromWeekly = async () => {
    const { data: weekly } = await supabase.from('weekly').select('*');
    const daysArr = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const todayName = daysArr[new Date().getDay()];
    const plan = weekly?.find((p: any) => p.day === todayName);

    if (plan) {
      const items = [
        { title: plan.morning, time: '08:00', type: 'trabalho' },
        { title: plan.afternoon, time: '14:00', type: 'estudo' },
        { title: plan.night, time: '19:00', type: 'familia' }
      ].filter(i => i.title);

      for (const item of items) {
        await supabase.from('routine').insert([{ ...item, completed: false }]);
      }
      fetchTasks();
    }
  };
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.time) return;
    
    const { data, error } = await supabase.from('routine').insert([newTask]).select();
    
    // Se o lembrete estiver ativado, enviamos para o n8n
    if (!error && newTask.send_reminder) {
      alert("Enviando lembrete para o n8n...");
      
      const [hours, minutes] = newTask.time.split(':');
      const scheduledDate = new Date();
      scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      fetch('https://focal-trails-costumes-exp.trycloudflare.com/webhook-test/bismak-reminder', {
        method: 'POST',
        headers: { 
          'Content-Type': 'text/plain', // Mudando para text/plain evita alguns problemas de CORS em túneis
        },
        body: JSON.stringify({
          ...data[0],
          scheduled_at: scheduledDate.toISOString()
        })
      }).then((res) => {
        if (!res.ok) throw new Error("Status: " + res.status);
        console.log("Enviado para n8n com sucesso!");
        alert("Enviado com sucesso! Verifique o n8n.");
      }).catch(err => {
        console.error("Erro no envio:", err);
        alert("Erro no envio: " + err.message);
      });
    }

    setNewTask({ title: '', time: '', type: 'estudo', send_reminder: false });
    fetchTasks();
  };

  const toggleTask = async (task: any) => {
    await supabase.from('routine').update({ completed: !task.completed }).eq('id', task.id);
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await supabase.from('routine').delete().eq('id', id);
    fetchTasks();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Cronograma Diário</h2>
        {tasks.length === 0 && !isLoading && (
          <button 
            onClick={importFromWeekly}
            className="text-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl hover:bg-emerald-500/20 transition"
          >
            Importar do Plano Semanal
          </button>
        )}
      </div>

      <div className="glass-panel p-6">
        <form onSubmit={addTask} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full relative group">
            <label className="block text-sm font-medium text-gray-400 mb-1">Nova Tarefa</label>
            <input 
              type="text" 
              value={newTask.title}
              onChange={e => setNewTask({...newTask, title: e.target.value})}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Ex: Estudar React"
            />
          </div>
          <div className="w-full md:w-32">
            <label className="block text-sm font-medium text-gray-400 mb-1">Horário</label>
            <input 
              type="time" 
              value={newTask.time}
              onChange={e => setNewTask({...newTask, time: e.target.value})}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="w-full md:w-40">
            <label className="block text-sm font-medium text-gray-400 mb-1">Categoria</label>
            <select 
              value={newTask.type}
              onChange={e => setNewTask({...newTask, type: e.target.value})}
              className="w-full bg-[#1a1d24] border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="estudo">Estudo/Proj</option>
              <option value="uber">Uber</option>
              <option value="familia">Família</option>
              <option value="trabalho">Trabalho</option>
            </select>
          </div>
          <div className="w-full md:w-auto flex items-center gap-2 mb-2 md:mb-0 px-2 self-center">
            <input 
              type="checkbox" 
              id="reminder"
              checked={newTask.send_reminder}
              onChange={e => setNewTask({...newTask, send_reminder: e.target.checked})}
              className="w-4 h-4 rounded border-white/10 bg-black/20 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="reminder" className="text-sm text-gray-400 cursor-pointer">Avisar WhatsApp</label>
          </div>
          <button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-2">
            <Plus size={20} /> Adicionar
          </button>
        </form>
      </div>

      <div className="grid gap-3">
        {tasks.map(task => (
          <div key={task.id} className={`glass-panel p-4 flex items-center justify-between transition-all duration-300 ${task.completed ? 'opacity-60 grayscale' : 'hover:border-white/20'}`}>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => toggleTask(task)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-gray-500 hover:border-blue-400'}`}
              >
                {task.completed && <Check size={14} className="text-white" />}
              </button>
              <div>
                <h3 className={`font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-100'}`}>{task.title}</h3>
                <div className="flex gap-2 text-sm mt-1">
                  <span className="text-gray-400 font-mono bg-black/30 px-2 py-0.5 rounded-md">{task.time}</span>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-medium uppercase tracking-wider
                    ${task.type === 'uber' ? 'bg-indigo-500/10 text-indigo-400' : ''}
                    ${task.type === 'estudo' ? 'bg-blue-500/10 text-blue-400' : ''}
                    ${task.type === 'familia' ? 'bg-rose-500/10 text-rose-400' : ''}
                    ${task.type === 'trabalho' ? 'bg-amber-500/10 text-amber-400' : ''}
                  `}>
                    {task.type}
                  </span>
                  {task.send_reminder && (
                    <span className="flex items-center gap-1 text-[10px] text-blue-400 font-bold uppercase">
                      <Bell size={10} /> WhatsApp
                   </span>
                  )}
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => deleteTask(task.id)}
              className="p-2 text-gray-500 hover:text-red-400 transition hover:bg-red-400/10 rounded-lg"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-10 text-gray-400 border border-dashed border-white/10 rounded-2xl">
            Nenhuma tarefa para hoje. Adicione uma acima.
          </div>
        )}
      </div>
    </div>
  );
}
