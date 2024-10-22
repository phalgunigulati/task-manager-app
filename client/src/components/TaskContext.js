import React, { createContext, useState, useContext } from 'react';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
//const [taskProgress, setTaskProgress] = useState(50);
  const [tasks, setTasks] = useState([]); 

  const updateTaskProgress = async (taskId, newProgress) => {
    console.log('Updating progress for task:', taskId, 'to', newProgress);
    
    // First, update local state for immediate UI response
    setTasks(prevTasks => prevTasks.map(task => 
        task.id === taskId ? { ...task, progress: newProgress } : task
    ));

    // updating server
    try {
        const response = await fetch(`${process.env.REACT_APP_SERVERURL}/tasks/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ progress: newProgress })
        });
    
        if (!response.ok) {
          console.error('Failed to update task progress on server');
        }
      } catch (error) {
        console.error('Error updating task progress:', error);
      }
};
  
//   const updateProgress = (newProgress) => {
//     setTaskProgress(newProgress);
//   };

  return (
    <TaskContext.Provider value={{ tasks, setTasks, updateTaskProgress }}>
      {children}
    </TaskContext.Provider>
  );
};
export const useTaskContext = () => {
    const context = useContext(TaskContext);
    if (context === undefined) {
      throw new Error('useTaskContext must be used within a TaskProvider');
    }
    return context;
};
// export const useTaskContext = () => useContext(TaskContext);