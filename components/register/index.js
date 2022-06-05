import Link from "next/link"
import Logo from "../icons/Logo"
import Info from "../login/info"
import Reg_form from "./form"
export default function Register() {
  return (
    <div className=" inline lg:flex lg:flex-col lg:flex-1 justify-center items-center text-center min-h-[100vh] ">
          <div className=" hidden mr-14 lg:inline">
          <div className=" hidden mr-14 lg:inline">
                <Link href="/">
                  <a className="flex space-x-3">
                  <Logo className="h-8 lg:h-12 cursor-pointer"/>
                  <span className="text-xl font-semibold mt-2">NewComponents</span>
                  </a>       
                </Link>
          </div>  
          </div>    
            <div className="flex justify-center items-center mt-16 lg:mt-0 ">
            <Info/>
            <Reg_form/>
            </div> 
    </div>
    )
}
