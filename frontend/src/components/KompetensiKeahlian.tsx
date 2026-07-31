import {
    FaHotel,
    FaUtensils,
    FaMapMarkedAlt,
    FaCut,
    FaTshirt,
    FaCode,
    FaNetworkWired,
} from "react-icons/fa";

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
        <section className="bg-white py-16 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-orange-500">
                        Kompetensi Keahlian
                    </h2>
                    <div className="w-12 h-1 bg-orange-600 mx-auto mt-4" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {kompetensiList.map(({ icon: Icon, title, description }) => (
                        <div key={title} className="flex gap-4 hover:scale-105 transition-all cursor-pointer">
                            <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-orange-500 mb-2">{title}</h3>
                                <p className="text-slate-500 text-sm">{description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default KompetensiKeahlian;