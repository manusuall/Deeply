'use client'

import { motion } from "framer-motion";

export default function SlideText({text, delay}: {text: string, delay: number}) {
    return <motion.h4 initial={{opacity:0,}} animate={{opacity:1, x:0}} transition={{delay: delay}} className="text-purple-300 text-xl font-bold">{text}</motion.h4>
}