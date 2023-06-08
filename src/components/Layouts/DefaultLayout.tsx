import React from 'react'
import SideBar from '../SideBar'
import NavBar from '../NavBar'
import { ToastContainer } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'

type PropsType = {
  children: React.ReactNode
}

const variants = {
  hidden: { opacity: 0, x: 0, y: 10 },
  enter: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.6, type: 'easeOut', when: 'beforeChildren' }
  },
  exit: { opacity: 0, x: -0, y: -10 }
}

const DefaultLayout = ({ children }: PropsType) => {
  return (
    <AnimatePresence
      initial={true}
      onExitComplete={() => {
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0 })
        }
      }}
    >
      <div className="flex justify-start items-start w-full h-full">
        <ToastContainer autoClose={2000} style={{ fontSize: '16px' }} />
        <SideBar />

        <div className="grow bg-slate-700 h-full flex flex-col justify-start items-start overflow-hidden">
          <NavBar />

          <motion.div
            className="w-full grow"
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={variants}
          >
            {children}
          </motion.div>
          <p className="text-end text-sm opacity-30 font-medium w-full">
            © 2023 UI/UX HUST Team. All Rights Reserved.
          </p>
        </div>
      </div>
    </AnimatePresence>
  )
}

export default DefaultLayout
