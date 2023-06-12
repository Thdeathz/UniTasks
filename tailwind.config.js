/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
    colors: {
      noneSelected: 'rgba(0, 0, 0, 0.45)',
      borderHover: 'rgba(0, 0, 0, 0.65)',
      disabled: 'rgba(0, 0, 0, 0.25)',
      borderLine: 'rgba(0, 0, 0, 0.05)',
      textHover: '#1890FF',
      todo: '#D9F7BE',
      inprogress: '#FFD8BF',
      reviewing: '#FFF1B8',
      completed: '#B5F5EC',
      bgSecondary: '#F0F0F0',
      bgDefault: '#FFFFFF',
      black: '#000000',
      danger: '#FF7875',
      dragging: '#BAE7FF',
      checked: '#73D13D',
      tooltip: 'rgba(0, 0, 0, 0.65)',
      'primary-1': '#E6F7FF',
      'primary-2': '#BAE7FF',
      'primary-3': '#91D5FF',
      'primary-4': '#69C0FF',
      'primary-5': '#40A9FF',
      'neutral-3': '#F5F5F5',
      'dust-red-3': '#FFA39E',
      'dust-red-5': '#FF4D4F'
    }
  },
  plugins: [],
  important: true
}
