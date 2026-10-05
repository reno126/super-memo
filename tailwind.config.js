/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    cyan: "#1CC8DB",
                    purple: "#A855F7",
                    ink: "#111111",
                },
            },
        },
    },
    plugins: [],
}
