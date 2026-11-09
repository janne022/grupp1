import { createFileRoute } from '@tanstack/react-router'
import Message from './-components/message'

export const Route = createFileRoute('/inbox/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <Message kindergarten="korven" date="100" time="200" />
    <Message kindergarten="korven" date="100" time="200" />
  </div>
}
