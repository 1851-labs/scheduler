import Header from "@/components/ui/Header";
import Banner from "@/components/pages/home/Banner";
import DeviceSection from "@/components/pages/home/DeviceSection";
import ReactGA from "react-ga4";

const SplashPage = () => {
  ReactGA.send({ hitType: "pageview", page: "/", title: "SplashPage" });
  return (
    <div>
      <Banner />
      <DeviceSection />
    </div>
  );
};

export default SplashPage;

