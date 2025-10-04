
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks";
import { useGetMessagesQuery, useMarkMessagesAsReadMutation, useSendMessageMutation } from "../../app/api/HCMSApi";

export default function ChatWindow({ chatPartnerId }: { chatPartnerId: string }) {
    const user = useAuth();
  const { data: messages = [] } = useGetMessagesQuery({ chatPartnerId });
  const [sendMessage] = useSendMessageMutation();
  const [markAsRead] = useMarkMessagesAsReadMutation();
  const [message, setMessage] = useState("");

  useEffect(() => {
    markAsRead({ chatPartnerId });
  }, [chatPartnerId, markAsRead]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage( {sendMessageCommand : {  senderId: user.user?.id, receiverId: chatPartnerId, content: message }});
      setMessage("");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Chat</h2>
      <div className="h-96 overflow-y-auto border p-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`p-2 ${msg.senderId === "currentUserId" ? "text-right" : ""}`}>
            <p className="bg-gray-100 p-2 rounded">{msg.content}</p>
          </div>
        ))}
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          className="flex-1 border p-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="ml-2 bg-blue-500 text-white p-2" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
