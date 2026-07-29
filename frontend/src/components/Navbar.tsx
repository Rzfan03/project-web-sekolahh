import { FaChevronDown } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="w-full bg-amber-500 p-5 h-fit">
<div className="flex justify-around items-center">
  <img className="h-24 w-25" src="https://smkn1sumbawa.sch.id/wp-content/uploads/2022/08/Logo-SMKN-1.png"/>
  <ul className="flex items-center text-lg gap-7 text-white font-semibold">
    <div className="group relative cursor-pointer">
      <a className="">Beranda</a>
      <div className="group-hover:w-full w-0 transition-all bg-white h-0.5 absolute"></div>
    </div>
    <div className="group relative cursor-pointer">
      <a className="flex items-center gap-2">Profil<FaChevronDown className="group-hover:rotate-180 transition-all"/></a>
      <div className="group-hover:w-full w-0 transition-all bg-white h-0.5 absolute"></div>
    </div>
    <div className="group relative cursor-pointer">
      <a className="flex items-center gap-2">Berita<FaChevronDown className="group-hover:rotate-180 transition-all"/></a>
      <div className="group-hover:w-full w-0 transition-all bg-white h-0.5 absolute"></div>
    </div>
    <div className="group relative cursor-pointer">
      <a className="flex items-center gap-2">Bidang Keahlian<FaChevronDown className="group-hover:rotate-180 transition-all"/></a>
      <div className="group-hover:w-full w-0 transition-all bg-white h-0.5 absolute"></div>
    </div>
    <div className="group relative cursor-pointer">
      <a className="flex items-center gap-2">Staff<FaChevronDown className="group-hover:rotate-180 transition-all"/></a>
      <div className="group-hover:w-full w-0 transition-all bg-white h-0.5 absolute"></div>
    </div>
    <div className="group relative cursor-pointer">
      <a className="flex items-center gap-2">Informasi<FaChevronDown className="group-hover:rotate-180 transition-all"/></a>
      <div className="group-hover:w-full w-0 transition-all bg-white h-0.5 absolute"></div>
    </div>
  </ul>
</div>      
    </div>
  )
}

export default Navbar