import { useEffect, useState} from 'react'
import { useRouter } from 'next/router'
import { onAuthStateChanged, getAuth } from 'firebase/auth'
import Nombre from "../components/menu_user/nombre"
import Correo from "../components/menu_user/correo"
import Contraseña from "../components/menu_user/contraseña"
import Veri_Correo from "../components/menu_user/veri_correo"
import Elim_Cuenta from "../components/menu_user/elim_cuenta"
import Imagen from '../components/menu_user/imagen'
import Navbar from '../components/navbars/navbar'
import Footer from '../components/footer/footer'
import Des_cuenta from '../components/menu_user/des_cuenta'
import Pedidos from '../components/menu_user/pedidos'
export default function accountsettings() {
    const [user, setUser] = useState(null)
    const router = useRouter()
    const auth = getAuth()
    const [ver_comp, setVer_comp] = useState(2)
    const [provider, setProvider] = useState("")
    const [opciones, setOpciones] = useState([])
    useEffect(() => {
        let token = sessionStorage.getItem('Token')
        if (!token) router.push('/')   
            onAuthStateChanged(auth, (usuario) => {
                if (usuario) {
                    setUser(usuario) 
                    setProvider(usuario.providerData[0].providerId)
                        if (usuario.providerData[0].providerId === 'google.com') {
                            setOpciones(['Cambiar Nombre',"Verificar Correo","Pedidos","Desvincular Cuenta"])
                        }else {
                            setOpciones(['Cambiar Nombre','Cambiar Imagen','Cambiar Correo','Cambiar Contraseña','Verificar Correo',"Pedidos",'Eliminar Cuenta'])
                        }
                }else setUser(null)
            })
        
    }, [])
    
    const handleComp = (num) => {
        setVer_comp(num)
    }

  return (
      <>
      <Navbar/>
      <div className="flex items-center justify-center content-center mb-12" >
        <div className="mt-24 w-[90vh] border-2 ">
            <div className=" flex  m-8 space-x-12 relative">
                { user !== null &&
                    <>
                    <img src={user.photoURL} className="rounded-full w-32"/>
                    <span className='mt-10 text-2xl'>{user.displayName} </span>
                    <span className='absolute bottom-2 right-0 text-xl'>Proveedor: {provider == 'google.com' ? "Google" : "NewComponents" }</span>
                    </>
                }              
            </div>
            <div className='flex border-t-2 h-auto'>
                <div className='w-[30vh] border-r-2' >
                        <div className='flex flex-1 flex-col text-start content-start'>
                              {opciones.map((opcion, key) => {
                                  return (
                                    <span key={key} onClick={() =>handleComp(key)} className={`${key !== opciones.length-1 && 'border-b-2'} p-3 cursor-pointer hover:bg-blue-200 transition duration-300`}>{opcion}</span> 
                                  )
                              })}
                        </div>
                </div>
                <div className='w-[78vh]'>
                    {
                        provider !== 'google.com' ?
                        ver_comp == 0 ? <Nombre/> : ver_comp == 1 ? <Imagen/> : ver_comp == 2 ? <Correo/> : ver_comp == 3 ? <Contraseña/> : 
                        ver_comp == 4 ? <Veri_Correo/> : ver_comp == 5 ? <Pedidos/> : <Elim_Cuenta/>
                      :
                        ver_comp == 0 ? <Nombre/> : ver_comp == 1 ? <Veri_Correo/> : ver_comp == 2 ? <Pedidos/> : <Des_cuenta/>
                    
                    }
                           
                </div>
            </div>
        </div>
    </div>
    <Footer/>
      </>
    
  )
}
