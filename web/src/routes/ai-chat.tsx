import { Button } from '@/components/atoms/button';
import { createAuthGuard } from '@/utils/auth.guards';
import { createFileRoute } from '@tanstack/react-router';
import toast from 'react-hot-toast';

export const Route = createFileRoute('/ai-chat')({
  beforeLoad: createAuthGuard('/ai-chat'),
  component: AIChat,
});

function AIChat() {
  return (
    <div className="p-2">
      <h3 className="text-primary">AI Chat</h3>
      <p>Chat IA</p>
      <div className="flex flex-col gap-2 justify-center items-start mt-4">
        <Button
          variant="contained"
          color="success"
          className="rounded-md w-40"
          onClick={() => {
            toast.success('This is a success message');
          }}
        >
          <span>Success</span>
        </Button>
        <Button
          variant="contained"
          color="error"
          className="rounded-md w-40"
          onClick={() => {
            toast.error('This is an error message');
          }}
        >
          <span>Error</span>
        </Button>
        <Button
          variant="contained"
          color="neutral"
          className="rounded-md w-40"
          onClick={() => {
            toast.loading('This is a loading message');
          }}
        >
          <span>Loading</span>
        </Button>
      </div>
    </div>
  );
}
