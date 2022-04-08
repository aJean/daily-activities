import React from 'react'

const CustomCom: React.FC<any> = ({ value, onChange }) => {
  return (
    <input value={value} onChange={onChange}/>
  )
}

export default CustomCom