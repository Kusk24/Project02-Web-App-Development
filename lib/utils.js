import { twMerge } from "tailwind-merge"

// Simple clsx alternative since it's not installed
function clsx(...inputs) {
  return inputs
    .flat()
    .filter(Boolean)
    .join(' ');
}

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
