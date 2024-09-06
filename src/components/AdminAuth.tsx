

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Button } from './ui/button'


const Auth = () => {
  return (
   <>
          <SignedOut>
            <Button variant={"ghost"}>
            <SignInButton />
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
   </>
  )
}

export default Auth