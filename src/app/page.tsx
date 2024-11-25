import Image from 'next/image'
import { LoginForm } from '@/app/components/login-form';


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="mb-8">
        <Image
          src="/images/tornet.jpg"
          alt="Tornet Logga"
          width={200}
          height={100}
          priority
        />
      </div>
      <LoginForm />
    </div>
  )
}

