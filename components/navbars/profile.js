import { useState } from "react"
import { onAuthStateChanged, getAuth, signOut } from 'firebase/auth'
import { app } from '../firebase'
import { useRouter } from 'next/router'
import { useEffect } from "react"
import Link from "next/link"
export default function Profile(props) {

    const auth = getAuth()
    const [user, setUser] = useState(null)
    const router = useRouter()
    const [menu, setMenu] = useState(false)
    useEffect(() => {
      onAuthStateChanged(auth, (usuario) => {
        usuario ? setUser(usuario) : setUser(null)
    })
    }, [])
  
    const cerrarSesion = () => {
        signOut(auth).then(() => {
            sessionStorage.removeItem('Token')
            localStorage.clear()
            router.reload('/')
        }).catch((error) => {
            console.log(error)
        })
    }
    
  return (

    <li className="space-y-4 md:space-y-2 lg:space-y-4">
        { user &&   
                   <>
                   <button onClick={() => {setMenu(!menu)}} className="flex items-center justify-center content-center">
                     <img src={user.photoURL} className=" h-6 rounded-full mx-2"></img>
                     <span className='hidden space-x-4 md:inline'>{user.displayName}</span> 
                   </button>

                    <div className={`${menu ? ' flex' : ' hidden '} rounded-lg right-0  lg:right-auto transition-opacity ease-in duration-500  flex flex-col flex-1 w-[15rem] h-auto bg-white absolute shadow-lg `}>
                    <div className=" border-b-2 flex-flex-1 flex-col justify-center text-center">
                      <div className="flex justify-start m-4">
                      <img src={user.photoURL} className=" overflow-hidden h-8 rounded-full mx-2"></img>
                     <span className='font-semibold text-xl'>{user.displayName}</span> 
                      </div>

                    </div>
                   <Link href={"/account-settings"}>
                      <div className=" border-b-2 flex text-center justify-center content-center cursor-pointer hover:bg-slate-200 transition duration-500">
                      <span className="font-semibold text-xl m-2  ">Cuenta</span></div>
                   </Link>
                      <div onClick={cerrarSesion} className=" flex text-center justify-center content-center cursor-pointer hover:bg-slate-200 transition duration-500">
                      <span className="font-semibold text-xl m-2  ">Cerrar Sesión</span></div>
                    </div>
                    </>
        }                   
                   
        

    </li>
  )
}
