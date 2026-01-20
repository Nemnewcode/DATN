import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";

// ✅ IMPORT ẢNH
import traSua from "../assets/img/slidenuocep.jpg";
import traTraiCay from "../assets/img/tratraicay.jpg";
import daXay from "../assets/img/daxay.jpg";
import caPhe from "../assets/img/caphe.jpg";
import banhNgot from "../assets/img/banh-ngot.jpg";

const categories = [
  { name: "Nước ép", slug: "tra-sua", image: traSua },
  { name: "Trà trái cây", slug: "tra-trai-cay", image: traTraiCay },
  { name: "Đá xay", slug: "da-xay", image: daXay },
  { name: "Cà phê", slug: "ca-phe", image: caPhe },
  { name: "Bánh ngọt", slug: "banh-ngot", image: banhNgot },
];

// Custom Arrow Components
const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-[#4A2C2A] hover:bg-[#4A2C2A] hover:text-[#FFDBB6] transition-all duration-300 border border-orange-50"
  >
    <FiChevronRight size={24} />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-[#4A2C2A] hover:bg-[#4A2C2A] hover:text-[#FFDBB6] transition-all duration-300 border border-orange-50"
  >
    <FiChevronLeft size={24} />
  </button>
);

export default function CategorySlider() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="bg-[#FFF8F2] py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* SECTION HEADER */}
        <div className="text-center mb-16 relative">
          <span className="text-[#a06b49] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block animate-pulse">
            Trải nghiệm hương vị
          </span>
          <h2 className="text-4xl font-black text-[#4A2C2A] italic uppercase tracking-tighter leading-none">
            Danh mục <span className="text-[#a06b49]">sản phẩm</span>
          </h2>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="h-[2px] w-12 bg-[#a06b49]"></span>
            <span className="text-[#4A2C2A] text-xl">☕</span>
            <span className="h-[2px] w-12 bg-[#a06b49]"></span>
          </div>
        </div>

        {/* SLIDER */}
        <div className="relative">
          <Slider {...settings}>
            {categories.map((cat, index) => (
              <div key={index} className="px-4 py-6">
                <Link
                  to={`/danh-muc/${cat.slug}`}
                  className="block bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-orange-50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group"
                >
                  {/* Image Container */}
                  <div className="relative w-full aspect-[4/5] overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    
                    {/* Overlay khi hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#4A2C2A]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                       <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center scale-50 group-hover:scale-100 transition-transform duration-500">
                          <FiArrowRight className="text-white text-2xl" />
                       </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 text-center bg-white relative">
                    <h5 className="text-sm font-black uppercase text-[#4A2C2A] tracking-widest mb-1 group-hover:text-[#a06b49] transition-colors">
                      {cat.name}
                    </h5>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      Khám phá ngay <FiArrowRight />
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}