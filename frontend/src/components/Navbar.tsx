import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { SCHOOL_LOGO } from "../lib/logo";

interface NavbarItem {
  title: string;
  isDropDown: boolean;
  items?: { label: string; to: string; desc?: string }[];
}

const NavbarData: NavbarItem[] = [
  { title: "Beranda", isDropDown: false },
  { title: "Profil", isDropDown: false },
  { title: "Berita", isDropDown: false },
  { title: "Bidang Keahlian", isDropDown: false },
  {
    title: "Staff",
    isDropDown: true,
    items: [
      { label: "Guru", to: "/guru", desc: "Daftar guru & tenaga pendidik" },
    ],
  },
  {
    title: "Informasi",
    isDropDown: true,
    items: [
      { label: "Berita", to: "/berita", desc: "Kabar & kegiatan sekolah" },
      { label: "Pengumuman", to: "/pengumuman", desc: "Informasi resmi sekolah" },
      { label: "Galeri", to: "/galeri", desc: "Dokumentasi kegiatan" },
      { label: "PPDB", to: "/ppdb", desc: "Penerimaan peserta didik baru" },
      { label: "Jadwal", to: "/jadwal", desc: "Jadwal pelajaran" },
    ],
  },
];

const navRoutes: Record<string, string> = {
  Beranda: "/",
  Profil: "/profil",
  Berita: "/berita",
  "Bidang Keahlian": "/jurusan",
};

const Dropdown = ({ item }: { item: NavbarItem }) => {
  return (
    <div className="group relative" aria-haspopup="true">
      <a className="flex cursor-pointer items-center gap-2">
        {item.title}
        <FaChevronDown className="transition-all group-hover:rotate-180" />
      </a>
      <div className="group-hover:w-full w-0 transition-all bg-orange-400 h-0.5 absolute" />

      <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <div className="relative mt-1 border border-gray-100 bg-white shadow-xl shadow-slate-900/10">
          <span className="absolute -top-1 left-1/2 size-2.5 -translate-x-1/2 rotate-45 border-l border-t border-gray-100 bg-white" />
          <div className="flex w-56 flex-col py-1">
            {item.items?.map((child) => (
              <Link key={child.label} to={child.to} className="px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-600">
                {child.label}
                {child.desc && <span className="block text-xs text-gray-400">{child.desc}</span>}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  return (
    <div className="sticky top-0 z-80 w-full bg-white border-b border-zinc-300 h-fit p-5">
      <div className="flex justify-around items-center">
        <img className="h-24 w-24 object-contain" src={SCHOOL_LOGO} alt="Logo Sekolah" />
        <ul className="flex items-center text-lg gap-7 text-orange-400 font-semibold">
          {NavbarData.map((data, i) => (
            <li key={i}>
              {data.isDropDown ? (
                <Dropdown item={data} />
              ) : (
                <div className="group relative cursor-pointer">
                  <Link to={navRoutes[data.title] ?? "/"}>{data.title}</Link>
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
