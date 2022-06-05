

export default function anuncios( { anuncios }) {

  return (
    <div className='flex flex-1 flex-col space-y-20  md:space-y-10 lg:space-y-4 items-center relative mb-24'>
        
        {anuncios.slice(0,4).map((dato, key) => {
            return (              
                    <a key={key} className='cursor-pointer ' href='/'><img src={dato.url} className=" w-36 shadow-lg  transition duration-300 hover:shadow-xl rounded-lg"/></a>
            )
        })}
    </div>
  )
}
