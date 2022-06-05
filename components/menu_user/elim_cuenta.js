import { useState} from 'react'
import { useRouter } from 'next/router'
import {getAuth, EmailAuthProvider, reauthenticateWithCredential, signOut, deleteUser } from 'firebase/auth'
import { app } from '../firebase'
import {getFirestore, doc, deleteDoc} from 'firebase/firestore'
import Input from '../utilidades/Input'
import Swal from "sweetalert2/dist/sweetalert2.all"


export default function elim_cuenta() {
  const auth = getAuth()
  const router = useRouter()
  const db = getFirestore(app)
  const [password, setPassword] = useState('')
  const opciones = {
    name:"contraseña_vieja",
    type:"password",
    errormsg:"Campo obligatorio, de 8-20 carácteres mínimo 1 especial",
    pattern:"(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$",
    placeholder:"Contraseña"
  }
  const eliminar = (e) => {
    e.preventDefault()
    Swal.fire({
      title:"Eliminar Cuenta",
      text: "¿Estás seguro de que quieres eliminar tu cuenta, perderás todo?",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'SI',
      cancelButtonText: 'NO',
    }).then((resp) => {
      if (resp.isConfirmed) {
        const credentials = EmailAuthProvider.credential(auth.currentUser.email,password)
      reauthenticateWithCredential(auth.currentUser,credentials).then(() => {
        deleteDoc(doc(db, "usuarios",auth.currentUser.uid)).then(() => {
          deleteUser(auth.currentUser).then(() => {
            Swal.fire({
              title:"Cuenta Eliminada",
              text:"Se ha eliminado la cuenta con éxito",
              icon: "success",
            }).then(() => {
                
              signOut(auth).then(() => {
                sessionStorage.removeItem('Token')
                router.push('/login')
              })
            })
        }).catch((err) => {console.log(err);})
        })
        
      }).catch((error) => {
        console.log(error);
        Swal.fire({
          title:"Error",
          text:"Contraseñá errónea",
          icon:"warning",
        })
      })
        
      }
    })
  }
  const onChange = (e) => {
    setPassword(e.target.value)
  }
  return (
    <div>
      <div className='w-full border-b-2'>
        <h2 className='m-3 font-bold'>Eliminar Cuenta</h2>
      </div>
      <div className='flex items-center justify-center content-center'>
      <div className='flex m-16'>
      <form onSubmit={eliminar} className='flex flex-col flex-1  items-center justify-content content-center space-y-2'>
          <span className=' font-semibold'>Contraseña</span>
          <Input {...opciones} value={password} onChange={onChange}/>
          <button className=' mt-32 p-2 w-28 text-white bg-blue-500 shadow-xl rounded-lg hover:bg-blue-600 transition duration-300'> Eliminar </button>
        </form>
      </div>
      </div>
      
    </div>
  )
}
