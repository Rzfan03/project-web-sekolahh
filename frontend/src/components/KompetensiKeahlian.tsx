import {
    FaHotel,
    FaUtensils,
    FaMapMarkedAlt,
    FaCut,
    FaTshirt,
    FaCode,
    FaNetworkWired,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import { PLACEHOLDER_IMAGE } from "../lib/placeholder";

type Kompetensi = {
    icon: React.ElementType;
    title: string;
    description: string;
};

const kompetensiList: Kompetensi[] = [
    {
        icon: FaHotel,
        title: "Perhotelan",
        description:
            "Program keahlian yang mempelajari ilmu perhotelan, mulai dari perencanaan, produksi, hingga pengelolaan jasa penginapan (akomodasi) serta food and beverage.",
    },
    {
        icon: FaUtensils,
        title: "Kuliner",
        description:
            "Siswa dibekali keterampilan pengolahan dan penyajian makanan, manajemen dapur, hingga praktik langsung di unit produksi kuliner sekolah.",
    },
    {
        icon: FaMapMarkedAlt,
        title: "Usaha Layanan Wisata",
        description:
            "Membekali siswa dengan kemampuan pemesanan dan tarif perjalanan, perencanaan tur, pemanduan wisata, hingga pengelolaan acara (MICE) di industri pariwisata.",
    },
    {
        icon: FaCut,
        title: "Tata Kecantikan Kulit & Rambut",
        description:
            "Membekali siswa pengetahuan, keterampilan, dan sikap agar kompeten di bidang kecantikan kulit dan rambut, termasuk praktik langsung di salon unit produksi sekolah.",
    },
    {
        icon: FaTshirt,
        title: "Desain Produksi Busana",
        description:
            "Siswa mempelajari desain, pola, dan teknik menjahit, mulai dari rancangan busana hingga proses produksi pakaian siap pakai.",
    },
    {
        icon: FaCode,
        title: "Rekayasa Perangkat Lunak",
        description:
            "Program keahlian yang membekali siswa dasar pemrograman dan pengembangan aplikasi untuk menyiapkan lulusan yang siap kerja di bidang perangkat lunak.",
    },
    {
        icon: FaNetworkWired,
        title: "Teknik Komputer & Jaringan",
        description:
            "Siswa dilatih instalasi, administrasi, dan troubleshooting jaringan komputer, mulai dari jaringan dasar hingga teknologi jaringan berbasis luas (WAN).",
    },
];

const KompetensiKeahlian = () => {
    return (
        <section id="kompetensi" className="bg-white py-16 px-6 scroll-mt-24">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-orange-500">
                        Kompetensi Keahlian
                    </h2>
                    <div className="w-12 h-1 bg-orange-600 mx-auto mt-4" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {kompetensiList.map(({ icon: Icon, title, description }, index) => (
                        <Reveal key={title} delay={index * 60}>
                            <Link
                                to="/jurusan"
                                className="group flex h-full flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <img
                                        src={PLACEHOLDER_IMAGE}
                                        alt={title}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-orange-500/90 via-orange-400/30 to-transparent" />
                                    <div className="absolute bottom-0 left-0 flex items-center gap-3 p-5">
                                        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white text-orange-500 shadow-md">
                                            <Icon className="h-5 w-5" />
                                        </span>
                                        <h3 className="text-lg font-bold leading-snug text-white drop-shadow">{title}</h3>
                                    </div>
                                </div>
                                <p className="p-5 text-sm leading-relaxed text-slate-600">{description}</p>
                            </Link>
                        </Reveal>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link to="/jurusan" className="inline-block rounded-md bg-orange-400 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-500">
                        Lihat Semua Bidang Keahlian
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default KompetensiKeahlian;
