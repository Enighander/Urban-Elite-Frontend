const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {
      screens: {
        sm: "640px",
        // 128 
        md: "768px",
        // 256
        lg: "1024px",
        // 256
        xl: "1280px",
        // 256
        '2xl' : "1536px"
      },
    },
  },
  plugins: [flowbite.content()],
  darkMode: "class",
};
