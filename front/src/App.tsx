import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import KanbanBoard from './components/KanbanBoard';

const App: React.FC = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-center my-4">Kanban Board</h1>
      <KanbanBoard />
      <ToastContainer />
    </>
  );
};

export default App;