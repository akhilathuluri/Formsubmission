import { motion } from "framer-motion";

interface FormHeaderProps {
  title?: string;
  subtitle?: string;
}

export const FormHeader = ({
  title = "Our Grand Master Prabodh has taken a noble resolution to complete One Crore Hours of Meditation for World Peace 🌍 ✨Let us all participate and contribute our meditation time 🙏 You can meditate for any duration from 1 minute to 24 hours and share it daily.",
  subtitle = "Select the duration that works best for you.",
}: FormHeaderProps) => {
  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-3"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-lg text-muted-foreground mb-12"
      >
        {subtitle}
      </motion.p>
    </>
  );
};
