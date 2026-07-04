import React from "react";
import { Link } from "react-router-dom";
import { FaTwitter, FaFacebookF, FaLinkedinIn, FaGithub } from "react-icons/fa";

const blogIconSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-10 w-10 text-sky-400"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const socialIcons = [
  { name: "Twitter", url: "https://twitter.com", icon: <FaTwitter className="text-xl" /> },
  { name: "Facebook", url: "https://facebook.com", icon: <FaFacebookF className="text-xl" /> },
  { name: "LinkedIn", url: "https://linkedin.com", icon: <FaLinkedinIn className="text-xl" /> },
  { name: "GitHub", url: "https://github.com", icon: <FaGithub className="text-xl" /> },
];

const footer_data = [
  {
    title: "Discover",
    links: [
      { name: "All Posts", url: "/posts" },
      { name: "Popular", url: "/popular" },
      { name: "Authors", url: "/authors" },
      { name: "Categories", url: "/categories" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", url: "/about" },
      { name: "Our Mission", url: "/mission" },
      { name: "Contact", url: "/contact" },
      { name: "Careers", url: "/careers" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Help Center", url: "/help" },
      { name: "Start Writing", url: "/create-post" },
      { name: "Community", url: "/community" },
      { name: "Style Guide", url: "/style-guide" },
    ],
  },
];

const Footer = () => {
return (
    <footer className="bg-gray-950 text-gray-300 relative z-10 font-sans">
      <div className="bg-gray-900/50 p-6 sm:p-10 md:px-20 lg:px-28 shadow-inner border-t-2 border-gray-800">
        <div className="flex flex-col lg:flex-row justify-between gap-12 pb-10">
          {/* Brand Section and Social Icons */}
          <div className="w-full lg:max-w-md">
            <div className="flex items-center gap-3 mb-4">
              {blogIconSvg}
              <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">
                BlogPulse
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-lg mb-6">
              BlogPulse is your platform for sharing stories, insights, and
              ideas. We provide a clean, simple, and powerful space for writers
              and readers to connect.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4">
              {socialIcons.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 transition-colors duration-300"
                  aria-label={`Follow us on ${social.name}`}
                >
                  {social.icon}
                </a>
              ))}
          </div>
          </div>

          {/* Links Section using a responsive grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 w-full lg:w-auto">
            {footer_data.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-lg text-white mb-4 border-b-2 border-blue-500/50 pb-2 inline-block">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <Link
                        to={link.url}
                        className="text-gray-400 text-sm hover:text-white transition-colors hover:underline"
                      >
                        {link.name}
                      </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          </div>
        </div>

        {/* Bottom Section with Copyright and Policies */}
        <div className="pt-8 border-t-2 border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} BlogPulse | All Rights Reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link
              to="/privacy"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/cookies"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;