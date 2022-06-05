import { CheckIcon, ChatIcon, CashIcon } from "@heroicons/react/outline"

export default function info() {
  return (
            <section className=" border-r-2 p-10 mb-16 text-justify  hidden lg:flex flex-col flex-1 ">
                <div className="flex" >
                    <div className="p-3  m-2">
                        <CashIcon className=" h-[4rem]"/>
                    </div>
                    <div className="mt-4 flex flex-1 flex-col">
                        <h1 className="font-bold text-xl">Lorem ipsum</h1>
                        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla accumsan orci et vestibulum commodo. </span>
                    </div>
                </div>
                <div className="flex " >
                    <div className="p-4  m-2">
                        <CheckIcon className=" h-[4rem] "/>
                    </div>
                    <div className="mt-4">
                        <h1 className="font-bold m-2 text-xl">¡Lorem ipsum!</h1>
                        <span> Suspendisse elementum vehicula metus eu fringilla. Nulla nec sagittis quam. </span>
                    </div>
                </div>
                <div className="flex " >
                    <div className="p-4  m-2">
                        <ChatIcon className=" h-[4rem]"/>
                    </div>
                    <div className="mt-4">
                        <h1 className="font-bold m-2 text-xl">¿Lorem ipsum?</h1>
                        <span>Aenean imperdiet viverra purus eget tempus. Proin posuere elementum quam.</span>
                    </div>
                </div>

            </section>  )
}
