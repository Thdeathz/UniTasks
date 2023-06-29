/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      height: {
        content: 'calc(100vh - 3rem)',
        subContent: 'calc(100vh - 11rem)',
        profile: 'calc(100vh - 4.5rem)',
        cardBody: 'calc(100% - 2rem)',
        subTasks: 'calc(75vh - 25rem)',
        projectCalendar: 'calc(100vh - 4.5rem)'
      },
      minHeight: {
        content: 'calc(100vh - 3rem)'
      }
    },
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
      'primary-8': '#0050B3',
      'neutral-2': '#FAFAFA',
      'neutral-3': '#F5F5F5',
      'dust-red-2': '#FFCCC7',
      'dust-red-3': '#FFA39E',
      'dust-red-5': '#FF4D4F',
      'gold-4': '#FFD666',
      'gold-5': '#FFC53D',
      'polar-green-1': '#F6FFED',
      'polar-green-2': '#D9F7BE',
      'polar-green-3': '#B7EB8F',
      'polar-green-5': '#73D13D'
    }
  },
  plugins: [],
  important: true
}
