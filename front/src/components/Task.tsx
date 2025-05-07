import React from 'react';

interface TaskProps {
  task: {
    _id: string;
    title: string;
    description: string;
    columnId: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

const Task: React.FC<TaskProps> = ({ task, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-gray-800">{task.title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="text-gray-500 hover:text-blue-500 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="text-gray-500 hover:text-red-500 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <p className="text-gray-600 text-sm line-clamp-3">{task.description}</p>
      <div className="mt-3 flex items-center text-xs text-gray-500">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default Task; 