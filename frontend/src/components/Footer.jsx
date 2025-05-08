import React from "react";
import { BsFacebook, BsGithub, BsInstagram, BsDiscord } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export function Footer() {
  const location = useLocation();
  return (
    !location.pathname.startsWith("/chat") &&
    location.pathname !== "/generi" &&
    location.pathname !== "/artisti" &&
    location.pathname !== "/brani" && (
      <footer className="footer relative">
        <div className="w-full">
          <div className="grid gap-8 sm:flex sm:justify-between md:grid-cols-1">
            <Link to={"/"}>
              <img
                src="src/assets/SoundBond/SoundBondViola.png"
                alt=""
                className="w-1/3 sm:w-1/2"
              />
            </Link>

            {/* Footer Links */}
            <div className="grid grid-cols-3 gap-6 sm:mt-4">
              {/* About */}
              <div className="footerText">
                <h5 className="text-base lg:text-lg font-semibold mb-2">
                  About
                </h5>
                <ul>
                  <li>
                    <Link to={"/"} className="text-sm lg:text-base">
                      SoundBond
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="text-sm lg:text-base">
                      Musica
                    </a>
                  </li>
                </ul>
              </div>

              {/* Follow Us */}
              <div>
                <h5 className="text-base lg:text-lg font-semibold mb-2">
                  Follow Us
                </h5>
                <ul>
                  <li>
                    <a
                      href="https://github.com/camillazicari"
                      className="text-sm lg:text-base"
                    >
                      Github
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm lg:text-base">
                      Discord
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h5 className="text-base lg:text-lg font-semibold mb-2">
                  Legal
                </h5>
                <ul>
                  <li>
                    <a href="#" className="text-sm lg:text-base">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm lg:text-base">
                      Terms &amp; Conditions
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-[#5d1093] mt-8 pt-4">
            <div className="w-full sm:flex sm:items-center sm:justify-between">
              <p className="text-center sm:text-left text-sm flex items-center">
                &copy; {new Date().getFullYear()} &nbsp;
                <img
                  src="/src/assets/SoundBond/SoundBondTesto.png"
                  className="w-1/4"
                  alt=""
                />
                ™. &nbsp;All Rights Reserved.
              </p>

              <div className="mt-2 flex space-x-6 sm:mt-0 sm:justify-center mb-2 sm:mb-0">
                <a href="#">
                  <BsFacebook size={24} />
                </a>
                <a href="https://www.instagram.com/camiuzinwonderland/">
                  <BsInstagram size={24} />
                </a>
                <a href="#">
                  <BsDiscord size={24} />
                </a>
                <a href="https://github.com/camillazicari">
                  <BsGithub size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  );
}
