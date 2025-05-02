import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/ai-chat')({
  component: AIChat,
});

function AIChat() {
  return (
    <div className="p-2">
      <h3 className="text-primary">AI Chat</h3>
      <p>
        Chat IA
      </p>
    </div>
  );
}
