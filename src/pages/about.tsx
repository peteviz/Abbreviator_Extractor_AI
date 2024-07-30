import React from 'react';
import Navbar from '@/components/Navbar';

const About = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">About This Project</h1>
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
          <p className="mb-4">
            This project is an Abbreviation Extractor application built using Next.js, React, and Tailwind CSS. 
            It allows users to upload a Word document (.doc or .docx) and extracts the abbreviations and their definitions using Artificial Intelligence.
          </p>
          <h2 className="text-2xl font-bold mb-2">How It Works</h2>
          <ul className="list-disc pl-5 mb-4">
            <li>
              Users upload a Word document using the file input on the main page.
            </li>
            <li>
              The document is sent to a backend API endpoint where it is processed.
            </li>
            <li>
              The API leverages Artificial Intelligence to extract abbreviations and their definitions from the document.
            </li>
            <li>
              The extracted data is sent back to the frontend and displayed to the user.
            </li>
          </ul>
          <h2 className="text-2xl font-bold mb-2">Technologies Used</h2>
          <ul className="list-disc pl-5">
            <li>Next.js for server-side rendering and routing</li>
            <li>React for building the user interface</li>
            <li>Tailwind CSS for styling</li>
            <li>Material-UI for additional UI components</li>
            <li>Framer Motion for animations and smooth transitions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
