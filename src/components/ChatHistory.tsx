import React from 'react';
import './ChatHistory.css';

interface ChatHistoryProps {
  chats: { id: string; name: string }[];
  selectChat: (id: string) => void;
  createNewChat: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ chats, selectChat, createNewChat }) => {
  return (
    <div className="chat-history">
      <button onClick={createNewChat} className="new-chat-button">New Chat</button>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id} onClick={() => selectChat(chat.id)} className="chat-item">
            {chat.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatHistory;