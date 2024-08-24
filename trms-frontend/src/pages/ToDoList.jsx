import React, { useState, useEffect } from 'react'
import { ToDoItem, Layout } from '../components'
import { useStateContext } from '../contexts/ContextProvider'
import '../styles/todolist.css'

const ToDoList = () => {
    // Load tasks from localStorage when component mounts

    const { currentColour } = useStateContext()
    const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem('tasks')) || []);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        // Update localStorage whenever tasks state changes
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const handleAddTask = () => {
        if (newTask.trim() !== '') {
            // Generate creation time
            const creationTime = Date.now();

            // Add new task to tasks array and update state
            const newTaskObj = { id: creationTime, text: newTask, completed: false, creationTime: creationTime };
            setTasks([...tasks, newTaskObj]);
            setNewTask('');

            // Update localStorage to save new task
            localStorage.setItem('tasks', JSON.stringify([...tasks, newTaskObj]));
        }
    };

    const handleDeleteTask = (taskId) => {
        // Remove task from tasks array and update state
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);

        // Update localStorage to reflect task deletion
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    const handleCompleteTask = (taskId) => {
        // Update completion state of task and update state
        const updatedTasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        setTasks(updatedTasks);

        // Update localStorage to reflect task completion
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    return (
        <Layout>
            <div style={{
                marginTop: '80px', backgroundColor: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>

                <div className="todo-list-container" style={{
                    // marginTop: '80px', 
                    width: '100%',
                    backgroundColor: 'white',

                }}>
                    <div className='' style={{
                        display : 'flex',
                        justifyContent : 'center',
                        alignItems : 'center'
                    }}>
                    <h2 className=" fs-2 " style={{display : 'inline'}}>MY TASKS</h2>
                    <div className='p-0 ms-3 mb-2' style={{ display: 'inline' }}>
                        {/* <RiLockPasswordFill></RiLockPasswordFill> */}
                        <img src="./images/list.gif" alt=""
                            style={{
                                width: '40px'
                            }}
                        />
                    </div>
                    </div>
                    <div className="todo-input mb-3" style={{ width: '100%' }}>
                        <input
                            type="text"
                            placeholder="Add a new task"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            className="todo-input-field"
                            style={{ width: '78%' }}
                        />
                        <button onClick={handleAddTask} className="mt-3 px-3 ms-2"
                            style={{
                                backgroundColor: currentColour,
                                borderRadius: '5px',
                                height: '45px',
                                fontSize: '18px',
                                color: 'white'
                            }}>Add Task</button>
                    </div>
                    <ul className="todo-items">
                        {tasks.map(task => (
                            <ToDoItem
                                key={task.id}
                                task={task}
                                onDelete={handleDeleteTask}
                                onComplete={handleCompleteTask}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </Layout>
    );
}

export default ToDoList