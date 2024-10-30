import React from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* Left side */}
        <div>
          <img className='mb-5 w-40' src={assets.logo} alt="ClinicEase Logo" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            The website connects patients with trusted doctors, allowing easy browsing of specialties, online appointment booking, and access to health information, enhancing the overall healthcare experience with convenience and security.
          </p>
        </div>

        {/* Center */}
        <div>
          <p className="text-xl font-medium mb-5">Company</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy Policy</Link>
            </li>
          </ul>
        </div>

        {/* Right side */}
        <div>
        <p className="text-xl font-medium mb-5">Get In Touch</p>
        <ul className="flex flex-col gap-2 text-gray-600">
            <li>+91 1234567891</li>
            <li>abcd@gmail.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr className="border-t border-gray-300 my-4" />
        <p className="py-5 text-sm text-center">
          &copy; 2024 ClinicEase - All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
   