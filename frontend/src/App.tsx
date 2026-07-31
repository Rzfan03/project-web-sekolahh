import { useState, useEffect } from "react";
import Navbar from "./components/Navbar"
import KompetensiKeahlian from "./components/KompetensiKeahlian"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { getArticle } from "./lib/supabase";
import type { Article } from "./types/articles";
import Marquee from 'react-fast-marquee'

const App = () => {
  const Image = [
    {
      id: 1,
      image: 'https://smkn1sumbawa.sch.id/wp-content/uploads/2022/09/111.jpg',
      title: 'Rekayasa Perangkat Lunak',
      alt: 'foto-rpl'
    },
    {
      id: 2,
      image: 'https://smkn1sumbawa.sch.id/wp-content/uploads/2022/09/1-e1664326112868.jpg',
      title: 'Perhotelan',
      alt: 'foto-ph'
    },
    {
      id: 3,
      image: 'https://smkn1sumbawa.sch.id/wp-content/uploads/2022/09/333.jpg',
      title: 'Busana',
      alt: 'foto-busana'
    }
  ]
  const [data, setData] = useState<Article[]>([])

  useEffect(() => {
    const getArticleData = async () => {
      const res = await getArticle()
      setData(res || [])
    }

    getArticleData()
  }, [])
    console.log(data)


  return (
    <main className="flex flex-col">
      <Navbar/>
      <div className="w-full  [&_.swiper-pagination-bullet]:w-3 
           [&_.swiper-pagination-bullet]:h-3 
           [&_.swiper-pagination-bullet]:bg-gray-400
           [&_.swiper-pagination-bullet-active]:w-6
           [&_.swiper-pagination-bullet-active]:bg-orange-500
           [&_.swiper-pagination-bullet-active]:rounded-full
           [&_.swiper-pagination-bullet-active]:transition-all">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: false }}
          navigation={false}
        >
          {Image.map((images) => (
            <SwiperSlide key={images.id}>
              <div className="absolute inset-0 flex justify-center items-center z-60 text-center">
                <p className="text-7xl text-white font-semibold">{images.title}</p>
              </div>
              <div className="absolute bg-slate-950/60 z-50 w-full h-full"></div>
              <img src={images.image} alt={images.alt} className="object-cover w-full h-170 relative" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
        <Marquee>
          <p className="text-lg text-white">PENDAFTARAN SMKKANSA 2026 SUDAH DI BUKA!</p>
        </Marquee>
      <KompetensiKeahlian/>
    </main>
  )
}

export default App