import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  FaChevronDown,
  FaBars,
  FaTimes,
  FaPhoneAlt,
  FaEnvelope,
  FaUserGraduate,
} from "react-icons/fa";
import { SCHOOL_LOGO } from "../lib/logo";
import { getProfil } from "../lib/supabase";
import { cn } from "../lib/utils";
import ThemeToggle from "./ThemeToggle";

interface NavbarItem {
  title: string;
  to?: string;
  isDropDown?: boolean;
  items?: { label: string; to: string }[];
}

const NavbarData: NavbarItem[] = [
  { title: "Beranda", to: "/" },
  { title: "Profil", to: "/profil" },
  { title: "Berita", to: "/berita" },
  { title: "Bidang Keahlian", to: "/jurusan" },
  { title: "Guru & Staf", to: "/guru" },
  {
    title: "Informasi",
    isDropDown: true,
    items: [
      { label: "Pengumuman", to: "/pengumuman" },
      { label: "Agenda", to: "/agenda" },
      { label: "Galeri", to: "/galeri" },
      { label: "PPDB", to: "/ppdb" },
      { label: "Jadwal", to: "/jadwal" },
    ],
  },
  { title: "Foto & Video", to: "/galeri" },
];

const itemRoutes = (item: NavbarItem): string[] =>
  item.to ? [item.to] : (item.items?.map((i) => i.to) ?? []);

const isItemActive = (item: NavbarItem, pathname: string): boolean =>
  itemRoutes(item).some((r) => (r === "/" ? pathname === "/" : pathname.startsWith(r)));

