import {useState } from 'react'; 
import TickIcon from './TickIcon'
import ProgressBar from './ProgressBar'
import Modal from './Modal' 
import { useTaskContext } from './TaskContext';

const ListItem = ({task, getData}) => {
  const [showModal, setShowModal] = useState(false); 

  const deleteItem = async () => {
    try{
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/tasks/${task.id}`, {
        method: 'DELETE'
      })
      if(response.ok){
        console.log("Task deleted successfully");
        getData()
      }
    } catch(err){
      console.error("Error deleting task: ",err)
    }
  } 

  return (
    <li className='list-item'> 

      <div className="info-container">
      <TickIcon id={task.id} progress={task.progress} />
      <p className='task-title'>{task.title}</p>
      </div>

      <div className='button-container'>
        <button className='edit'onClick={() => setShowModal(true)}>Edit</button>
        <button className='delete' onClick={deleteItem}>Delete</button>
        <ProgressBar progress={task.progress} />
      
      </div>

      { showModal && <Modal mode={'edit'} setShowModal={setShowModal} getData={getData} task={task} />}

    </li>
  
      
   
  )
}

export default ListItem