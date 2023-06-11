import React from 'react'
import { auth, googleProvider } from '~/firebase/config'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import GoogleLogo from '~/assets/google_logo.png'
import useCredentialStore from '~/stores/CredentialStore'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const SignInWithGoogle = () => {
  const navigate = useNavigate()
  const [setCredential] = useCredentialStore(state => [state.setCredential])

  const handleSignInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result)
        if (!credential) return

        const token = credential.accessToken
        // The signed-in user info.
        const user = result.user

        const { uid, email, displayName, photoURL } = user
        setCredential({
          uid,
          email: email as string,
          displayName: displayName as string,
          avatar: photoURL as string
        })
        toast.success('Login successfully!', {
          toastId: 'login-success'
        })
        navigate('/')
      })
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code
        const errorMessage = error.message
        // The email of the user's account used.
        const email = error.customData.email
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error)
        // ...
        console.log('==> error code', error)
      })
  }

  return (
    <button
      type="button"
      className="basis-1/2 border border-disabled flex justify-center gap-2 items-center p-2 rounded-md hover:border-textHover transition-colors"
      onClick={handleSignInWithGoogle}
    >
      <img src={GoogleLogo} className="w-[20px]" />
      <span className="font-medium">Google</span>
    </button>
  )
}

export default SignInWithGoogle
