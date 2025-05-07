import axios from 'axios';

const API_URL = 'http://localhost:3001/tasks'; // URL del backend

// Interfaz para definir la estructura de una tarea
export interface Task {
  _id: string;
  title: string;
  columnId: string;
}

// Función para obtener todas las tareas desde el backend
export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await axios.get<Task[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Función para mover una tarea a una nueva columna
export const moveTask = async (taskId: string, newColumnId: string): Promise<void> => {
  try {
    await axios.put(`${API_URL}/${taskId}`, { columnId: newColumnId });
  } catch (error) {
    console.error('Error moving task:', error);
    throw error;
  }
};