import { useState} from 'react'
import { useRouter } from 'next/router'
import {getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential, signOut } from 'firebase/auth'
import Input from '../utilidades/Input'
import Swal from "sweetalert2/dist/sweetalert2.all"


export default function contraseña() {
  const auth = getAuth()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const opciones = {
    name:"contraseña_vieja",
    type:"password",
    errormsg:"Campo obligatorio, de 8-20 carácteres mínimo 1 especial",
    pattern:"(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$",
    placeholder:"Antigua contraseña"
  }
  const opciones2 = {
    name:"contraseña_nueva",
    type:"password",
    errormsg:"Campo obligatorio, de 8-20 carácteres mínimo 1 especial",
    pattern:"(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$",
    placeholder:"Nueva contraseña"
  }
  const onSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title:"Cambiar Contraseña",
      text: "¿Estás seguro de cambiar tu contraseña?",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'SI',
      cancelButtonText: 'NO',
  }).then((resp) => {
    if (resp.isConfirmed) {
      const credentials = EmailAuthProvider.credential(auth.currentUser.email,password)
      reauthenticateWithCredential(auth.currentUser,credentials).then(() => {
        updatePassword(auth.currentUser, newPassword).then(() => {
            Swal.fire({
              title:"Contraseña actualizada",
              text: "Se ha acutalizado la contraeña con éxito, se va a cerrar la sesión",
              icon: "success",
            }).then(() => {
              signOut(auth).then(() => {
                sessionStorage.removeItem('Token')
                router.push('/login')
              })
            })
        }).catch(error => {
          console.log(error);
        })
      }).catch((error) => {
        console.log(error);
        Swal.fire({
          title:"Error",
          text:"Contraseñá errónea",
          icon:"warning",
        })
      })
    }})
  
  
  }

  

  const onChange = (e) => {
    setPassword(e.target.value)
  }
  const onChange2 = (e) => {
    setNewPassword(e.target.value)

  }
  return (

    <div>
      <div className='w-full border-b-2'>
        <h2 className='m-3 font-bold'>Cambiar Contraseña</h2>
      </div>
      <div className='m-8'>      
        <form onSubmit={onSubmit} className='flex flex-col flex-1  items-center justify-content content-center space-y-2'>
          <span className=' font-semibold'>Antigua contraseña</span>
          <Input {...opciones} value={password} onChange={onChange}/>
          <span className=' font-semibold'>Nueva contraseña</span>
          <Input {...opciones2} value={newPassword} onChange={onChange2}/>
          <button className='p-2 w-24 text-white bg-blue-500 shadow-xl rounded-lg hover:bg-blue-600 transition duration-300'> Actualizar </button>
        </form>
     
      </div>
      
    </div>
    
  )
}
