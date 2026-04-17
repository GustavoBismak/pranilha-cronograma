import axios from 'axios';

// Instância do Axios conectando ao backend Node.js
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Mock interceptors for immediate UI demo inside browser (without DB installed).
// In a true environment with the backend running, we can remove this.
// I'll keep it active ONLY IF it fails to reach the backend as a fallback 
// so the UI remains robust for you.

const getLocal = (key: string) => {
  const d = localStorage.getItem(key);
  return d ? JSON.parse(d) : null;
};
const setLocal = (key: string, val: any) => localStorage.setItem(key, JSON.stringify(val));

const defaultMock = {
  routine: [
    { id: '1', title: 'Estudar Programação', time: '08:00', type: 'estudo', completed: false },
    { id: '2', title: 'Uber - Manhã', time: '10:00', type: 'uber', completed: false },
    { id: '3', title: 'Almoço em Família', time: '13:00', type: 'familia', completed: true },
    { id: '4', title: 'Criar SaaS', time: '18:00', type: 'trabalho', completed: false },
  ],
  uber: { history: [] },
  goals: [
    { id: '1', title: 'Aprender React Native', progress: 40, deadline: '2026-06-01' },
    { id: '2', title: 'Criar 1º SaaS MVT', progress: 10, deadline: '2026-05-15' },
  ],
  weekly: [
    { day: 'Segunda', morning: 'Uber', afternoon: 'Estudo', night: 'Família' },
    { day: 'Terça', morning: 'Uber', afternoon: 'Trabalho', night: 'Estudo' },
  ]
};

if (!getLocal('bismak_data')) setLocal('bismak_data', defaultMock);

// Interceptor para fallback offline se o servidor não estiver rodando
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn("Backend não respondendo. Usando modo Offline/Local Storage.");
    const req = error.config;
    const data = getLocal('bismak_data');
    const path = req.url || '';
    
    let mockResponseData: any = {};
    
    if (req.method === 'get') {
      if (path.includes('/routine')) mockResponseData = data.routine;
      else if (path.includes('/uber')) mockResponseData = data.uber;
      else if (path.includes('/goals')) mockResponseData = data.goals;
      else if (path.includes('/weekly')) mockResponseData = data.weekly;
    } else if (req.method === 'post' || req.method === 'put') {
      if (path.includes('/routine')) {
        if (req.method === 'post') data.routine.push(JSON.parse(req.data));
        if (req.method === 'put') {
          const body = JSON.parse(req.data);
          data.routine = data.routine.map((r: any) => r.id === body.id ? body : r);
        }
      }
      else if (path.includes('/uber')) data.uber.history.push(JSON.parse(req.data));
      else if (path.includes('/goals')) {
        const body = JSON.parse(req.data);
        if (req.method === 'put') {
           data.goals = data.goals.map((g: any) => g.id === body.id ? { ...g, ...body } : g);
        } else {
           data.goals.push(body);
        }
      }
      else if (path.includes('/weekly')) {
        const body = JSON.parse(req.data);
        data.weekly = body;
      }
      
      setLocal('bismak_data', data);
      mockResponseData = { success: true };
    }
    
    return Promise.resolve({ data: mockResponseData, status: 200, statusText: 'OK', config: req, headers: {} });
  }
);

export default api;
