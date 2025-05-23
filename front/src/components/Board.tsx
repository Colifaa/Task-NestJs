import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Column } from './index';
import { config } from '../config';
import { socketService } from '../services/socketService';
import { toast } from 'react-toastify';

// Definición de interfaces para mejor tipado
interface Task {
  _id: string;
  title: string;
  description: string;
  columnId: string;
}

interface NewTask {
  title: string;
  description: string;
  columnId: string;
}

interface ColumnType {
  id: string;
  title: string;
  color: string;
}

const Board: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<NewTask>({ title: '', description: '', columnId: 'todo' });
  const [isConnected, setIsConnected] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const columns: ColumnType[] = [
    { id: 'todo', title: 'To Do', color: 'bg-blue-100' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-yellow-100' },
    { id: 'done', title: 'Done', color: 'bg-green-100' },
  ];

  useEffect(() => {
    const socket = socketService.connect();
    
    socket.on('connect', () => {
      setIsConnected(true);
      toast.success('Conectado al servidor en tiempo real');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      toast.error('Desconectado del servidor');
    });

    socket.on('taskMoved', (data) => {
      toast.info(`Tarea "${data.title}" movida a ${data.newColumnId}`);
      fetchTasks();
    });

    fetchTasks();
    return () => socketService.disconnect();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Error al cargar las tareas');
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.apiUrl}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      
      if (response.ok) {
        setNewTask({ title: '', description: '', columnId: 'todo' });
        setIsFormOpen(false);
        fetchTasks();
        toast.success('Tarea creada exitosamente');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Error al crear la tarea');
    }
  };

  const handleEditTask = async (task: Task) => {
    try {
      const response = await fetch(`${config.apiUrl}/tasks/${task._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      
      if (response.ok) {
        fetchTasks();
        toast.success('Tarea actualizada exitosamente');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Error al actualizar la tarea');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`${config.apiUrl}/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchTasks();
        toast.success('Tarea eliminada exitosamente');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Error al eliminar la tarea');
    }
  };

  const onDragEnd = async (result: any) => {
    const { source, destination, draggableId } = result;
    
    // Si no hay destino o la tarea no se movió, no hacer nada
    if (!destination || 
        (source.droppableId === destination.droppableId && 
         source.index === destination.index)) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      // Reordenar en la misma columna
      const columnTasks = tasks.filter(task => task.columnId === source.droppableId);
      const [movedTask] = columnTasks.splice(source.index, 1);
      columnTasks.splice(destination.index, 0, movedTask);
      
      setTasks(tasks.map(task => 
        task.columnId === source.droppableId 
          ? columnTasks.find(t => t._id === task._id) || task 
          : task
      ));
    } else {
      // Mover a otra columna
      const task = tasks.find(t => t._id === draggableId);
      if (task) {
        const updatedTask = { ...task, columnId: destination.droppableId };
        await handleEditTask(updatedTask);
        
        const socket = socketService.getSocket();
        if (socket) {
          socket.emit('moveTask', {
            taskId: task._id,
            newColumnId: destination.droppableId,
            title: task.title
          });
        }
      }
    }
  };
  
  // Manejador para cambios en los inputs del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            <div className={`w-3 h-3 rounded-full mr-2 ${
              isConnected ? 'bg-green-300' : 'bg-red-300'
            } animate-pulse`}></div>
            {isConnected ? 'Conectado' : 'Desconectado'}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {tasks.length} Tareas
          </h2>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center shadow-md"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Nueva Tarea
        </button>
      </div>

      {/* Formulario para crear nuevas tareas */}
      {isFormOpen && (
        <div className="mb-8 bg-white p-6 rounded-xl shadow-lg transform transition-all duration-300">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Crear Nueva Tarea</h2>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                type="text"
                name="title"
                placeholder="Escribe el título de la tarea"
                value={newTask.title}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                name="description"
                placeholder="Describe la tarea"
                value={newTask.description}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                name="columnId"
                value={newTask.columnId}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                {columns.map(column => (
                  <option key={column.id} value={column.id}>
                    {column.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-sm"
              >
                Crear Tarea
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tablero Kanban */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 touch-none">
          {columns.map(column => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={tasks.filter(task => task.columnId === column.id)}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              color={column.color}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Board;