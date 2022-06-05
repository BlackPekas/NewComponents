import Navbar from "./navbars/navbar"
import useSWR from 'swr'
import { useEffect, useState } from "react"
export default function Layout( { children } ) {
  const [ montado, setMontado] = useState(false)
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
  const { data} = useSWR(montado ? `http://localhost:3000/api/tipo/destacados` : "", fetcher)

  useEffect(() => {
    setMontado(true)
  }, [])
  

  return (
    <>
        <Navbar datos={data}/>
        <div className="w-full h-12 sm:h-16"></div>
        { children }

    </>
    
  )
}
