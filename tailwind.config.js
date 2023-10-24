export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        backgroundImage: {
          'start-icon': "url('/src/assets/icons/start.png')",
          'end-icon': "url('/src/assets/icons/end.png')",
          'weight-icon': "url('/src/assets/icons/weight.png')",
          'finish-icon': "url('/src/assets/icons/finish.png')",
        }
      },
    },
    plugins: [],
  }