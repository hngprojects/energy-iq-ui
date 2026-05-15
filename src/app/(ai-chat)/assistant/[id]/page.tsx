import { ChatWindow } from "@/components/ai-chat/chat/ChatWindow";
import { MOCK_CONVERSATION, MOCK_CHATS } from "@/components/ai-chat/lib/mockData";


interface Props {
  params: { id: string };
}

export default function ChatPage({ params }: Props) {
  // In a real app, fetch conversation from DB
  // For demo, use mock data
  const chat = MOCK_CHATS.find((c) => c.id === params.id);

  if (!chat && params.id !== "2") {
    // For demo purposes, show the mock conversation for any valid-looking id
    // In production, this would be a DB lookup
  }

  // Use the mock conversation for demo
  const conversation = {
    ...MOCK_CONVERSATION,
    id: params.id,
    title: chat?.title || MOCK_CONVERSATION.title,
    icon: chat?.icon || MOCK_CONVERSATION.icon,
    tag: chat?.tag || MOCK_CONVERSATION.tag,
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
