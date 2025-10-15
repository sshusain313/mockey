import Image from "next/image";
import Header from "./components/Header";
import Grid from "./components/Grid";
import Appearl from "./components/Appearl";
import UpcomingTools from "./components/UpcomingTools";
import Cards from "./components/Cards";
import Video from "./components/Video";
import Free from "./components/Free";
import Faqs from "./components/Faqs";
import Last from "./components/Last";
// import { MockupLayout } from "./components/mockey/MockupLayout";
export default function Home() {
  return (
    <div>
      <Header />
      <div className="mt-20"> 
        <Grid />
      </div>
      <Appearl />
      <UpcomingTools />
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Our Services</h2>
        <div className="w-full max-w-4xl mx-auto">
          <Cards />
        </div>
      </div>
      <Video />
      <Free />
      <Faqs />
      <Last />
    </div>
  );
}
