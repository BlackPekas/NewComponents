import { useEffect, useState} from 'react'
import { useRouter } from 'next/router'
import { getAuth, updateProfile } from 'firebase/auth'
import Input from '../utilidades/Input'
import Swal from "sweetalert2/dist/sweetalert2.all"

export default function nombre() {
  const auth = getAuth()
  const [nombre, setNombre ] = useState('') 
  const router = useRouter()
  const opciones = {
    name:"nombre",
    type:"text",
    errormsg:"Campo obligatorio, de 3-14 carácteres",
    pattern:"^[A-Za-z0-9 ]{3,14}$",
    placeholder:"Nombre"
  }
  const onChange = (e) => {
    setNombre(e.target.value)
  }
  const onSubmit =  (e) => {
    e.preventDefault()
    Swal.fire({
      title:"Actualizar Nombre de Usuario",
      text:"Estas seguro??",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'SI',
      cancelButtonText: 'NO',
    }).then((resp) => {
      resp.isConfirmed && 
      Swal.fire({
        title:"Actualizado con éxito",
        icon:"success",
      }).then(() => {
        updateProfile(auth.currentUser, {
          displayName: nombre
        })
        router.reload()
      })
       
    })
  }
  return (

    <div>
      <div className='w-full border-b-2'>
        <h2 className='m-3 font-bold'>Cambiar Nombre</h2>
      </div>
      <div className='m-16'>      
        <form onSubmit={onSubmit} className='flex flex-col flex-1  items-center justify-content content-center space-y-4'>
          <span className=' font-semibold'>Nombre de Usuario</span>
          <Input {...opciones} value={nombre} onChange={onChange}/>
          <button className='p-2 w-24 text-white bg-blue-500 shadow-xl rounded-lg hover:bg-blue-600 transition duration-300'> Actualizar </button>
        </form>
    </div>
      
    </div>
    
  )
}
