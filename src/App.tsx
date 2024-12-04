import './App.css';
import Chat from './components/Chat';
import Navbar from './components/NavBar';
import ChatHistory from './components/ChatHistory';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [chats, setChats] = useState<{ id: string; name: string }[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem('chats') || '[]');
    setChats(savedChats);
    if (savedChats.length === 0) {
      createNewChat();
    } else {
      setSelectedChatId(savedChats[0].id);
    }
  }, []);

  const saveChats = (chats: { id: string; name: string }[]) => {
    localStorage.setItem('chats', JSON.stringify(chats));
  };

  const selectChat = (id: string) => {
    setSelectedChatId(id);
  };

  const createNewChat = () => {
    const newChat = { id: uuidv4(), name: `Chat ${chats.length + 1}` };
    const updatedChats = [...chats, newChat];
    setChats(updatedChats);
    saveChats(updatedChats);
    setSelectedChatId(newChat.id);
  };

  return (
    <div className="App">
      <Navbar />
      <div className="main-content">
        <ChatHistory chats={chats} selectChat={selectChat} createNewChat={createNewChat} />
        {selectedChatId && <Chat chatId={selectedChatId} />}
      </div>
    </div>
  );
};

export default App;