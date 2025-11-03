// import React from 'react'
// import { Link } from 'react-router-dom';

// function Logo() {
//   return (
//     <>
//     <Link to="/" className="flex items-center space-x-2">
//     {/* The image should be placed in your project's `public` folder */}
//     <img src="/unnamed.jpeg" alt="Fitkeep Logo" className="w-8 h-8" />
//     <span className="font-bold text-xl text-gray-800">Fitkeep</span>
//   </Link>
//     </>
//   )
// }

// export default Logo
import React from 'react';
import { Link } from 'react-router-dom';

// 1. We accept the `isLoggedIn` prop (and default it to false)
function Logo({ isLoggedIn = false }) {

  // 2. We define your logo's appearance (the image + text) in one variable
  //    so we don't have to write it twice.
  const logoContent = (
    <>
      <img src="/unnamed.jpeg" alt="Fitkeep Logo" className="w-8 h-8" />
      <span className="font-bold text-xl text-gray-800">Fitkeep</span>
    </>
  );

  // 3. We get the styling that is shared by both versions
  const containerClasses = "flex items-center space-x-2";

  // 4. This is the new logic:
  if (isLoggedIn) {
    // If the user IS logged in, render a simple <div>.
    // We add 'cursor-default' to show it's not clickable.
    return (
      <div className={`${containerClasses} cursor-default`}>
        {logoContent}
      </div>
    );
  } else {
    // If the user is NOT logged in, render the original <Link>
    return (
      <Link to="/" className={containerClasses}>
        {logoContent}
      </Link>
    );
  }
}

export default Logo;