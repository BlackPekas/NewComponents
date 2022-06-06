import {app} from '../firebase'
import { useState, useEffect } from 'react'
import { getAuth } from 'firebase/auth'
import {getFirestore, query, where, getDocs, collection, orderBy} from 'firebase/firestore'
import { ChevronDownIcon} from '@heroicons/react/outline'
import Reseña from './reseña'
import Link from 'next/link'
import {v4} from 'uuid'
export default function pedidos() {
    const auth = getAuth()
    const db = getFirestore(app)
    const [pedidos, setPedidos] = useState([])
    const [menu_pedidos, setMenu_pedidos] = useState([])
    useEffect(() => {
        getPedidos()
    }, [])
    const getPedidos = async () => {
        const pedidos =  collection(db, "pedidos")
        const p = query(pedidos, where("id", "==", auth.currentUser.uid), orderBy('fecha', 'desc'))
        const docs = await getDocs(p)

        if (docs.empty) {
        }else {
            const data = docs.docs.map(doc => doc.data())
            console.log(data);
            setPedidos(data)
        }
    }
    useEffect(() => {
        if (pedidos.length > 0) {
            setMenu_pedidos(Array(pedidos.length).fill(false))
        }
    }, [pedidos])
    const onChange = (e, bool) => {
        setMenu_pedidos({...menu_pedidos, [e.target.name]: bool})
    }
  return (
    <>
    <div className='w-full border-b-2'>
      <h2 className='m-3 font-bold'>Pedidos</h2>
    </div>
    <div className='w-full'>
        { pedidos.length > 0 ?
            <>
            {pedidos.map((pedido,key) => {
                var total = 0
                return (
                    <>
                    <button onClick={ (e) => {onChange(e, !menu_pedidos[key])}} name={key} className={`border-b-2 w-full  h-full p-3 flex justify-center content-center hover:bg-slate-200 transition duration-500  `}> Pedido número {key+1} {pedido.fecha}
                    <ChevronDownIcon className={`${!menu_pedidos[key] ? 'rotate-0' : 'rotate-180'} transform duration-500 w-6 ml-4`}/>
                     </button>
                    <div className={`${menu_pedidos[key] ? 'flex': 'hidden'} flex-col flex-1 transition duration-500 w-full border-b-2`}>
                    <div className='p-3 text-center content-center flex flex-1 flex-col space-y-4 border-b-2'>
                        <span>{pedido.id_pedido}</span>
                    </div>
                    <div className=' flex flex-1 flex-col m-4'>
                        {pedido.productos.map((producto, key) => {
                            const precio = parseFloat(parseFloat(producto.precio_unidad)*producto.unidades).toFixed(2)
                            total += parseFloat(precio).toFixed(2)
                            return (
                                <>
                                <div key={key} className='grid grid-cols-1 sm:flex md:i m-3'>
                                    <Link href={`/productos/${producto.nombre2}`}>
                                    <img src={producto.img} className=" w-36"/></Link>
                                    <div className='m-4 flex flex-col flex-1 space-y-2'>
                                    <span className=''>{producto.nombre}</span>  
                                    <div className='flex space-x-4 relative'>
                                    <span> Unidades: {producto.unidades}</span>
                                    <span className='font-semibold text-red-600 absolute -bottom-8 md:-bottom-auto md:right-16'>{precio}€</span>
                                    </div>
                                    </div>  
                                </div>
                                <div className='flex flex-col  flex-1 justify-center content-center text-center mt-4 md:mt-auto'>
                                        <Reseña nombre={producto.nombre} id={pedido.id_pedido}/>
                                </div>
                                </>
                            )
                        })}
                       <div className='w-full text-center  space-x-5 mt-6'>
                       <span className=''> Precio total:</span>
                       <span className='font-semibold text-red-600'>{total}€</span>
                       </div>
                    </div>
                    </div>
                    </>
                )
            })}
            </>
        :
            <>
            <div className='mt-16 justify-center content-center text-center'>
                <span className='font-semibold text-blue-600'>No existe ningún pedido registrado</span>
            </div>
            </>
        }
    </div>
   
    
  </>
  )
}
