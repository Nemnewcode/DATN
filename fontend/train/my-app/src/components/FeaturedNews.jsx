import React, { useEffect, useState } from "react";
import { getFeaturedNews } from "../services/featuredNewService";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCalendar } from "react-icons/fi";

const FeaturedNews = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      const res = await getFeaturedNews();
      setNews(res);
    };
    fetchNews();
  }, []);

  return (
    <section className="bg-[#FFF8F2] py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* SECTION HEADER */}
        <div className="text-center mb-16 relative">
          <span className="text-[#a06b49] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
            Góc chia sẻ
          </span>
          <h2 className="text-4xl font-black text-[#4A2C2A] italic uppercase tracking-tighter leading-none">
            Tin tức <span className="text-[#a06b49]">nổi bật</span>
          </h2>
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 bg-orange-200"></span>
            <span className="text-[#4A2C2A] text-lg">🍃</span>
            <span className="h-[1px] w-12 bg-orange-200"></span>
          </div>
        </div>

        {/* NEWS GRID */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <Link
              to={`/tin-tuc/${item.slug}`}
              key={item.id}
              className="group block bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-orange-50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              {/* IMAGE CONTAINER */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay & Date Badge */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#4A2C2A]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm">
                   <div className="flex flex-col items-center leading-none">
                      <span className="text-[10px] font-black uppercase text-[#a06b49] tracking-widest">Tin mới</span>
                   </div>
                </div>
              </div>

              {/* CONTENT INFO */}
              <div className="p-8">
                <div className="flex items-center gap-2 mb-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                  <FiCalendar className="text-[#a06b49]" />
                  <span>Cập nhật mới nhất</span>
                </div>
                
                <h3 className="text-xl font-black text-[#4A2C2A] mb-3 group-hover:text-[#a06b49] transition-colors line-clamp-2 leading-tight uppercase italic tracking-tight">
                  {item.title}
                </h3>

                <div className="w-10 h-[2px] bg-orange-100 mb-4 transition-all duration-500 group-hover:w-full"></div>

                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6 font-medium">
                  {item.short_description}
                </p>

                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#4A2C2A] group-hover:gap-4 transition-all">
                  Đọc tiếp <FiArrowRight className="text-[#a06b49]" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* VIEW ALL BUTTON */}
        <div className="mt-16 text-center">
            <Link 
                to="/tin-tuc" 
                className="inline-flex items-center gap-3 bg-[#4A2C2A] text-[#FFDBB6] px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-[#4A2C2A]/20 hover:scale-105 active:scale-95 transition-all"
            >
                Xem tất cả bài viết <FiArrowRight strokeWidth={3} />
            </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedNews;