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

const HomeLayout = ({ children }: PropsType) => {
  return (
    <AnimatePresence
      initial={true}
      onExitComplete={() => {
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0 })
        }
      }}
    >
      <div className="flex justify-start items-start w-screen h-screen">
        <ToastContainer autoClose={2000} style={{ fontSize: '16px' }} />
        <SideBar />

        <div className="grow h-screen flex flex-col justify-start items-start overflow-hidden">
          <NavBar />

          <motion.div
            className="w-full grow overflow-y-auto"
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={variants}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}

export default HomeLayout
