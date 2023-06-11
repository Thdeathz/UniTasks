import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import AppLogo from '~/assets/Logo.png'

type PropsType = {
  children: React.ReactNode
}

const variants = {
  hidden: { opacity: 0, x: 20 },
  enter: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, type: 'easeOut', when: 'beforeChildren' }
  },
  exit: { opacity: 0, x: -20 }
}

const AuthLayout = ({ children }: PropsType) => {
  return (
    <AnimatePresence
      initial={true}
      onExitComplete={() => {
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0 })
        }
      }}
    >
      <div className="w-screen h-screen flex justify-center items-center overflow-hidden">
        <motion.div
          className="border border-disabled rounded-md p-4 flex flex-col justify-start items-start gap-2"
          variants={variants}
          initial="hidden"
          animate="enter"
          exit="exit"
        >
          <img className="w-1/3" src={AppLogo} alt="An logo" />

          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default AuthLayout
