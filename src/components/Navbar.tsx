import Link from 'next/link';
import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 w-full sticky top-0">
      <ul className="flex space-x-4 justify-end">
        <li>
          <Link href="/">
            <span className="text-white hover:text-gray-400">Home</span>
          </Link>
        </li>
        <li>
          <Link href="/about">
            <span className="text-white hover:text-gray-400">About</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
