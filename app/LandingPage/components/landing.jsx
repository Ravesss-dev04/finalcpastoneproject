"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { IoTriangle } from "react-icons/io5";
import { motion } from "framer-motion";

// Swiper (Carousel)
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

export default function LandingHome({ setShowSignIn }) {
  const [showMobileOpen, setShowMobileOpen] = useState(false);

  return (
    <div className="w-full bg-[#0d1117] text-white">
      {/* NAVBAR */}
      <header className="flex flex-col items-center p-6">
        <div className="flex items-center justify-between w-full mb-6">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center"
          >
            <Image
              src="/plmunlogo (2).png"
              alt="PLMun Logo"
              width={60}
              height={60}
            />
            <h1 className="text-green-400 font-semibold text-xl ml-2">
              PLMun AI Tutor
            </h1>
          </motion.div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex gap-3">
            <Button
              onClick={() => {
                try {
                  localStorage.setItem("pendingRole", "student");
                } catch (e) {}
                setShowSignIn("sign-in");
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
            >
              Sign in
            </Button>

            <Button
              onClick={() => {
                try {
                  localStorage.setItem("pendingRole", "student");
                } catch (e) {}
                setShowSignIn("sign-up");
              }}
              variant={"outline"}
              className="border border-green-500 text-green-400 hover:bg-green-600 hover:text-white bg-transparent"
            >
              Sign up
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden">
            <button onClick={() => setShowMobileOpen(!showMobileOpen)}>
              <IoTriangle size={30} className="text-green-400" />
            </button>

            {showMobileOpen && (
              <div className="absolute right-6 top-16 bg-[#1c1f2a] p-4 rounded-md shadow-md z-50 flex flex-col gap-3 w-40">
                <Button
                  onClick={() => {
                    try {
                      localStorage.setItem("pendingRole", "student");
                    } catch (e) {}
                    setShowSignIn("sign-in");
                    setShowMobileOpen(false);
                  }}
                  className="bg-green-600 text-white"
                >
                  Sign in
                </Button>

                <Button
                  onClick={() => {
                    try {
                      localStorage.setItem("pendingRole", "student");
                    } catch (e) {}
                    setShowSignIn("sign-up");
                    setShowMobileOpen(false);
                  }}
                  variant="outline"
                  className="border border-green-400 text-green-400"
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* HERO SECTION */}
        <section className="flex flex-col md:flex-row items-center justify-between w-full px-6 md:px-16 my-10">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex-1 text-center md:text-left"
          >
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Become a Fast Learner Through AI-Powered Online Courses
            </h2>
            <p className="text-gray-400 mt-4 mb-6">
              Learn faster with adaptive lessons and smart AI guidance.
            </p>

            <button
              onClick={() => {
                try {
                  localStorage.setItem("pendingRole", "teacher");
                } catch (e) {}
                setShowSignIn("sign-up");
              }}
              className="bg-green-500 hover:bg-green-600 text-black hover:text-white px-6 py-3 rounded-md text-lg"
            >
              Become a Teacher
            </button>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex-1 mt-10 md:mt-0 flex justify-center"
          >
            <Image
              src="/plmun.png"
              alt="Study Illustration"
              width={600}
              height={600}
              className="w-[320px] sm:w-[420px] md:w-[520px]"
            />
          </motion.div>
        </section>

        {/* FEATURED COURSES — CAROUSEL */}
        <section className="px-6 md:px-16 my-16 w-full">
          <h3 className="text-3xl font-bold text-center mb-8">
            Featured Courses
          </h3>

          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="w-full"
          >
            {[
              {
                title: "Introduction to Python",
                img: "/java.png",
                level: "Beginner",
              },
              {
                title: "Web Development",
                img: "/web.png",
                level: "Intermediate",
              },
              {
                title: "Java OOP",
                img: "/one.png",
                level: "Intermediate",
              },
              {
                title: "Data Structures",
                img: "/oop.png",
                level: "Advanced",
              },
            ].map((course, i) => (
              <SwiperSlide key={i}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#161b22] rounded-xl overflow-hidden border border-gray-700 shadow-lg"
                >
                  <Image
                    src={course.img}
                    alt={course.title}
                    width={400}
                    height={200}
                    className="h-40 w-full object-cover"
                  />

                  <div className="p-4">
                    <h4 className="text-xl font-semibold">{course.title}</h4>
                    <p className="text-gray-400 text-sm">{course.level}</p>
                    <button className="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md">
                      Learn Now
                    </button>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* HOW IT WORKS */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="px-6 md:px-16 my-16 text-center"
        >
          <h3 className="text-3xl font-bold mb-8">How It Works</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Enroll in Courses",
                text: "Choose lessons created by expert teachers.",
              },
              {
                title: "Learn With AI",
                text: "Instant help and smart study guidance.",
              },
              {
                title: "Track Progress",
                text: "Monitor lessons, quizzes, and achievements.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="bg-[#161b22] p-6 rounded-lg border border-gray-700 shadow-md"
              >
                <h4 className="text-xl font-semibold text-green-400">
                  {item.title}
                </h4>
                <p className="text-gray-400 mt-2">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FOOTER */}
       
      </header>
    </div>
  );
}
