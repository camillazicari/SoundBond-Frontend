import React from "react";
import {
  BsDribbble,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitter,
} from "react-icons/bs";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="footer">
      <div className="w-full">
        <div className="grid gap-8 sm:flex sm:justify-between md:grid-cols-1">
          <div>
            <Link to={"/"} className="flex items-center">
              {/* <img
                src="https://flowbite.com/docs/images/logo.svg"
                alt="Flowbite Logo"
                className="mr-2 h-8"
              /> */}
              <span
                className="text-xl font-semibold SoundBond"
                style={{ color: "#D488E8" }}
              >
                SoundBond
              </span>
            </Link>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            {/* About */}
            <div className="footerText">
              <h5 className="text-lg font-semibold mb-2">About</h5>
              <ul>
                <li>
                  <Link to={"/"}>SoundBond</Link>
                </li>
                <li>
                  <a href="#">Musica</a>
                </li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h5 className="text-lg font-semibold mb-2">Follow Us</h5>
              <ul>
                <li>
                  <a href="#">Github</a>
                </li>
                <li>
                  <a href="#">Discord</a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h5 className="text-lg font-semibold mb-2">Legal</h5>
              <ul>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms &amp; Conditions</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="w-full sm:flex sm:items-center sm:justify-between">
            <p className="text-center sm:text-left text-sm">
              &copy; {new Date().getFullYear()}{" "}
              <span className="SoundBond">SoundBond</span>™. All Rights
              Reserved.
            </p>

            <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
              <a href="#">
                <BsFacebook size={24} />
              </a>
              <a href="#">
                <BsInstagram size={24} />
              </a>
              <a href="#">
                <BsTwitter size={24} />
              </a>
              <a href="#">
                <BsGithub size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
