import { ChatWindow } from "@/components/dashboard/ai/ChatWindow";
import { MOCK_CONVERSATION, MOCK_CHATS } from "@/lib/mocks/ai-data";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: Props) {
  // Await params before accessing its properties (required in Next.js 15)
  const { id } = await params;

  const chat = MOCK_CHATS.find((c) => c.id === id);

  const conversation = {
    ...MOCK_CONVERSATION,
    id,
    title: chat?.title ?? MOCK_CONVERSATION.title,
    icon: chat?.icon ?? MOCK_CONVERSATION.icon,
    tag: chat?.tag ?? MOCK_CONVERSATION.tag,
  };

  return (
    <div className="h-full bg-white">
      <ChatWindow conversation={conversation} />
    </div>
  );
}

export async function generateStaticParams() {
  return MOCK_CHATS.map((chat) => ({ id: chat.id }));
}
