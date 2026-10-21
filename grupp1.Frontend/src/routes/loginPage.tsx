import { LoginForm } from '@/components/login-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/loginPage')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <LoginForm className='w-1/2' />
  </div>
}
