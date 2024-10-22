import React from 'react'

const ProgressBar = ({progress}) => {

  return (
    <div className='out-bar'>
      <div 
      className='in-bar' 
      style ={{width: `${progress}%` , backgroundColor: 'rgb(78, 158, 212)' }}
      >
      </div>
    </div>
  )
}

export default ProgressBar