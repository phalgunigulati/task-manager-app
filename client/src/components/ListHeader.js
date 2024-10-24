import Modal from './Modal';
import { useState } from 'react';
import { useCookies } from 'react-cookie';

const ListHeader = ({ListName, getData}) => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [showModal, setShowModal] = useState(false);
    function signout(){
       console.log("signout"); 
       removeCookie('Email')
       removeCookie('AuthToken')
       window.location.reload()
    }

  return (
    <div className='list-header'>
       <h1>{ListName}</h1>
       <div className='button-container'>
        <button className='create' onClick={() => setShowModal(true)}>Add New</button>
        <button className='signout' onClick={signout}>Signout</button>
       </div>
       { showModal && <Modal mode={'create'} setShowModal={setShowModal} getData={getData}/> } 
   </div>
  )
}

export default ListHeader