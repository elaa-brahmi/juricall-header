import { motion } from "motion/react";
import { CSSProperties } from "react";
import { containerVariants, wordVariants } from "../utils/constants";

function AnimatedTitle({ text, className, style }: { text: string; className?: string; style?: CSSProperties }) {
  const words = text.split(" ");
  return (
    <motion.h1
      className={className}
      style={style}
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
