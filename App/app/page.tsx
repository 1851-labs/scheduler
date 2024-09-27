import Header from "@/components/ui/Header";
import Banner from "@/components/pages/home/Banner";
import Waitlist from "@/components/pages/home/Waitlist";
import ReactGA from "react-ga4";

const SplashPage = () => {
  ReactGA.send({ hitType: "pageview", page: "/", title: "SplashPage" });
  return (
    <div>
      <Banner />
      {/* <Waitlist /> */}
    </div>
  );
};

export default SplashPage;

