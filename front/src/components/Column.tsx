import React, { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Task } from './index';

interface ColumnProps {
  id: string;
  title: string;
  tasks: any[];
  onEditTask: (task: any) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  color: string;
}

const Column: React.FC<ColumnProps> = ({ id, title, tasks, onEditTask, onDeleteTask, color }) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<any>(null);

  const handleEdit = (task: any) => {
    setIsEditing(task._id);
    setEditedTask({ ...task });
  };

  const handleSave = async () => {
    if (editedTask) {
      await onEditTask(editedTask);
      setIsEditing(null);
      setEditedTask(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditedTask(null);
  };

  return (
    <div className={`rounded-xl shadow-lg overflow-hidden ${color}`}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <span className="text-sm text-gray-600">{tasks.length} tareas</span>
      </div>
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-4 min-h-[200px] bg-white/50 transition-colors duration-200 ${
              snapshot.isDraggingOver ? 'bg-blue-50' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <Draggable 
                key={task._id} 
                draggableId={task._id} 
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`mb-3 touch-manipulation ${
                      snapshot.isDragging ? 'opacity-50' : ''
                    }`}
                    style={{
                      ...provided.draggableProps.style,
                      touchAction: 'none'
                    }}
                  >
                    {isEditing === task._id ? (
                      <div className="bg-white p-4 rounded-lg shadow-md">
                        <input
                          type="text"
                          value={editedTask.title}
                          onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                          className="w-full p-2 mb-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <textarea
                          value={editedTask.description}
                          onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                          className="w-full p-2 mb-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={handleCancel}
                            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleSave}
                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                          >
                            Guardar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <Task
                        task={task}
                        onEdit={() => handleEdit(task)}
                        onDelete={() => onDeleteTask(task._id)}
                      />
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column; 