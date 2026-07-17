"use client";

import React from "react";
import { SectionWrapper } from "./SectionWrapper";

// Dummy data for team members
const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Elena Rostova",
    title: "Lead Photographer & Founder",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Julian Hayes",
    title: "Head of Cinematography",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Sophia Lin",
    title: "Creative Director",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Marcus Thorne",
    title: "Lead Editor",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
  },
];

export const TeamSection = () => {
  return (
    <section className="py-32 max-w-7xl mx-auto px-6 overflow-hidden">
      <SectionWrapper direction="up" className="text-center mb-24 md:mb-32">
        <h2 className="text-[10px] uppercase tracking-[0.6em] text-yellow-600 font-bold mb-6">
          The Visionaries
        </h2>
        <h3 className="text-5xl md:text-7xl font-serif text-white tracking-tighter">
          Meet the <span className="italic">Team</span>
        </h3>
      </SectionWrapper>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-6">
        {TEAM_MEMBERS.map((member, index) => {
          // Stagger the vertical position of items for an editorial look on desktop
          const offset = index % 2 !== 0 ? "lg:translate-y-16" : "";
          return (
            <SectionWrapper
              key={member.id}
              direction="up"
              delay={index * 0.15}
              className={`${offset}`}
            >
              <div className="group flex flex-col items-center">
                <div className="relative w-full aspect-[2/3] overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-2xl mb-8 glass border border-white/5 cursor-crosshair">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2rem] md:rounded-[3rem] pointer-events-none" />
                  
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>
                
                <div className="text-center transition-transform duration-700 ease-out group-hover:-translate-y-2">
                  <h4 className="text-2xl font-serif italic text-white mb-3">
                    {member.name}
                  </h4>
                  <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-yellow-600/80">
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
