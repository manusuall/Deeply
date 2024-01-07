'use client'
import { motion } from "framer-motion";

export default function Hero() {
    return <hgroup className="flex flex-col gap-2 text-5xl font-extrabold">
      <motion.h1 initial={{opacity:0,}} animate={{opacity:1, x:0}}>나의 인공지능 음악DJ,</motion.h1>
      <motion.h4 initial={{opacity:0,}} animate={{opacity:1, x:0}} transition={{delay: 0.25}} className="text-purple-500">DeepPLY</motion.h4>
    </hgroup>
}