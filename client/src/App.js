import { useEffect, useState } from "react";
import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";
import Auth from './components/Auth'
import {useCookies} from 'react-cookie'
import { TaskProvider, useTaskContext } from './components/TaskContext';
import Popup from './components/Popup';

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [productivityTip, setProductivityTip] = useState('');
  const { tasks, setTasks } = useTaskContext();

  const authToken = cookies.AuthToken;
  const userEmail = cookies.Email;
  

  const productivityTips = [
    "Break large tasks into smaller, manageable chunks.",
    "Use the two-minute rule: if a task takes less than two minutes, do it now.",
    "Try the Pomodoro Technique: work for 25 minutes, then take a 5-minute break.",
    "Prioritize your tasks using the Eisenhower Matrix.",
    "Set specific goals for each day to stay focused and motivated.",
  ];

  const getData = async () => {
    try{
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/tasks/${userEmail}`);
      if(response.ok) {
      const json = await response.json(); 
      setTasks(json); 
    } else{
      console.error("Failed to add task: ", response.statusText)
    }
    } catch (err){
      console.error("Error fetching task: ",err)
    }
  }

  useEffect(() => {
    if(authToken ){
      getData();

      if(localStorage.getItem('justLoggedIn') === 'true'){
        const popupTimer = setTimeout(() => {
          const randomTip = productivityTips[Math.floor(Math.random() * productivityTips.length)];
          setProductivityTip(randomTip);
          setShowWelcomePopup(true);
          localStorage.removeItem('justLoggedIn');
        }, 1000);
        
        return () => clearTimeout(popupTimer);
      }
    }} , [authToken, userEmail])

  console.log(tasks)

  //sort by date 

  const sortedTasks = tasks?.sort((a,b) => new Date(a.date) - new Date(b.date))
  
  
  return (
    <div className="app">
      { !authToken && <Auth/>}
      { authToken && 
         <>
         <ListHeader ListName = {"Tasks to do!"} getData={getData}/>
         <p className="user-email">Welcome, {userEmail ? userEmail.split('@')[0] : 'User'}!</p>
         {sortedTasks?.map((task) => <ListItem key= {task.id} task ={task} getData={getData}/>)} 
        
        {showWelcomePopup && (
        <Popup trigger={showWelcomePopup} setTrigger={setShowWelcomePopup}>
        <h3>Welcome, {userEmail ? userEmail.split('@')[0] : 'User'}!</h3>
        <p>Here's a productivity tip to get you started:</p>
        <p><em>"{productivityTip}"</em></p>
        </Popup> 
        )}
         </> 
      }
    </div>
  );
}

const AppWrapper = () => (
  <TaskProvider>
    <App />
  </TaskProvider>
)

export default AppWrapper;
