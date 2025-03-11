import React from "react";
import MapComponent from "../components/MapComponent";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#FFF7E7] flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white/20 backdrop-blur-md shadow-md px-6 py-4 flex justify-between items-center z-50">
        <h1 className="text-2xl font-bold text-blue-700">Bus Tracker</h1>
        <ul className="flex space-x-6">
          <li className="text-gray-700 hover:text-blue-500 transition duration-300 cursor-pointer">Home</li>
          <li className="text-gray-700 hover:text-blue-500 transition duration-300 cursor-pointer">About</li>
          <li className="text-gray-700 hover:text-blue-500 transition duration-300 cursor-pointer">Services</li>
          <li className="text-gray-700 hover:text-blue-500 transition duration-300 cursor-pointer">Contact</li>
        </ul>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center flex-1 mt-20 px-6 text-center">
        <h2 className="text-4xl font-extrabold text-gray-800">Real-Time Bus Tracking</h2>
        <p className="text-gray-600 mt-3 text-lg max-w-2xl">
          Track live bus locations, avoid delays, and plan your commute efficiently with our AI-powered smart transport system.
        </p>
      </div>

      {/* Map Section */}
      <div className="flex justify-center items-center w-full pb-10">
        <div className="w-3/4 h-[500px] bg-white shadow-lg rounded-lg overflow-hidden">
          <MapComponent />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
