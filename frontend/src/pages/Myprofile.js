import React, { useState } from 'react';
import { assets } from '../assets/assets';

const Myprofile = () => {


  const [userData, setUserData] = useState({
    name: 'Abhiram',
    image: assets.profile_pic,
    email: 'abc@gmail.com',
    phone: '+91 1234567891',
    Address: {
      line1: 'benz circle, vijayawada',
      line2: 'Andhra Pradesh'
    },
    gender: 'Male',
    dob: '2004-09-05'
  });



  const [isEdit,setIsEdit]=useState(false);

  return (
    <div>
      <img src={userData.image} alt="Profile" />
      {
        isEdit ?
         <input type='text' onChange={(e)=>setUserData(prev=>({...prev,name:e.target.value}))}></input>
         :
        <p>Name: {userData.name}</p>
         
      }
      <h2>Profile</h2>
      <p>Email: {userData.email}</p>
      <p>Phone: {userData.phone}</p>
      <p>Address: {userData.Address.line1}, {userData.Address.line2}</p>
      <p>Gender: {userData.gender}</p>
      <p>Date of Birth: {userData.dob}</p>
    </div>
  );
};

export default Myprofile;
