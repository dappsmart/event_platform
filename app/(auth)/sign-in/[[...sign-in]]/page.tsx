import { SignIn } from '@clerk/nextjs'


export default function page() {
  return (
    <section className=''>
        <SignIn />
    </section>
  )
}

