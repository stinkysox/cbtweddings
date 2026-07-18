"use client";

import React from "react";
import { SectionWrapper } from "./SectionWrapper";

// Team Members
const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Akshay Barman",
    title: "Director & Editor",
    image: "https://i.postimg.cc/h4YpKpB2/1-Akshay-Barman.jpg",
  },
  {
    id: 2,
    name: "Brijesh Kumar",
    title: "Director of Photography",
    image: "https://i.postimg.cc/fT05ymzx/2-Brijesh-Kumar.jpg",
  },
  {
    id: 3,
    name: "Ritivik Sharma",
    title: "Senior Photographer",
    image: "https://i.postimg.cc/hP7MvTDb/4-Ritivik-Sharma.jpg",
  },
  {
    id: 4,
    name: "Nishant",
    title: "Cinematographer",
    image: "https://i.postimg.cc/7YTXh0H1/5-Nishant.jpg",
  },
];

export const TeamSection = () => {
  return (
    <section className="py-32 max-w-7xl mx-auto px-6 overflow-hidden">
      <SectionWrapper direction="up" className="text-center mb-24 md:mb-32">
        <h2 className="text-[10px] uppercase tracking-[0.6em] text-yellow-600 font-bold mb-6">
          The Artists
        </h2>

        <h3 className="text-5xl md:text-7xl font-serif text-white tracking-tighter">
          Meet the <span className="italic">Team</span>
        </h3>

        <p className="mt-8 max-w-2xl mx-auto text-zinc-400 leading-relaxed">
          Every unforgettable story is crafted by passionate filmmakers,
          photographers, and creatives who believe that every frame deserves to
          feel timeless.
        </p>
      </SectionWrapper>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-6">
        {TEAM_MEMBERS.map((member, index) => {
          const offset = index % 2 !== 0 ? "lg:translate-y-16" : "";

          return (
            <SectionWrapper
              key={member.id}
              direction="up"
              delay={index * 0.15}
              className={offset}
            >
              <div className="group flex flex-col items-center">
                <div className="relative w-full aspect-[2/3] overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-white/10 bg-white/5">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70" />

                  <div className="absolute inset-0 ring-1 ring-white/10 rounded-[2rem] md:rounded-[3rem]" />
                </div>

                <div className="text-center mt-8 transition-all duration-500 group-hover:-translate-y-2">
                  <h4 className="text-2xl font-serif italic text-white mb-2">
                    {member.name}
                  </h4>

                  <p className="text-[10px] uppercase tracking-[0.35em] text-yellow-600 font-semibold">
                    {member.title}
                  </p>
                </div>
              </div>
            </SectionWrapper>
          );
        })}
      </div>
    </section>
  );
};