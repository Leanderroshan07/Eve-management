"use client";

import { motion } from "motion/react";
import { fadeIn } from "@/lib/motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}
