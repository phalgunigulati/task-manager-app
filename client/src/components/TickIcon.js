import React, { useState }  from 'react'
import Popup from './Popup'
import { useTaskContext } from './TaskContext';

const TickIcon = ({id, progress}) => {
  const [buttonPopup, setButtonPopup] = useState(false);
  const { updateTaskProgress } = useTaskContext();
  
  const handleChange = (event) => {
   
    const newProgress = event.target.checked ? 100 : 50;
    updateTaskProgress(id, newProgress);
    
    if (newProgress === 100) {
      setButtonPopup(true);
      setTimeout(() => setButtonPopup(false), 3000); // Close popup after 3 seconds
    }
  }

  return (
    <>
      <input className='tick'
        type="checkbox"
        checked = {progress === 100}
        onChange = {handleChange}
      />
      <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
        <h3>Congratulations! 🎉 </h3>
        <p>You have been productive today! </p>
      </Popup>

    </>
  )
}

export default TickIcon;