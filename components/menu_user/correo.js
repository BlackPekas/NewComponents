import { useEffect, useState} from 'react'
import { useRouter } from 'next/router'
import {getAuth, updateEmail, onAuthStateChanged, EmailAuthProvider, reauthenticateWithCredential, signOut } from 'firebase/auth'
import Input from '../utilidades/Input'
import Swal from "sweetalert2/dist/sweetalert2.all"

export default function correo() {
  const auth = getAuth()
  const [email, setEmail ] = useState('') 
  const [user, setUser] = useState(null)
  const [password, setPassword] = useState('')
  const router = useRouter()
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      }
    });
  },[])
  const opciones = {
    name:"email",
    type:"email",
    errormsg:"Campo obligatorio, formato de correo",
    pattern:"[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$",
    placeholder:"E-mail"
  }
  const opciones2 = {
    name:"contraseña",
    type:"password",
    errormsg:"Campo obligatorio, de 8-20 carácteres mínimo 1 especial",
    pattern:"(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$",
    placeholder:"Contraseña*"
  }
  const onChange = (e) => {
    setEmail(e.target.value)
  }
  const onChange2 = (e) => {
    setPassword(e.target.value)
  }
  const onSubmit =  (e) => {
    e.preventDefault()
  
    if (user.email === email) {
      Swal.fire({
        title:"Error",
        text: "El correo es el mismo, introduce uno nuevo",
        icon:"warning",
      })
    }else {
      Swal.fire({
        title:"Cambiar Correo Electrónico",
        text: "¿Estás seguro de cambiar tu correo electrónico?",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'SI',
        cancelButtonText: 'NO',
    }).then((resp) => {
      if (resp.isConfirmed) {
        const credentials = EmailAuthProvider.credential(
          auth.currentUser.email,
          password
        )
        reauthenticateWithCredential(auth.currentUser,credentials).then(() => {
          updateEmail(user,email).then(() => {
              Swal.fire({
                title:"Actualizado con éxito",
                text:"se ha actualizado el correo, ahora se va a cerrar la sesión actual",
                icon:"success", 
              })
              signOut(auth).then(() => {
                sessionStorage.removeItem('Token')
                router.push('/login')
              }).catch(err => {console.log(err);}) 
          }).catch((error) => {
            console.log(error);
            Swal.fire({
              title:"Error",
              text:"EL correo ya existe, introduce otro",
              icon:"warning",
            })
          })
        }).catch((error) => {
          console.log(error);
          Swal.fire({
            title:"Error",
            text:"Contraseña errónea",
            icon:"warning",
          })
        })
      }
      
    })
    }
  }

  return (
    <div>
      <div className='w-full border-b-2'>
        <h2 className='m-3 font-bold'>Cambiar Correo</h2>
      </div>
      <div className='m-8'>      
      <form onSubmit={onSubmit} className='flex flex-col flex-1  items-center justify-content content-center space-y-2'>
          <span className=' font-semibold'>Nuevo Email</span>
          <Input {...opciones} value={email} onChange={onChange}/>
          <span className=' font-semibold'>Introduce tu contraseña</span>
          <Input {...opciones2} value={password} onChange={onChange2}/>
          <button className='p-2 w-24 text-white bg-blue-500 shadow-xl rounded-lg hover:bg-blue-600 transition duration-300'> Actualizar </button>
        </form>
     
      </div>
      
    </div>

  )
}
