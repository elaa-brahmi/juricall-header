import { motion } from "motion/react";
import { containerVariants, wordVariants } from "../utils/constants";

function AnimatedTitle({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <motion.h1
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          style={{ display: "inline-block", marginRight: i < words.length - 1 ? "0.25em" : "0" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
}
export default AnimatedTitle;