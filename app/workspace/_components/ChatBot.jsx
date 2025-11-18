"use client"
import React, { useEffect, useState } from 'react'

import { BotIcon, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [animate, setAnimate] = useState(false);

    // animation
   
   useEffect(() => {
    const interval = setInterval(() => {
        setAnimate(true);
        setTimeout(() => setAnimate(false), 8000);
    }, 3000);
    return () => clearInterval(interval);
   }, []);

 const pathname = usePathname();
    if(pathname === '/' || pathname.startsWith("/LandingPage")){
        return null;
    }


  return (
    <div>
      <motion.div
        onClick={() => setIsOpen(!isOpen)}
        className='fixed bottom-4 right-6 z-9999 cursor-pointer'
        whileHover={{scale: 1.1}}
      >
        <motion.div
            animate={animate ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
            transition={{duration: 0.8}}
            className='bg-linear-to-r from-green-600 to-emera-500 p-4 rounded-full shadow-lg'
        >
            <BotIcon className='w-7 h-7 text-white'/>
        </motion.div>
      </motion.div>
    
      {/* animate pop-up */}
      <AnimatePresence>
        {isOpen && (
            <motion.div
            initial={{opacity: 0, y: 40, scale: 0.9}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, y: 40, scale: 0.9}}
            transition={{duration: 0.3}}
            className='fixed bottom-20 right-6 bg-[#1d1f2b] border border-[#2a2d3c] text-white w-80 h-96 rounded-2xl shadow-xl z-9999 flex flex-col overflow-hidden'
            >
                <div className='flex justify-between items-center p-4 border-b border-[#2a2d3c] bg-[#13181f]'>
                    <div className='flex items-center gap-2'>
                        <BotIcon className='w-5 h-5 text-green gap-2'/>
                    <h3 className='text-sm font-semibold'>PLMun AI Tutor</h3>
                    </div>
                    <button onClick={() => setIsOpen(false)}>
                    <X className='w-5 h-5 text-gray-400 hover:text-white'/>
                    </button>
                </div>
                
                <div className='flex-1 p-4 overflow-y-auto text-sm space-y-3'>
                    <div className='bg-[#232935] p-3 rouneded-lg self-start w-fit max-w-[80%]'>
                       👋  Hello How can i Help you Study Today?
                    </div>
                </div>
                <div className='flex items-center gap-2'>
<input
            type="text"
            placeholder="Ask your question here..."
           
            
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none px-2 text-xs sm:text-sm"
          />
          <button
            type="submit"
         
            className="bg-[#238636] hover:bg-[#2EA043] px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-white font-semibold text-sm"
          >
            ➤
          </button>                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ChatBot
