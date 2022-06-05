import { ShoppingCartIcon, MinusIcon, PlusIcon, TrashIcon, EmojiSadIcon,} from '@heroicons/react/outline'
import { useState, useEffect } from 'react'
import axios from 'axios'
import getStripe from '../stripe/get-stripe'
import Swal from "sweetalert2/dist/sweetalert2.all"
import { useRouter } from 'next/router'
export default function cart() {
    const [carrito, setCarrito] = useState([])
    const [mostrar, setMostrar] = useState(false)
    const router = useRouter()
    const [total, setTotal] = useState(0)
    useEffect(() => {
            const datos = JSON.parse(localStorage.getItem('carritoprueba2'))
            if (datos) {
                setCarrito(datos)
        }
    },[])
    useEffect(() => {
        var p_total = 0
        carrito.map((c) =>{p_total+= parseFloat(c.precio_final)})
        setTotal(p_total)
        localStorage.setItem('carritoprueba2', JSON.stringify(carrito))
    }, [carrito])
    
    const onClick = () => {
        setMostrar(!mostrar)
    }
    const UpdateCantidad = (key, valor) => {
        const upCarrito = [...carrito]

        if (valor === '-')  {
            if (upCarrito[key].unidades !== 1) {
                upCarrito[key].unidades -= 1 
                upCarrito[key].precio_final = (upCarrito[key].precio_unidad*upCarrito[key].unidades).toFixed(2)
            } 
        }else {
            if (upCarrito[key].unidades !== 15) {
                upCarrito[key].unidades +=1
            upCarrito[key].precio_final = (upCarrito[key].precio_unidad*upCarrito[key].unidades).toFixed(2)
            }
        }          
        setCarrito(upCarrito)

    }
    const DeleteDato = (dato) => {
        setCarrito(carrito.filter(dato2 => dato2.stripe_id !== dato.stripe_id))
    }
    const redirectToCheckout = async () => {
        const token = sessionStorage.getItem('Token')
        if (!token) {
            Swal.fire({
                title:"Iniciar Sesión",
                text: "Se necesita iniciar sesión para comprar en NewComponents",
                icon: "warning",
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: 'Iniciar Sesión',
                cancelButtonText: 'Cancelar',
              }).then((resp) => {
                if (resp.isConfirmed) {
                    router.push("/login")
                }
                    
              })
        }else {
            const { data: {id},} = await axios.post('/api/checkout_sessions',{
                items: Object.entries(carrito).map(([_, { stripe_id, unidades}]) => ({
                    price: stripe_id,
                    quantity: unidades,
                }))
            })
            const stripe = await getStripe()
            await stripe.redirectToCheckout({ sessionId : id})
        }     
    } 
  return (
    <>
            <button onClick={onClick} className='flex items-center space-x-1 rounded-full relative'>  
                        <ShoppingCartIcon className='h-6'/>
                        <span className='hidden space-x-4 md:flex'>Mi Carrito</span>
                        { carrito.length > 0 && <span className='w-6 rounded-full bg-blue-500 text-white absolute right-0 mb-6'>{carrito.length}</span>}

            </button>
            <div className={` ${mostrar ? 'right-0' : '-right-[400px]'} transition-all duration-500 overflow-y-auto scrollbar  fixed h-[70%] w-[20rem] lg:w-[25rem] bg-white shadow-lg rounded-lg mt-[18px]`}>
                { carrito.length < 1 ?
                        <div className=' w-full h-[80%] flex flex-1 flex-col content-center justify-center text-center'>
                            <span className=' font-semibold text-xl '> Carrito Vacío.</span>
                            <EmojiSadIcon className='w-32 mt-6 ml-32'/>
                            <span className=' w-[80%] ml-12 mt-20 font-semibold text-lg '>Agrega producto al carrito para empezar con tu compra.</span>
                        </div>
                :
                    <>
                    <div className='flex justify-between border-b-2 border-gray-200 m-4 rounded.lg'>
                    <h2 className='font-semibold m-3 text-2xl'>Carrito</h2>
                    <span className='text-gray-340 font-semibold mt-4'> Total: <span className=' text-blue-400'>{parseFloat(total).toFixed(2)}€</span></span>
                </div>
                <div className='flex flex-1 flex-col '>
                        {carrito.map((dato, key) => {
                            const precio_fixed = parseFloat(dato.precio_unidad).toFixed(2)
                            return (
                                <div key={key}  className='flex flex-col flex-1'>
                                    <div className='flex mt-6 ml-6 relative'>
                                    <img width={100} src={dato.producto.url[0]}/>
                                    <div className='flex flex-col flex-1'>
                                            <span className=' m-6'>{dato.producto.nombre}</span>
                                    </div>
                                    <TrashIcon onClick={() => {DeleteDato(dato)}} className='w-7 right-4 mt-16 absolute cursor-pointer'/>
                                </div>
                                    <div className='flex p-4 content-between justify-between'>
                                    <span className='text-blue-400'>{ precio_fixed }€</span>
                                    <div className='flex space-x-2'>
                                    <MinusIcon width={16} onClick={() => {UpdateCantidad(key, '-')}} className=' cursor-pointer'/>
                                    <input type={'number'} Value={dato.unidades} className=' flex text-center w-10 border-2 border-gray-200 rounded-lg'/>
                                    <PlusIcon width={16} onClick={() => {UpdateCantidad(key, '+')}} className=' cursor-pointer'/>
                                    </div>
                                    <span className='text-gray-340 font-semibold '> subTotal: <span className=' text-blue-400'>{dato.precio_final}€</span></span>
                                    </div>
                                </div>
                            )
                        })}

                     <button onClick={redirectToCheckout} className=' ml-24 mb-2 w-[50%] rounded p-2 bg-blue-500 text-center text-white font-semibold hover:bg-blue-600 duration-300'> Pagar</button>
                </div></>
                }
            </div>
    </>
    )
}
