module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pebble: {
          green: '#5C8374',
          aqua: '#6EC6CA',
          mint: '#F2F7F5',
          slate: '#232D3F',
          yellow: '#FFD166'
        }
      },
      fontFamily: {
        'rounded': ['System']
      }
    },
  },
  plugins: [],
}