import {
    FaHotel,
    FaUtensils,
    FaMapMarkedAlt,
    FaCut,
    FaTshirt,
    FaCode,
    FaNetworkWired,
    FaChevronRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";

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
        <section id="kompetensi" className="scroll-mt-24 bg-white px-6 py-24">
            <div className="mx-auto max-w-6xl">
                <Reveal>
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <h2 className="font-display text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
                                Program Keahlian
                            </h2>
                            <p className="mt-3 leading-relaxed text-stone-600">
                                Tujuh kompetensi keahlian yang dikembangkan sesuai kebutuhan dunia usaha
                                dan industri.
                            </p>
                        </div>
                        <Link
                            to="/jurusan"
                            className="inline-flex flex-none items-center gap-2 rounded-lg bg-orange-400 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-500"
                        >
                            Lihat Semua <FaChevronRight className="size-3.5" />
                        </Link>
                    </div>
                </Reveal>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {kompetensiList.map(({ icon: Icon, title, description }, index) => (
                        <Reveal key={title} delay={index * 60}>
                            <Link
                                to="/jurusan"
                                className="group flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                            >
                                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-400 text-white transition-colors group-hover:bg-orange-500">
                                    <Icon className="h-5 w-5" />
                                </span>
                                <h3 className="font-display mt-4 text-lg font-bold text-stone-900">{title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-stone-600">{description}</p>
                                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-orange-600">
                                    Selengkapnya
                                    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                                </span>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default KompetensiKeahlian;
