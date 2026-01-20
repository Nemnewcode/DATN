import React from "react";
import CategorySlider from "../components/CategorySlider";
import HeroSlider from "../components/HeroSlider";
import WhyChooseUs from "../components/WhyChooseUs";
import MenuToday from "../components/MenuToday";
import FeaturedNews from "../components/FeaturedNews";
import BrandSlider from "../components/BrandSlider";
import OpenTime from "../components/openTime";
export default function Home() {
  return (
    <main>
        <HeroSlider />
        <CategorySlider />
        <WhyChooseUs />
         <MenuToday />
        <OpenTime />
        <FeaturedNews />
        <BrandSlider />
    </main>
  );
}
