import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FiInstagram } from "react-icons/fi";

const images = [
    "https://plus.unsplash.com/premium_photo-1667737996588-94a516f63244?fm=jpg&q=60&w=1000",
    "https://images.unsplash.com/photo-1558857563-b371033873b8?fm=jpg&q=60&w=1000",
    "https://images.unsplash.com/photo-1601390395693-364c0e22031a?fm=jpg&q=60&w=1000",
    "https://plus.unsplash.com/premium_photo-1671379526961-1aebb82b317b?fm=jpg&q=60&w=1000",
    "https://plus.unsplash.com/premium_photo-1694540110881-84add98c0a75?fm=jpg&q=60&w=1000",
    "https://plus.unsplash.com/premium_photo-1694540110936-c4ba0029c4d8?fm=jpg&q=60&w=1000",
    "https://plus.unsplash.com/premium_photo-1674406481284-43eba097a291?fm=jpg&q=60&w=1000",
    "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?fm=jpg&q=60&w=1000",
    "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?fm=jpg&q=60&w=1000",
    "https://images.unsplash.com/photo-1525803377221-4f6ccdaa5133?fm=jpg&q=60&w=1000",
];

const BrandSlider = () => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    speed: 4000, // Tốc độ trôi
    autoplaySpeed: 0,
    cssEase: "linear", // Tạo hiệu ứng trôi liên tục không dừng
    arrows: false,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 5 } },
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <section className="bg-[#FAF7F2] py-20 overflow-hidden">
      {/* Tiêu đề phụ */}
      <div className="text-center mb-12 px-6">
        <h2 className="text-3xl font-black text-[#4A2C2A] tracking-tighter uppercase italic italic">
          #Tea<span className="text-[#a06b49]">House</span>Moments
        </h2>
        <p className="text-gray-400 text-sm font-medium mt-2 flex items-center justify-center gap-2">
           <FiInstagram className="text-[#a06b49]" /> Chia sẻ khoảnh khắc cùng chúng tôi trên Instagram
        </p>
      </div>

      <div className="w-full">
        <Slider {...settings} className="brand-slider">
          {images.map((src, index) => (
            <div key={index} className="px-2 outline-none">
              <div className="relative group cursor-pointer overflow-hidden rounded-[2rem] aspect-square shadow-sm border border-orange-50 bg-white">
                {/* Image */}
                <img
                  src={src}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay khi hover */}
                <div className="absolute inset-0 bg-[#4A2C2A]/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white scale-50 group-hover:scale-100 transition-transform duration-500 border border-white/30">
                    <FiInstagram size={24} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default BrandSlider;