import { FC, RefObject } from "react";
import { useNavigate } from "react-router-dom";

import { LandingRefsObject } from "../../../types/types";
import FooterLinks from "./FooterLinks";
import FooterSocials from "./FooterSocials";

type FooterProps = {
  landingRefs: LandingRefsObject;
};

const Footer: FC<FooterProps> = ({ landingRefs }) => {
  const navigate = useNavigate();

  const clickLinkHandler = (refName: RefObject<HTMLDivElement>) => {
    const element = refName?.current;
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="flex flex-col justify-start  text-white bg-purpleMain  shadow-sm mt-auto w-screen  relative ">
      <div className="  h-full flex flex-col justify-between ">
        <div className="flex justify-center [&>div]:mx-8 [&>div]:my-8  [&>div]:md:mx-20">
          <div
            className="mx-24 cursor-pointer"
            onClick={() => navigate("/home")}
          >
            <h4 className="font-solid text-xl mt-5">Room Reserver</h4>
          </div>

          <FooterLinks
            landingRefs={landingRefs}
            clickLinkHandler={clickLinkHandler}
          />
          <FooterSocials />
        </div>
        <hr />
        <div className="flex justify-between text-gray-400 text-xxs items-center [&>p]:mx-8">
          <p>&copy;{new Date().getFullYear()} Room Reserver®</p>
          <p className="text-rightx">Made with ❤️ in Střížkov</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
