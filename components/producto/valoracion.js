import StarRatings from 'react-star-ratings'
export default function valoracion({valoracion}) {
  return (
    <div className="space-y-4 p-4 border-2 rounded-xl  w-[20rem] justify-items-start content-start justify-start text-justify  ">
        <div className="flex">
        <img className="w-16 rounded-full" src={valoracion.foto}/>
        <div className="flex flex-col flex-1 mt-2 mx-4">
        <span className="text-lg font-semibold ">{valoracion.usuario}</span>
        <span className="text-sm font-semibold text-gray-400">{valoracion.fecha}</span>

        </div>
        </div>
        <div className="flex flex-col flex-1">
            <StarRatings rating={valoracion.estrellas} starRatedColor="orange" numberOfStars={5} name='Rating' starDimension="20px" starSpacing="2px"/>
            <text>{valoracion.texto}</text>
        </div>
        
    </div>
  )
}
