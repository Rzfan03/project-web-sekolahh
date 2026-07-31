import { FaChevronDown } from "react-icons/fa";

interface NavbarItem {
  title: string;
  isDropDown: boolean;
}

const MegaMenu = ({ title }: { title: string }) => (
  <div className="group relative cursor-pointer">
    <a className="flex items-center gap-2">
      {title}
      <FaChevronDown className="group-hover:rotate-180 transition-all" />
    </a>
    <div className="group-hover:w-full w-0 transition-all bg-orange-400 h-0.5 absolute" />
  </div>
);

const Navbar = () => {
  const NavbarData: NavbarItem[] = [
    { title: "Beranda", isDropDown: false },
    { title: "Profil", isDropDown: false },
    { title: "Berita", isDropDown: false },
    { title: "Bidang Keahlian", isDropDown: true },
    { title: "Staff", isDropDown: true },
    { title: "Informasi", isDropDown: true },
  ];

  return (
    <div className="sticky top-0 z-80 w-full bg-white border-b border-zinc-300 h-fit p-5">
      <div className="flex justify-around items-center">
        <img
          className="h-24 w-25"
          src="https://smkn1sumbawa.sch.id/wp-content/uploads/2022/08/Logo-SMKN-1.png"
        />
        <ul className="flex items-center text-lg gap-7 text-orange-400 font-semibold">
          {NavbarData.map((data, i) => (
            <li key={i}>
              {data.isDropDown ? (
                <MegaMenu title={data.title} />
              ) : (
                <div className="group relative cursor-pointer">
                  <a>{data.title}</a>
                  <div className="group-hover:w-full w-0 transition-all bg-orange-400 h-0.5 absolute" />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
