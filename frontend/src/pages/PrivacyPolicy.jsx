import React from "react";
import Navigation from "../components/Navigation";
import { ShieldCheck, Database, Eye, Mail } from "lucide-react";

const Privacypolicy = () => {
  const lastUpdated = "January 26, 2026"; // Synchronized with current date
  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <div className="min-h-screen bg-[#F1EDE4]">
      <Navigation name={user.name} id={user._id} page={"privacyPolicy"} />

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-[#FCF9F1] shadow-xl rounded-2xl overflow-hidden border border-[#E8E2D2]">
          {/* Header: The Archive Charter */}
          <div className="bg-[#451A03] px-8 py-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
              <ShieldCheck
                size={300}
                className="translate-x-1/2 -translate-y-1/4"
              />
            </div>

            <h1 className="text-3xl font-black text-[#FDE68A] tracking-tight relative z-10">
              The Cognitive Charter
            </h1>
            <p className="mt-2 text-[#D97706] font-bold uppercase tracking-widest text-xs relative z-10">
              Privacy & Data Ethics • Last Revised: {lastUpdated}
            </p>
          </div>

          {/* Content: Scholarly Layout */}
          <div className="p-8 md:p-12 space-y-12">
            <section className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#FEF3C7] rounded-lg text-[#B45309]">
                  <Database size={20} />
                </div>
                <h2 className="text-xl font-black text-[#451A03]">
                  1. Information Harvest
                </h2>
              </div>
              <p className="text-[#78350F]/80 leading-relaxed mb-4">
                In the pursuit of organized thought, we collect only the
                essentials provided during your scholarly endeavors:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li className="p-4 bg-[#F7F2E7] rounded-xl border border-[#E8E2D2]">
                  <span className="block font-bold text-[#451A03]">
                    Account Artifacts
                  </span>
                  <span className="text-xs text-[#92400E]">
                    Name, email, and cryptographically hashed credentials.
                  </span>
                </li>
                <li className="p-4 bg-[#F7F2E7] rounded-xl border border-[#E8E2D2]">
                  <span className="block font-bold text-[#451A03]">
                    Intellectual Content
                  </span>
                  <span className="text-xs text-[#92400E]">
                    The notes, titles, and taxonomies (tags) you curate.
                  </span>
                </li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#FEF3C7] rounded-lg text-[#B45309]">
                  <Eye size={20} />
                </div>
                <h2 className="text-xl font-black text-[#451A03]">
                  2. Utilization of Logic
                </h2>
              </div>
              <p className="text-[#78350F]/80 leading-relaxed italic border-l-4 border-[#D97706] pl-4">
                We use your data to maintain the integrity of the archive,
                authenticate your sessions via secure tokens, and facilitate the
                public search of thoughts you explicitly choose to broadcast.
              </p>
            </section>

            <section className="bg-[#451A03]/5 p-6 rounded-2xl border border-[#D97706]/20">
              <h2 className="text-xl font-black text-[#451A03] mb-4">
                3. Fortification & Security
              </h2>
              <p className="text-[#78350F]/80 text-sm leading-relaxed">
                Data is housed within encrypted server-side vaults. While we
                employ high-level wards to protect your intellectual property,
                no method of digital transmission is 100% impenetrable. We treat
                your notes with the same reverence as a physical library's
                restricted section.
              </p>
            </section>

            <section className="pt-8 border-t border-[#E8E2D2]">
              <div className="flex flex-col items-center text-center">
                <h2 className="text-xl font-black text-[#451A03] mb-2">
                  Inquiries & Correspondance
                </h2>
                <p className="text-sm text-[#92400E] mb-6">
                  Address your concerns to our ethics officer:
                </p>
                <a
                  href="mailto:privacy@cognitiveamber.com"
                  className="flex items-center gap-2 px-8 py-3 bg-[#451A03] text-[#FDE68A] rounded-full font-bold hover:bg-black transition-all shadow-lg"
                >
                  <Mail size={18} /> privacy@cognitiveamber.com
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacypolicy;
