import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import useSWR from 'swr'
import Navbar from '../components/navbars/navbar'
import { ShieldCheckIcon, RefreshIcon, ExclamationCircleIcon } from '@heroicons/react/outline'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { app } from '../components/firebase'
import axios from 'axios'
import {v4} from 'uuid'
export default function completado() {
    const auth = getAuth()
    const router = useRouter()
    const [user, setUser] = useState(null)
    const {
        query: { session_id},
    } = useRouter && useRouter()
    const fetcher = async (url) => {
      const res = await fetch(url)
      if (!res.ok) {
        const error = new Error("Error encontrado al recoger los datos")
        error.info = await res.json()
        error.status = res.status
        throw error
      }
      return res.json()
    }
    useEffect(() => {
        onAuthStateChanged(auth, (usuario) => {
            usuario ? setUser(usuario) : setUser(null)
        })

    }, [])
    const { data, error } = useSWR( `https://new-components-delta.vercel.app/api/checkout_sessions/${session_id}`,fetcher)
    useEffect(() => {

      if (data && user) {
        putProductos()

      }
    }, [data, user])
    useEffect(() => {console.log(error);},[error])
    const putProductos = async () => {
      var producto =  localStorage.getItem('producto')
      var carrito = localStorage.getItem('carritoprueba2')
      carrito = JSON.parse(carrito) 
      producto = JSON.parse(producto);
      const date = new Date()
      const m = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+"   "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
      if (producto) {
        const resp = await axios.post('/api/pedido', {producto:producto, id:"z0veCvMfJNYacwze2l9P8XirvSm1", user_id: user.uid, fecha: m, id_pedido:v4()}, {headers: {'Content-Type': 'application/json'}})
        const resp1 = await axios.put('/api/productos/putProducto', {producto:producto, id:"z0veCvMfJNYacwze2l9P8XirvSm1"}, {headers: {'Content-Type': 'application/json'}})
        if (resp.status == 200 && resp1.status == 200) {
          localStorage.removeItem('producto')
        }
      }else if (carrito) {
        const resp =await axios.post('/api/pedido', {carrito:carrito, id:"z0veCvMfJNYacwze2l9P8XirvSm1", user_id: user.uid, fecha: m, id_pedido:v4()}, {headers: {'Content-Type': 'application/json'}})
        const resp1 = await axios.put('/api/productos/putProducto', {carrito:carrito, id:"z0veCvMfJNYacwze2l9P8XirvSm1"}, {headers: {'Content-Type': 'application/json'}})
        if (resp.status == 200 && resp1.status == 200) {
          localStorage.removeItem('carritoprueba2')
        }
          
        
      }
      

    }
  return (
    <div>
      <Navbar/>
        { error ? (
          <div className='flex content-center justify-center text-center'>
          <div className=" mt-[13rem] w-[30rem] h-[20rem] rounded-lg shadow-2xl">
              <div className='flex flex-col flex-1 justify-center content-center text-center'>
                 <h2 className="mt-4 text-xl font-semibold">Ha surgido un problema.</h2>
                 <ExclamationCircleIcon className=' ml-44 mt-6 w-24'/>
                 <h2 className="mt-4 text-lg font-semibold"> Intentalo más tarde</h2>   
              </div>  
            </div>
        </div>
        )
            : !data ? (
              <div className='flex content-center justify-center text-center'>
              <div className=" mt-[13rem] w-[30rem] h-[20rem] rounded-lg shadow-2xl">
                  <div className='flex flex-col flex-1 justify-center content-center text-center'>
                     <h2 className="mt-4 text-xl font-semibold">Cargando...</h2>
                     <RefreshIcon className=' ml-44 mt-6 w-24'/>   
                  </div>  
                </div>
            </div>
            
              )
            : (
            <div className='flex content-center justify-center text-center'>
              <div className=" mt-[13rem] w-[30rem] h-[20rem] rounded-lg shadow-2xl">
                  <div className='flex flex-col flex-1 justify-center content-center text-center'>
                     <h2 className="mt-4 text-xl font-semibold">Su Compra se ha realizado con éxito.</h2>
                     <ShieldCheckIcon className=' ml-44 mt-6 w-24'/>   
                     <h2 className="mt-4 text-lg font-semibold"> Gracias por su compra {data.customer_details.name}</h2> 
                     <span className='p-4'> Para ver cualquier información del pedido, ve a pedidos en su cuenta.</span>
                  </div>  
                </div>
            </div>)
        }
    </div>
  )
}
