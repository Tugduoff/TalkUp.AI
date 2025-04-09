import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/About')({
  component: About,
})

function About() {
  return (
    <div className="p-2">
      <h3 className="text-primary">
        About
      </h3>
      <p>About the app, between us not that much use to this...</p>
    </div>
  )
}
