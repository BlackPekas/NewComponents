import { SearchIcon, LoginIcon, } from '@heroicons/react/outline'
import Logo from '../icons/Logo'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { onAuthStateChanged, getAuth } from 'firebase/auth'
import Profile from './profile'
import Menu from './menu'
import Cart from './cart'
import { useRouter } from 'next/router'

export default function navbar( ) {
    const auth = getAuth()
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [dato, setdato] = useState('')
    useEffect(() => {
        onAuthStateChanged(auth, (usuario) => {
            usuario ? setUser(usuario) : setUser(null)
        })

    }, [])
    const onEnter = (e) => {
        if ( e.key === 'Enter' && dato != '') {router.push(`/find/${dato}`);}
        else if (e.key === 'Enter' && dato === '') {router.push('/find/all');}
    }

    return (
        <div className='flex items-center justify-center w-full border-b-2 border-slate-800  fixed bg-white z-50 p-1 2xl:space-x-20'>        
            {/* Izquierda */}
            <div className=" ">
               <ul className='flex items-center justify-between mr-2 2xl:space-x-4'>     
                <Menu/>
                <div className='flex items-center cursor-pointer h-5 mr-0 sm:mr-6 md:mr-8 lg:mr-12'>
                    <a href='/' className='flex justify-center text-center space-x-4'>
                    <Logo className=' p-0 h-6 md:h-10 lg:h-12 '/>
                    <span className='hidden md:flex mt-3 font-bold text-blue-600'> NewComponents</span>
                    </a>
                </div>
               </ul>
            </div>    
            
            {/* Centro */}
            <div className="   relative p-2 rounded border hover:border-blue-200  w-[60%] md:w-[45%] lg:w-/5 ">
                <SearchIcon  className='h-6 hidden md:inline-block absolute right-4 cursor-pointer'/>
                <input onKeyDown={onEnter} 
                onChange={(event) => {setdato(event.target.value)}} 
                type="text" placeholder="Buscar Componentes"
                className='w-full ml-2 bg-transparent outline-none
                placeholder-gray-500'/>
            </div>
    


            {/* Derecha */}   
            <div className=' '>
            <ul className='flex justify-between  items-center ml-0 sm:ml-2 space-x-0 sm:space-x-4'>            
                    {/* Login */}
                    { user ?
                      <Profile/>
                      :
                      <li>
                      <Link href="/login">
                      <a className='flex  items-center justify-center text-center space-x-1 rounded py-2 px-2 w-full md:w-[100%] lg:w-[100%] mr-0 lg:mr-12 '>
                      <LoginIcon className='h-8'/>
                      <span className='hidden space-x-4 md:flex'>Mi Cuenta</span>
                      </a>
                      </Link> 
                      </li>
                    }

                            
                {/* Carrito */}
                <li>
                    <Cart/>
                    
                </li>
                
            </ul>

            </div> 
        </div>
    )
};

