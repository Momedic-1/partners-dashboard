"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative flex items-center cursor-pointer justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative w-5 h-5 flex items-center cursor-pointer justify-center"
          >
            <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </motion.div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="mt-2 w-40 rounded-xl border border-border bg-white p-2 shadow-xl"
      >
        {["light", "dark", "system"].map((theme) => (
          <DropdownMenuItem
            key={theme}
            onClick={() => setTheme(theme)}
            className="cursor-pointer rounded-md px-3 py-2 text-sm text-black hover:bg-muted hover:text-primary transition-colors"
          >
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
