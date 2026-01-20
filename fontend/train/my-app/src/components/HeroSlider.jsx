import React from "react";
import Slider from "react-slick";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const slides = [
  {
    url: "https://i.ibb.co/MysNQ8kg/images.jpg",
    sub: "Brewing Love Every Morning",
    title: "Cà phê đậm vị <br/> Khởi đầu tươi mới",
    desc: "Khám phá hương vị cà phê nguyên bản được rang xay thủ công từ những nghệ nhân tâm huyết nhất.",
    btn: "Thực đơn cà phê",
    link: "/thuc-don"
  },
  {
    url: "https://i.ibb.co/xtHsKwpb/images-1.jpg",
    Sub: "The Perfect Pairing",
    title: "Bánh ngọt đẹp mắt <br/> Vị ngon đậm đà",
    desc: "Đánh thức vị giác bằng những chiếc bánh ngọt nướng mới mỗi ngày, kết hợp cùng hương cafe nồng nàn cho ngày dài thêm cảm hứng.",
    btn: "Đặt giao hàng ngay",
    link: "/thuc-don"
  },
  {
    url: "https://cdn.mathieuteisseire.com/media/yfzb33se/recipe-180-sencha-green-iced-tea.jpg?height=680&rnd=132996072243000000&width=1120",
    sub: "Natural Refreshment",
    title: "Nước ép trái cây <br/> 100% tự nhiên",
    desc: "Nguồn vitamin dồi dào từ trái cây tươi mỗi ngày giúp bạn tràn đầy năng lượng và sức sống.",
    btn: "Khám phá menu nước",
    link: "/thuc-don"
  }
];

export default function HeroSlider() {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1200,
    autoplaySpeed: 6000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    pauseOnHover: false,
    appendDots: dots => (
      <div style={{ bottom: "40px" }}>
        <ul className="flex justify-center gap-3"> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div className="w-8 h-[3px] bg-white/30 rounded-full transition-all hover:bg-white/60 slick-active:bg-[#FFDBB6] slick-active:w-12"></div>
    )
  };

  return (
    <section className="relative group overflow-hidden bg-[#4A2C2A]">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="relative outline-none">
            {/* Slide Wrapper */}
            <div className="relative w-full h-[500px] md:h-[750px] overflow-hidden">
              {/* Image with Zoom Effect */}
              <img
                src={slide.url}
                alt={slide.sub}
                className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[10000ms] ease-out opacity-80"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#4A2C2A]/80 via-[#4A2C2A]/40 to-transparent"></div>

              {/* Content Container */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
                  <div className="max-w-2xl text-left">
                    {/* Subtitle */}
                    <span className="inline-block text-[#FFDBB6] font-black text-[10px] md:text-xs uppercase tracking-[0.5em] mb-4 animate-in slide-in-from-bottom duration-700">
                      {slide.sub}
                    </span>

                    {/* Title */}
                    <h1 
                      className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-[0.9] mb-6 animate-in slide-in-from-bottom duration-1000"
                      dangerouslySetInnerHTML={{ __html: slide.title }}
                    ></h1>

                    {/* Description */}
                    <p className="text-white/70 text-sm md:text-lg font-medium leading-relaxed mb-10 max-w-lg animate-in slide-in-from-bottom duration-1200">
                      {slide.desc}
                    </p>

                    {/* Button Group */}
                    <div className="flex flex-wrap gap-4 animate-in slide-in-from-bottom duration-[1400ms]">
                      <Link 
                        to={slide.link}
                        className="bg-[#FFDBB6] text-[#4A2C2A] px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                      >
                        {slide.btn} <FiArrowRight strokeWidth={3} />
                      </Link>
                      
                      <Link 
                        to="/dat-ban"
                        className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/20 transition-all"
                      >
                        Đặt bàn ngay
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Trang trí thêm góc dưới */}
      <div className="absolute bottom-0 right-0 w-1/3 h-32 bg-gradient-to-tl from-[#FFDBB6]/10 to-transparent pointer-events-none"></div>
    </section>
  );
}