import React from 'react';
import { assets } from '../assets/assets';

const About = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>About <span className='text-gray-700 font-medium'>Us</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="About Us" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Welcome to ClinicEase, your premier destination for seamless healthcare access! Our platform connects patients with top healthcare professionals, making it easier than ever to find the right doctor for your needs.</p>
          <p>At ClinicEase, we prioritize your health and well-being. With our user-friendly interface, you can quickly search for doctors by specialty, read reviews, and book appointments—all from the comfort of your home.</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>At ClinicEase, we envision a world where healthcare is accessible to everyone. We strive to empower patients with the knowledge and tools they need to make informed health decisions. By bridging the gap between patients and healthcare providers, we aim to create a healthier future for all, where quality care is just a click away.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
