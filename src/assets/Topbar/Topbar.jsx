import React, { useState } from "react";
import { BellRing } from 'lucide-react';

import BellIcon from "./Icons/bell-notification.svg?react";
import Setting from "./Icons/settings.svg?react";
import Sun from "./Icons/sun-light.svg?react";
import Moon from "./Icons/half-moon.svg?react";
import Profile from "./Icons/profile-circle.svg?react";
import ChatIcon from "./Icons/chatIcon.svg?react";

// 1. Import your CRMChatbot component
import CRMChatbot from "../components/Chatbot/CRMChatbot"; 

function Topbar({ setSearch, searchPlaceHolder, isDark, setIsDark }) {
  // 2. Add state to track if the chatbot is open
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleClicked = (button) => {
    alert(`${button} Button is clicked`)
  }

  // styling shared among all icons
  const buttonStyling = "p-1 sm:p-2 rounded-full hover:bg-[#1f4024] transition duration-200";
  const iconStyling = `w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${isDark ? "text-white" : "text-black"}`;

  return (
    // Added 'relative' to the parent container so we can absolutely position the chatbot dropdown if needed
    <div
      className={`relative flex items-center justify-between w-full p-1 mb-6 
      ${isDark ? "bg-[#171821]" : "bg-amber-50"}`}
    >
      {/* search bar */}
      <div className="flex-1 opacity-50">
        <input
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          placeholder={searchPlaceHolder}
          className={`
            w-full md:w-7/10 rounded-full border transition-all duration-300 px-0 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm md:text-base
            ${
              isDark
                ? "bg-[#21222D] border-gray-700 text-gray-100 placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
            }
          `}
        />
      </div>

      {/* icons */}
      <div className="flex gap-1 sm:gap-2 ml-2">

        {/* notifications */}
        <button
          onClick={() => handleClicked("Notification")}
          className={buttonStyling}
        >
          <BellRing className={iconStyling}/>
        </button>

        {/* chatBot */}
        {/* 3. Update the onClick to toggle the chat state */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={buttonStyling}
        >
          <ChatIcon className={iconStyling}/>
        </button>

        {/* theme */}
        <button
          onClick={() => setIsDark(!isDark)}
          className={buttonStyling}
        >
          {isDark ? (
            <Sun className={iconStyling} />
          ) : (
            <Moon className={iconStyling}/>
          )}
        </button>

        {/* settings */}
        <button
          onClick={() => handleClicked("Setting")}
          className={buttonStyling}
        >
          <Setting className={iconStyling}/>
        </button>

        {/* Profile */}
        <button
          onClick={() => handleClicked("Profile")}
          className={buttonStyling}
        >
          <Profile className={iconStyling}/>
        </button>
      </div>

      {/* 4. Conditionally render the chatbot */}
      {isChatOpen && (
        <div className="absolute top-14 right-16 z-50 shadow-lg rounded-lg">
           <CRMChatbot embedded={true} />
        </div>
      )}
      
    </div>
  );
}

export default Topbar;