import { useState } from "react"

export default function Input(props) {
    const { onChange, id,  errormsg, ...inputProps} = props
    const [focus, setFocus] = useState('false');
    const handleFocus = (e) => {
      setFocus(true);
    }
  return (
    <div className=" flex flex-col flex-1 ">
        <input 
        {...inputProps} 
        onChange={onChange} 
        onBlur={handleFocus}
        onFocus={() => {inputProps.name==="confirmcontraseña" && setFocus(true)}} 
        focused={focus.toString()} 
        className="inputform rounded border p-2  hover:bg-indigo-50 duration-15 hover:border-blue-400" required/>
        <span className=" text-red-500 text-sm invisible">{errormsg}</span>
    </div>
  )
}
