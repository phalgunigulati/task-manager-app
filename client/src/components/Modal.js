import {useState, useEffect} from 'react'
import { useCookies } from 'react-cookie'
import { useTaskContext } from './TaskContext';
import Popup from './Popup'

const Modal = ({mode, setShowModal, getData, task}) => {
  
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const editMode = mode === 'edit' ? true : false
  const { taskProgress } = useTaskContext();
  const [buttonPopup, setButtonPopup] = useState(false);

  const[data, setData] = useState({
    user_email: editMode ? task.user_email : cookies.Email, 
    title: editMode ? task.title : null,
    progress: editMode ? task.progress : 50,
    date: editMode ? task.date : new Date()
  })

  useEffect(() => {
    if (editMode) {
      setData(prevData => ({...prevData, progress: taskProgress}));
    }
  }, [taskProgress, editMode]);

  const postData = async (e) => {
    e.preventDefault(); 
    try{
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/tasks`, {
        method: "POST",
        headers: {'Content-Type' : 'application/json'},
        body:  JSON.stringify(data)
    })
    if(response.ok){
      console.log("Task added successfully"); 
      setButtonPopup(true);
      setTimeout(() => {
        setButtonPopup(false);
        setShowModal(false);
      }, 3000);
      
      await getData();
    } else{
      console.error("Failed to add task: ", response.statusText)
    }
    } catch(err){
      console.error("Error adding task: ", err); 
    }
  }

  const editData = async (e) => {
    e.preventDefault(); 
    try{
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/tasks/${task.id}`, {
        method: 'PUT',
        headers: {'Content-Type' : 'application/json'},
        body:  JSON.stringify(data)
      })
      if(response.ok){
        console.log("Task edited successfully"); 
        setShowModal(false);
        await getData();
      } else{
        console.error("Failed to edit task: ", response.statusText)
      }
    } 
    catch(err){
      console.error("Error while editing task: ", err); 
    }
  }


  const handleChange = (e) => {
    const {name, value} = e.target

    setData(data => ({
      ...data, 
      [name] : value
    }))

    console.log(data); 
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      editData(e);
    } else {
      postData(e);
    }
  }

  const newTaskMessages = [
    {title: "Great job! 🎉", message: "Your new task has been added successfully."},
    {title: "Task Added! 💪", message: "You're one step closer to achieving your goals!"},
    {title: "Task Created! 🚀", message: "Houston, we have a new mission!"},
    {title: "New Task on Board! ✅", message: "Keep up the great work - productivity level rising!"},
    {title: "Task Successfully Added! 🌟", message: "You've got this! Every task is a step towards success."}
  ];
  
  // to create the popup content:
  const randomMessage = newTaskMessages[Math.floor(Math.random() * newTaskMessages.length)];
  return (
    <div className='overlay'>
      <div className='modal'>
      <div className='form-title-container'>
        <h3> Let's {mode} your task</h3>
        <button id="btn" onClick={() => setShowModal(false)}> X </button>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          required
          maxLength={30}
          placeholder='Add task here'
          name='title'
          value={data.title || ''}
          onChange={handleChange}
        />
        <br />
        <label htmlFor="range">Select your progress by dragging!</label>
        <input
          type='range'
          id='range'
          min="0"
          max="100"
          name='progress'
          value={data.progress}
          onChange={handleChange}
        />
        <input 
        className={mode} 
        type="submit" 
        value={mode === 'edit' ? 'Edit Task' : 'Add Task'}
        />
      </form> 
      <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
      <h3>{randomMessage.title}</h3>
      <p>{randomMessage.message}</p>
      </Popup>
      </div>
   
    </div>
   
  )
}

export default Modal