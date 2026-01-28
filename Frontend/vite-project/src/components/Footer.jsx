import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-10">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        
          <div className="text-left">
            <h2 className="text-lg font-bold text-green-600">FILO</h2>

            <p className="text-sm text-gray-600 mt-1 max-w-sm">
              A secure file sharing & cloud storage platform with password
              protection, expiry links and premium plans.
            </p>

          
            <div className="flex justify-start gap-4 mt-4 flex-wrap">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border hover:bg-gray-50 hover:text-green-600"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border hover:bg-gray-50 hover:text-green-600"
              >
                <FaLinkedin size={18} />
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border hover:bg-gray-50 hover:text-green-600"
              >
                <FaGithub size={18} />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border hover:bg-gray-50 hover:text-green-600"
              >
                <FaTwitter size={18} />
              </a>
            </div>
          </div>

         
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 text-sm text-left">
           
            <div>
              <p className="font-semibold text-gray-900 mb-2">Quick Links</p>
              <div className="flex flex-col gap-1 text-gray-600">
                <Link to="/" className="hover:text-green-600">
                  Home
                </Link>

                <Link to="/upload" className="hover:text-green-600">
                  Upload
                </Link>

                <Link to="/dashboard" className="hover:text-green-600">
                  Dashboard
                </Link>

                <Link to="/pricing" className="hover:text-green-600">
                  Storage Plans
                </Link>

                <Link to="/chat" className="hover:text-green-600">
                  Chat
                </Link>
              </div>
            </div>

            
            <div>
              <p className="font-semibold text-gray-900 mb-3">Contact</p>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MdEmail size={18} className="text-green-600" />
                  <span className="break-all">filocontact2026@gmail.com</span>
                </div>

                <div className="flex items-center gap-2">
                  <MdPhone size={18} className="text-green-600" />
                  <span>+91 90000 00000</span>
                </div>

                <div className="flex items-center gap-2">
                  <MdLocationOn size={18} className="text-green-600" />
                  <span>India</span>
                </div>
              </div>

              <div className="mt-4">
                <Link
                  to="/contact"
                  className="inline-block text-sm font-semibold text-blue-600 hover:underline"
                >
                  Contact Us →
                </Link>
              </div>
            </div>

      
            <div>
              <p className="font-semibold text-gray-900 mb-2">Account</p>
              <div className="flex flex-col gap-1 text-gray-600">
                <Link to="/login" className="hover:text-green-600">
                  Sign in
                </Link>

                <Link to="/register" className="hover:text-green-600">
                  Sign up
                </Link>

                <Link to="/forgot-password" className="hover:text-green-600">
                  Forgot Password
                </Link>
              </div>
            </div>
          </div>
        </div>

    
        <div className="border-t mt-8 pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-left">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} FILO. All rights reserved.
          </p>

          <p className="text-xs text-gray-500">
            Made with ❤️ by{" "}
            <span className="font-semibold text-gray-700">Gourav Jangra</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
