import Link from "next/link"
import Logo from "./icons/Logo"
import { ArrowNarrowLeftIcon } from "@heroicons/react/outline"

export default function Header() {
  return (
    <header className="flex mt-2 lg:hidden ">
    <div className=" w-full border-b-2 border-gray-300 lg:border-none">
        <nav className="flex lg:none m-2  ml-5 mt-0 lg:mt-[5%] space-x-8">
            <div className="flex ">
            <Link href="/" className="">
              <ArrowNarrowLeftIcon className="h-8" />
                
            </Link>
            </div>
            <div className="">
            <Link href="/" className="">
              <Logo className='h-8'/>
            </Link>
            </div>            
        </nav>
    </div>
    </header>
  )
}
