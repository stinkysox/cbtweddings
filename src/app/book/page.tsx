"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionWrapper } from "../../components/SectionWrapper";
import { siteContent } from "../../data/siteContent";

export default function Book() {
  const [submitted, setSubmitted] = useState(false);
  const { book } = siteContent;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="relative pt-32 pb-24 px-6 overflow-hidden">

      <div className="max-w-4xl mx-auto relative z-10">
        <SectionWrapper direction="up" className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-serif mb-6 text-white">
            {book.hero.title}
          </h1>
          <p className="premium-label italic">
            {book.hero.subtitle}
          </p>
        </SectionWrapper>

        <SectionWrapper direction="up" delay={0.2}>
          <div className="glass rounded-[2rem] p-8 md:p-16 border border-white/10 shadow-2xl">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-xs uppercase tracking-widest opacity-60">
                        {book.form.name}
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="John Doe"
                        className="w-full bg-transparent border-b border-white/20 py-4 focus:border-yellow-600 outline-none transition-colors text-white placeholder:text-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest opacity-60">
                        {book.form.email}
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="john@example.com"
                        className="w-full bg-transparent border-b border-white/20 py-4 focus:border-yellow-600 outline-none transition-colors text-white placeholder:text-gray-700"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest opacity-60">
                        {book.form.date}
                      </label>
                      <input
                        required
                        type="date"
                        className="w-full bg-transparent border-b border-white/20 py-4 focus:border-yellow-600 outline-none transition-colors text-white [color-scheme:dark]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest opacity-60">
                        {book.form.type}
                      </label>
                      <div className="relative">
                        <select className="w-full bg-black/20 border-b border-white/20 py-4 px-4 focus:border-yellow-600 outline-none transition-colors appearance-none cursor-pointer text-white rounded-t-lg backdrop-blur-sm">
                          {book.eventTypes.map((type) => (
                            <option
                              key={type.value}
                              value={type.value}
                              className="bg-gray-900 text-white"
                            >
                              {type.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest opacity-60">
                      {book.form.vision}
                    </label>
                    <textarea
                      placeholder="Describe the mood, location, and your story..."
                      className="w-full bg-transparent border-b border-white/20 py-4 h-32 focus:border-yellow-600 outline-none transition-colors resize-none text-white placeholder:text-gray-700"
                    />
                  </div>

                  <div className="flex items-start gap-4 py-4 text-xs text-gray-500">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 w-4 h-4 rounded border-white/20 accent-yellow-600"
                    />
                    <p className="leading-relaxed">
                      I agree to the processing of my details as per the{" "}
                      <a href="/privacy-policy" className="text-yellow-600 underline">Privacy Policy</a> and{" "}
                      <a href="/terms-of-service" className="text-yellow-600 underline">Terms of Service</a>.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-5 rounded-full bg-yellow-600 text-white uppercase tracking-[0.2em] font-bold text-sm glow-button transition-all hover:bg-yellow-500"
                  >
                    {book.form.submit}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <h2 className="text-4xl font-serif mb-4 text-white">
                    {book.form.successTitle}
                  </h2>
                  <p className="premium-para max-w-sm mx-auto !text-zinc-500">
                    {book.form.successMessage}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-sm uppercase tracking-widest underline underline-offset-8 hover:text-yellow-600 transition-colors"
                  >
                    Send another request
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SectionWrapper>
      </div>
    </div>
  );
}
