import { useEffect, useState} from 'react'
import {getAuth, onAuthStateChanged, sendEmailVerification } from 'firebase/auth'
import Swal from "sweetalert2/dist/sweetalert2.all"
import { ExclamationIcon , CheckCircleIcon } from '@heroicons/react/outline'
export default function veri_correo() {
  const auth = getAuth()
  const [user, setUser] = useState(null)
  const [verificado, setVerificado] = useState(false)
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
       setVerificado(user.emailVerified)
      }
    });
  },[])
  const verificar = () => {
    sendEmailVerification(user).then(() => {
        Swal.fire({
          title:'Correo enviado',
          text: 'se ha enviado un correo de verificación',
          icon: 'success',
        })
    }).catch((err) => {console.log(err);})
  }
  return (

    <div>
      <div className='w-full border-b-2'>
        <h2 className='m-3 font-bold'>Verificar Correo</h2>
      </div>
      <div className='m-14'>      
        <div className='flex flex-col flex-1  items-center justify-content content-center space-y-4'>
            { verificado ? 
            <>
            <CheckCircleIcon className='w-16'/>
            <span className=' font-semibold'>El correo  esta verificado</span>
            </> 
            :  
            <>
            <ExclamationIcon className='w-16'/>
            <span className=' font-semibold'>El correo no esta verificado</span>
            <button onClick={verificar} className=' w-32 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold'> Verificar</button>
            </>}
              
        </div>
      </div>
    
    </div>
  )
}
