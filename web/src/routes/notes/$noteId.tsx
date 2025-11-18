import { Bubble } from '@/components/atoms/bubble';
import { Button } from '@/components/atoms/button';
import { Icon } from '@/components/atoms/icon';
import { EditorToolbar } from '@/components/organisms/editor-toolbar';
import { useRichTextEditor } from '@/hooks/utils/useRichTextEditor';
import { createFileRoute } from '@tanstack/react-router';
import { EditorContent } from '@tiptap/react';

export const Route = createFileRoute('/notes/$noteId')({
  loader: async ({ params }) => {
    return { noteId: params.noteId };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { noteId } = Route.useParams();
  const editorData = useRichTextEditor();

  if (!editorData.editor) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div
            className="loader"
            style={{
              width: '48px',
              height: '48px',
              borderWidth: '4px',
              margin: '0 auto 16px',
            }}
          />
          <p className="text-text-idle">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-rows-[96px_1fr] px-4 sm:px-8 md:px-16 pt-11 gap-11 h-screen w-full min-w-0">
      <div className="w-full min-w-0 flex flex-col justify-center">
        <div className="flex justify-between items-center w-full min-w-0 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Bubble />
            <h1 className="text-h1 text-text-idle">Note {noteId}</h1>
            <Button
              variant="text"
              color="black"
              className="p-2"
              title="Edit note name"
            >
              <Icon icon="pencil" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="text" color="black" title="Share note">
              <Icon icon="share" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button variant="text" color="black" title="Add to favorites">
              <Icon icon="favorite" />
              <span className="hidden sm:inline">Favorite</span>
            </Button>
            <Button variant="text" color="error" title="Delete note">
              <Icon icon="delete" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>
        <p className="text-text-idle text-body-md ml-12 mt-2">
          Used in {noteId} practices
        </p>
      </div>
      <div className="grid grid-rows-[40px_1fr] bg-[#ECEDF6] rounded-t-[20px] px-6 pt-4 pb-0 gap-3 w-full min-w-0 h-full overflow-hidden">
        <div className="bg-white rounded-[10px] w-full min-w-0">
          <EditorToolbar {...editorData} />
        </div>
        <div className="bg-white rounded-t-[10px] w-full min-w-0 overflow-y-auto p-6">
          <EditorContent editor={editorData.editor} />
        </div>
      </div>
    </div>
  );
}
