import { useState, useEffect, useRef } from "react"
export default function RangeSlider( {ValorMin, ValorMax, min, max, step, preciocap}) {
    const progreso = useRef(null)
     const [minValue, setMinValue] = useState(0)
     const [maxValue, setMaxValue] = useState(1000)
   
     const handleMin = (e) => {
        if (maxValue - minValue >= preciocap && maxValue <= max) {
          if (parseInt(e.target.value) > parseInt(maxValue)) {
          } else {
            setMinValue(parseInt(e.target.value))
            ValorMin(parseInt(e.target.value))
          }
        } else {
          if (parseInt(e.target.value) < minValue) {
            setMinValue(parseInt(e.target.value))
            ValorMin(parseInt(e.target.value))
          }
        }
      };
    
      const handleMax = (e) => {
        if (maxValue - minValue >= preciocap && maxValue <= max) {
          if (parseInt(e.target.value) < parseInt(minValue)) {
          } else {
            setMaxValue(parseInt(e.target.value))
            ValorMax(parseInt(e.target.value))
          }
        } else {
          if (parseInt(e.target.value) > maxValue) {
            setMaxValue(parseInt(e.target.value))
            ValorMax(parseInt(e.target.value))
          }
        }
      };
        
      useEffect(() => {
        progreso.current.style.left = (minValue / max) * step + "%";
        progreso.current.style.right = step - (maxValue / max) * step + "%";

      }, [minValue, maxValue, max, step]);
      

  return (
    <div className='flex flex-col flex-1'>
        <div className=' justify-center space-x-5 flex'>
            <div>
                <input type='number' onChange={(e) => setMinValue(e.target.value)} value={minValue} className='w-16 rounded-md text-center border-gray-400 border-2 ' disabled/>
            </div>
            <span>-</span>
            <div>
            <input type='number' onChange={(e) => setMaxValue(e.target.value)} value={maxValue} className='w-16 rounded-md text-center border-gray-400 border-2' disabled/>
            </div>
        </div>
        <div className="mb-16 w-[80%] ml-6">
            <div className="slider relative top-6 h-1 rounded-md bg-gray-300">
            <div ref={progreso} className="progress absolute h-1 bg-blue-300 rounded"></div>
            </div>
            <div className="range-input relative top-5 right-[4.4rem]">
            <input type='range' min={min} step={step} max={max} onChange={handleMin} value={minValue} className=' range-min absolute  w-full   h-1 bg-transparent appearance-none pointer-events-none '/>
            <input type='range' min={min} step={step} max={max} onChange={handleMax} value={maxValue} className=' range-max absolute  w-full h-1 bg-transparent appearance-none pointer-events-none  '/>
            </div>
        </div>
    </div>
  )
}
