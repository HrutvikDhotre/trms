import React, { useState, useEffect } from 'react';
import '../styles/todoitem.css'


const ToDoItem = ({ task, onDelete, onComplete }) => {
    const [isCompleted, setIsCompleted] = useState(task.completed);
    const [creationTime, setCreationTime] = useState('');
    const [completionTime, setCompletionTime] = useState('');
  
    useEffect(() => {
      // Set creation time when component mounts
      const formattedCreationTime = new Date(task.creationTime).toLocaleString();
      setCreationTime(formattedCreationTime);
  
      // Update completion time if task is completed
      if (isCompleted && !completionTime) {
        const formattedCompletionTime = new Date().toLocaleString();
        setCompletionTime(formattedCompletionTime);
      }
    }, [task.creationTime, isCompleted, completionTime]);
  
    useEffect(() => {
      // Update localStorage when task completion state changes
      localStorage.setItem(`task_${task.id}_completed`, JSON.stringify(isCompleted));
    }, [isCompleted, task.id]);
  
    const handleComplete = () => {
      const updatedCompletionState = !isCompleted; // Toggle completion state
      setIsCompleted(updatedCompletionState);
      onComplete(task.id, updatedCompletionState); // Pass updated completion state to parent component
  
      // Update completion time if task is completed
      if (updatedCompletionState && !completionTime) {
        const formattedCompletionTime = new Date().toLocaleString();
        setCompletionTime(formattedCompletionTime);
      } else if (!updatedCompletionState) {
        setCompletionTime(''); // Reset completion time if task is marked incomplete
      }
    };
  
    const renderActionButton = () => {
      if (isCompleted) {
        return (
          <button className="undo" onClick={handleComplete}>Undo</button>
        );
      } else {
        return (
          <button className="complete" onClick={handleComplete}>Complete</button>
        );
      }
    };
  
    return (
      <li className={`todo-item ${isCompleted ? 'completed' : ''}`}>
        <span>{task.text}</span>
        <div className="task-info">
          <div className="time-info">
            <div className="creation-time">Created: {creationTime}</div>
            {completionTime && <div className="completion-time">Completed: {completionTime}</div>}
          </div>
          <div className="buttons" style={{float : 'right'}}>
            {renderActionButton()}
            <button className="delete" onClick={() => onDelete(task.id)}>Delete</button>
          </div>
        </div>
      </li>
    );
  }

export default ToDoItem