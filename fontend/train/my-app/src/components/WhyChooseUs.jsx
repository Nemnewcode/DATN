import React from "react";
// Đã thay FiLeaf bằng FiAward
import { FiCheckCircle, FiCoffee, FiAward, FiShield } from "react-icons/fi";

const WhyChooseUs = () => {
  return (
    <section
      className="relative py-24 bg-fixed bg-center bg-cover"
      style={{
        backgroundImage:
          "url('https://cafe5.maugiaodien.com/wp-content/uploads/2021/06/bg_why.jpg')",
      }}
    >
      {/* Overlay để làm text dễ đọc hơn */}
      <div className="absolute inset-0 bg-[#FFF8F2]/90 backdrop-blur-[2px]"></div>

      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* CỘT BÊN TRÁI: NỘI DUNG */}
        <div className="animate-in slide-in-from-left duration-700 text-left">
          <span className="text-[#a06b49] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
            Giá trị cốt lõi
          </span>
          <h2 className="text-4xl font-black text-[#4A2C2A] italic uppercase tracking-tighter mb-6 leading-none">
            Tại sao chọn <span className="text-[#a06b49]">Tea House</span>
          </h2>
          
          <p className="text-gray-600 mb-12 font-medium leading-relaxed italic border-l-4 border-[#a06b49] pl-6">
            Với những nghệ nhân rang tâm huyết và đội ngũ tài năng cùng những
            câu chuyện trà đầy cảm hứng, ngôi nhà Tea House là không gian dành
            riêng cho những ai trót yêu say đắm hương vị của những lá trà tuyệt hảo.
          </p>

          <div className="grid gap-8">
            {/* Mục 1 */}
            <div className="group flex items-start space-x-6 p-6 rounded-[2rem] bg-white/50 hover:bg-white transition-all duration-500 shadow-sm hover:shadow-xl border border-transparent hover:border-orange-100 text-left">
              <div className="w-16 h-16 flex-shrink-0 bg-[#4A2C2A] rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-[#4A2C2A]/20">
                <img
                  src="https://cafe5.maugiaodien.com/wp-content/uploads/2021/06/icon_why_1.png"
                  alt="Giá cả"
                  className="w-10 h-10 brightness-200"
                />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#4A2C2A] uppercase tracking-tight mb-1">Giá cả phải chăng</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  Cam kết cung cấp trà chất lượng cao với mức giá tối ưu nhất cho người yêu trà.
                </p>
              </div>
            </div>

            {/* Mục 2 */}
            <div className="group flex items-start space-x-6 p-6 rounded-[2rem] bg-white/50 hover:bg-white transition-all duration-500 shadow-sm hover:shadow-xl border border-transparent hover:border-orange-100 text-left">
              <div className="w-16 h-16 flex-shrink-0 bg-[#a06b49] rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-[#a06b49]/20">
                <img
                  src="https://cafe5.maugiaodien.com/wp-content/uploads/2021/06/icon_why_2.png"
                  alt="Hương vị"
                  className="w-10 h-10 brightness-200"
                />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#4A2C2A] uppercase tracking-tight mb-1">Hương vị tuyệt hảo</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  Lựa chọn cẩn thận những búp trà non thấm đẫm sương sớm tại vùng cao nguyên.
                </p>
              </div>
            </div>

            {/* Mục 3 */}
            <div className="group flex items-start space-x-6 p-6 rounded-[2rem] bg-white/50 hover:bg-white transition-all duration-500 shadow-sm hover:shadow-xl border border-transparent hover:border-orange-100 text-left">
              <div className="w-16 h-16 flex-shrink-0 bg-[#4A2C2A] rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-[#4A2C2A]/20">
                <img
                  src="https://cafe5.maugiaodien.com/wp-content/uploads/2021/06/icon_why_3.png"
                  alt="Tự nhiên"
                  className="w-10 h-10 brightness-200"
                />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#4A2C2A] uppercase tracking-tight mb-1">Sản phẩm tự nhiên</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  100% lá trà hữu cơ, không chất bảo quản, giữ trọn tinh túy từ thiên nhiên.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT BÊN PHẢI: HÌNH ẢNH TRANG TRÍ */}
        <div className="hidden lg:flex justify-center items-center relative h-full">
           <div className="relative w-full h-[600px] rounded-[3rem] overflow-hidden shadow-2xl rotate-3 border-8 border-white group">
              <img 
                src="https://i.ibb.co/F4CwPR1C/poster-cafe-2.jpg" 
                alt="Tea making" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-[#4A2C2A]/20"></div>
              {/* Badge nổi - Đã đổi sang FiAward */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md p-8 rounded-[2rem] shadow-2xl text-center min-w-[200px] border border-orange-50">
                  <FiAward className="mx-auto text-4xl text-[#a06b49] mb-2" />
                  <p className="text-[#4A2C2A] font-black text-xl italic uppercase tracking-tighter leading-none">Organic</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Certified Tea</p>
              </div>
           </div>
           {/* Decor circles */}
           <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#FFDBB6] rounded-full -z-10 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;