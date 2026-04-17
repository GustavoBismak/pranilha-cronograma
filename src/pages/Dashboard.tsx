import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Activity, Car, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [data, setData] = useState<any>({ routine: [], uber: { history: [] }, goals: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: routine } = await supabase.from('routine').select('*');
    const { data: uberHistory } = await supabase.from('uber').select('*').order('date', { ascending: false });
    const { data: goals } = await supabase.from('goals').select('*');

    setData({
      routine: routine || [],
      uber: { history: uberHistory || [] },
      goals: goals || []
    });
  };

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayEarnings = data.uber.history.find((h: any) => h.date === todayStr)?.profit || 0;
  const pendingTasks = data.routine.filter((r: any) => !r.completed).length;
  const nextTask = data.routine.filter((r: any) => !r.completed).sort((a: any, b: any) => a.time.localeCompare(b.time))[0];

  const quotes = [
    "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
    "A disciplina é a ponte entre metas e realizações.",
    "Não espere por oportunidades, crie-as."
  ];
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Olá, Bismak! 👋</h2>
          <p className="text-gray-400 capitalize">{format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}</p>
        </div>
      </div>

      <div className="glass-panel p-6 bg-gradient-to-br from-blue-900/40 to-blue-900/10 border-blue-500/20">
        <p className="text-lg italic text-blue-200">"{quote}"</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center text-blue-400">
            <span className="font-semibold">Lucro Uber (Hoje)</span>
            <Car size={24} />
          </div>
          <span className="text-3xl font-bold">R$ {todayEarnings.toFixed(2)}</span>
        </div>

        <div className="glass-panel p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center text-yellow-400">
            <span className="font-semibold">Tarefas Pendentes</span>
            <Activity size={24} />
          </div>
          <span className="text-3xl font-bold">{pendingTasks}</span>
        </div>

        <div className="glass-panel p-6 flex flex-col gap-4 lg:col-span-2">
          <div className="flex justify-between items-center text-emerald-400">
            <span className="font-semibold">Próxima Atividade</span>
            <Clock size={24} />
          </div>
          <div className="flex justify-between items-center mt-2">
            <div>
              <span className="text-xl font-bold text-white block">{nextTask ? nextTask.title : 'Tudo concluído!'}</span>
              <span className="text-gray-400 text-sm">{nextTask ? nextTask.time : 'Bom descanso'}</span>
            </div>
            {nextTask && <CheckCircle size={32} className="text-gray-600" />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h3 className="text-xl font-bold mb-4">Metas Ativas</h3>
          <div className="space-y-4">
            {data.goals.slice(0,3).map((goal: any) => (
              <div key={goal.id}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-white">{goal.title}</span>
                  <span className="text-sm font-medium text-blue-400">{goal.progress}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${goal.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass-panel p-6">
           <h3 className="text-xl font-bold mb-4">Cronograma de Hoje</h3>
           <div className="space-y-3">
             {data.routine.map((r: any) => (
               <div key={r.id} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                 <div className="flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full ${r.completed ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                   <span className={r.completed ? 'text-gray-500 line-through' : 'text-gray-200'}>{r.title}</span>
                 </div>
                 <span className="text-sm text-gray-400 font-mono">{r.time}</span>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