const Dropdown = ({ item, active }: { item: NavbarItem; active: boolean }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 px-5 py-4 text-[15px] transition-colors",
          active ? "bg-white/20 font-semibold text-white" : "text-white hover:bg-white/10"
        )}
        aria-expanded={open}
      >
        {item.title}
        <FaChevronDown
          className={cn("size-3 transition-transform duration-300", open && "rotate-180")}
        />
      </button>

      <div
        className={cn(
          "invisible absolute left-0 top-full z-50 transition-all duration-200 ease-out",
          open ? "visible translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        )}
      >
        <div className="min-w-52 rounded-b-lg border-t-4 border-white/40 bg-orange-500 py-2 shadow-lg">
          {item.items?.map((child) => (
            <Link
              key={child.label}
              to={child.to}
              className="block px-5 py-2.5 text-sm text-white transition-colors hover:bg-white/10"
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [namaSekolah, setNamaSekolah] = useState("SMKN 1 Sumbawa Besar");
  const [telepon, setTelepon] = useState("(0371) 26100");
  const [email, setEmail] = useState("info@smkn1sumbawa.sch.id");
  const { pathname } = useLocation();

  useEffect(() => {
    getProfil().then((rows) => {
      if (rows && rows.length > 0) {
        const p = rows[0] as { nama_sekolah?: string; telepon?: string; email?: string };
        if (p.nama_sekolah) setNamaSekolah(p.nama_sekolah);
        if (p.telepon) setTelepon(p.telepon);
        if (p.email) setEmail(p.email);
      }
    });
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <div className="border-b border-stone-100 bg-white dark:border-stone-700 dark:bg-stone-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="Beranda">
            <span className="flex size-11 flex-none items-center justify-center rounded-full bg-white ring-1 ring-orange-100">
              <img
                className="size-full object-contain p-1"
                src={SCHOOL_LOGO}
                alt="Logo Sekolah"
              />
            </span>
            <span className="min-w-0">
              <span className="font-display block truncate text-lg font-extrabold leading-tight text-stone-900 dark:text-stone-100">
                {namaSekolah}
              </span>
              <span className="hidden text-[11px] font-medium uppercase tracking-wider text-stone-400 sm:block dark:text-stone-400">
                Sekolah Menengah Kejuruan Negeri
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            <a href={`tel:${telepon.replace(/[^0-9+]/g, "")}`} className="group flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-400 text-white transition-colors group-hover:bg-orange-600">
                <FaPhoneAlt className="size-3.5" />
              </span>
              <span className="leading-tight">
                <span className="block text-[11px] text-stone-400 dark:text-stone-300">Telepon</span>
                <b className="text-sm font-semibold text-stone-700 dark:text-stone-100">{telepon}</b>
              </span>
            </a>
            <a href={`mailto:${email}`} className="group flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-400 text-white transition-colors group-hover:bg-orange-600">
                <FaEnvelope className="size-3.5" />
              </span>
              <span className="leading-tight">
                <span className="block text-[11px] text-stone-400 dark:text-stone-300">Alamat Email</span>
                <b className="max-w-[220px] truncate text-sm font-semibold text-stone-700 dark:text-stone-100">{email}</b>
              </span>
            </a>
            <Link
              to="/ppdb"
              className="inline-flex flex-none items-center gap-1.5 rounded-lg bg-orange-400 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-500"
            >
              <FaUserGraduate className="size-4" />
              PPDB 2026
            </Link>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/ppdb"
              className="inline-flex items-center rounded-lg bg-orange-400 px-3 py-2 text-xs font-semibold text-white"
            >
              PPDB
            </Link>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex size-10 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={menuOpen}
            >
              <FaBars className={cn("size-4 transition-all", menuOpen && "rotate-90 scale-0")} />
              <FaTimes className={cn("absolute size-4 -rotate-90 scale-0 transition-all", menuOpen && "rotate-0 scale-100")} />
            </button>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-80 w-full">
        <nav className="hidden bg-orange-400 text-white lg:block" aria-label="Navigasi utama">
        <ul className="mx-auto flex max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
          {NavbarData.map((data, i) => (
            <li key={i}>
              {data.isDropDown ? (
                <Dropdown item={data} active={isItemActive(data, pathname)} />
              ) : (
                <NavLink
                  to={data.to ?? "/"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 px-5 py-4 text-[15px] transition-colors",
                      isActive ? "bg-white/20 font-semibold text-white" : "text-white hover:bg-white/10"
                    )
                  }
                >
                  {data.title}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div
        className={cn(
          "fixed inset-0 z-[90] lg:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!menuOpen}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={cn(
            "absolute inset-0 bg-stone-950/60 transition-opacity duration-500",
            menuOpen ? "opacity-100" : "opacity-0"
          )}
        />
        <aside
          className={cn(
            "absolute right-0 top-0 flex h-full w-full flex-col bg-orange-400 text-white shadow-2xl transition-transform duration-500 ease-out",
            menuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-white/15 px-4 py-4">
            <span className="font-display text-lg font-extrabold">Menu</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex size-10 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Tutup menu"
            >
              <FaTimes className="size-4" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4" aria-label="Navigasi mobile">
          {NavbarData.map((data, i) =>
            data.isDropDown ? (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpenDropdown((o) => (o === data.title ? null : data.title))}
                  className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-[15px] font-medium text-white hover:bg-white/10"
                  aria-expanded={openDropdown === data.title}
                >
                  <span className="flex items-center gap-2.5">
                    {data.title}
                  </span>
                  <FaChevronDown
                    className={cn(
                      "size-4 transition-transform duration-300",
                      openDropdown === data.title && "rotate-180"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    openDropdown === data.title ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="min-h-0">
                    <div className="space-y-0.5 pb-1 pl-8 pr-2">
                      {data.items?.map((child) => (
                        <NavLink
                          key={child.label}
                          to={child.to}
                          className={({ isActive }) =>
                            cn(
                              "block rounded-lg px-4 py-2.5 text-sm transition-colors",
                              isActive ? "bg-white/20 font-medium text-white" : "text-white/90 hover:bg-white/10"
                            )
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <NavLink
                key={i}
                to={data.to ?? "/"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2.5 rounded-lg px-4 py-3 text-[15px] font-medium transition-colors",
                    isActive ? "bg-white/20 text-white" : "text-white hover:bg-white/10"
                  )
                }
              >
                {data.title}
              </NavLink>
            )
          )}
        </nav>
        </aside>
      </div>
      </header>
    </>
  );
};

export default Navbar;
