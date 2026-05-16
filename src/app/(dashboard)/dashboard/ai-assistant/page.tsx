import { ChatList } from "@/components/dashboard/ai/chat-list";
import { MOCK_CHATS } from "@/lib/mocks/ai-data";

export default function AssistantPage() {
  return (
    <div className="h-full flex flex-col bg-white">
      <ChatList chats={MOCK_CHATS} />
    </div>
  );
}
