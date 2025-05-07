import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchTasks, moveTask, Task } from '../services/api';
import socket from '../services/socket';

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<{
    'to-do': Column;
    'in-progress': Column;
    'done': Column;
  } & Record<string, Column>>({
    'to-do': { id: 'to-do', title: 'To Do', tasks: [] },
    'in-progress': { id: 'in-progress', title: 'In Progress', tasks: [] },
    'done': { id: 'done', title: 'Done', tasks: [] },
  });

  // Cargar las tareas iniciales desde el backend
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasks = await fetchTasks();
        const updatedColumns = { ...columns };
        tasks.forEach((task) => {
          if (updatedColumns[task.columnId]) {
            updatedColumns[task.columnId].tasks.push(task);
          }
        });
        setColumns(updatedColumns);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };

    loadTasks();
  }, []);

  // Escuchar el evento taskMoved para actualizar el estado en tiempo real
  useEffect(() => {
    socket.on('taskMoved', (data: { taskId: string; newColumnId: string }) => {
      const { taskId, newColumnId } = data;

      // Mostrar notificación
      toast.success(`La tarea ${taskId} se movió a la columna ${newColumnId}`);

      // Actualizar el estado local
      const updatedColumns = { ...columns };
      Object.values(updatedColumns).forEach((column) => {
        const taskIndex = column.tasks.findIndex((task) => task._id === taskId);
        if (taskIndex !== -1) {
          const [movedTask] = column.tasks.splice(taskIndex, 1);
          movedTask.columnId = newColumnId;
          updatedColumns[newColumnId].tasks.push(movedTask);
        }
      });
      setColumns(updatedColumns);
    });

    return () => {
      socket.off('taskMoved');
    };
  }, [columns]);

  // Manejar el movimiento de una tarea
  const handleMoveTask = async (taskId: string, newColumnId: string) => {
    try {
      await moveTask(taskId, newColumnId); // Actualizar en el backend
    } catch (error) {
      console.error('Error moving task:', error);
    }
  };

  return (
    <div className="flex justify-around p-4">
      {Object.values(columns).map((column) => (
        <div key={column.id} className="w-1/4 border border-gray-300 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">{column.title}</h2>
          <ul>
            {column.tasks.map((task) => (
              <li key={task._id} className="bg-gray-100 p-2 mb-2 rounded-md">
                <span>{task.title}</span>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleMoveTask(task._id, 'in-progress')}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Mover a In Progress
                  </button>
                  <button
                    onClick={() => handleMoveTask(task._id, 'done')}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Mover a Done
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;