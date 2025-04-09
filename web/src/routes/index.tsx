import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-2">
      <h3 className="text-primary">
        Home
      </h3>
      <p>Showcase page of the app...</p>
    </div>
  )
}
