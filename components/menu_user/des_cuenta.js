
import { getAuth, signOut, unlink } from 'firebase/auth'
import { app } from '../firebase'
import { useRouter } from 'next/router'

import Swal from "sweetalert2/dist/sweetalert2.all"

export default function des_cuenta() {
    const auth = getAuth()
    const router = useRouter()
    const desvincular= () => {
        const provider = auth.currentUser.providerData[0].providerId
        Swal.fire({
            title: "Desvincular",
            text:" ¿Estás segur@ de desinvuclar tu cuenta de NewComponents? ",
            icon:"warning",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'SI',
            cancelButtonText: 'NO',
        }).then((resp) => {
            if (resp.isConfirmed) {
                unlink(auth.currentUser, provider).then(() => {
                    Swal.fire({
                        title: "Desvinculado con éxito",
                        text:" se ha desvinculado su cuenta correctamente",
                        icon:"success",
                    }).then(() => {
                        signOut(auth).then(() => {
                            sessionStorage.removeItem('Token')
                            router.push('/login')
                          })
                    })
                })
            }
        })
    }
   return (
    <div>
      <div className='w-full border-b-2'>
        <h2 className='m-3 font-bold'>Desvincular cuenta</h2>
      </div>
      <div className='flex items-center justify-center content-center'>
          <button onClick={desvincular} className='my-24 p-2 w-28 text-white bg-blue-500 shadow-xl rounded-lg hover:bg-blue-600 transition duration-300'> Desvincular </button>
      </div>
      
    </div>
  )
}
