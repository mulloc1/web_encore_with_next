import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SurveyButton from "@/components/survey-button";
import HeroSection from "@/components/hero-section";
import Board from "@/components/board";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <Board />

      <Footer />
      <SurveyButton />
    </div>
  );
}
