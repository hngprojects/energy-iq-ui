import { ChatList } from "@/components/ai-chat/chat/ChatList";
import { MOCK_CHATS } from "@/components/ai-chat/lib/mockData";

export default function AssistantPage() {
  return (
    <div className="h-full flex flex-col bg-white">
      <ChatList chats={MOCK_CHATS} />
    </div>
  );
}
