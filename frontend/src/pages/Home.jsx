import AboutUs from "../components/AboutUs";
import NewsSection from "../components/NewsSection";
import Footer from "../components/Footer";
import ImageBanner from "../components/ImageBanner";
import HeroSlider from "../components/HeroSlider";
import FeaturedPlayersList from "../components/FeaturedPlayersList";

const Home = () => {



  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroSlider />
        <FeaturedPlayersList/>
        <NewsSection />
      </main>
    </div>
  );
};

export default Home;
