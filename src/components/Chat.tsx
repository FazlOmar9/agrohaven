import { useEffect, useState } from 'react';
import ChatBox from './ChatBox';
import InputForm from './InputForm';
import './Chat.css';
import { HfInference } from '@huggingface/inference';

interface Message {
  role: string;
  content: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');

  const inference = async () => {
    const client = new HfInference(import.meta.env.VITE_HF_API_KEY);

    const chatCompletion = await client
      .chatCompletion({
        model: 'meta-llama/Llama-3.2-3B-Instruct',
        messages: [
          {
            role: 'system',
            content: `
                You are a helpful assistant. 
                You're known as the AgroHaven bot for the AgroHaven platform - the go-to platform for urban farming planning.
                You specialize in helping with urban farming related questions. 
                The user approaches you with a query, you must answer appropriately, in detail. 
                It should be purely in text format, with no special snippets. Formatting MUST be proper.
                You will politely decline to help with non urban farming related questions.
                Do not exceed the 1000 token limit.`,
          },
          ...messages,
        ],
        max_tokens: 1000,
      })
      .then((response) => response.choices[0]);

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: 'system',
        content:
          chatCompletion.message.content ||
          `Sorry, I'm having trouble understanding right now.`,
      },
    ]);
  };

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
      inference();
    }
  }, [messages]);

  // Send user input to Hugging Face API
  const sendMessage = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    if (!userInput.trim()) return;
    let input = userInput;
    setUserInput('');

    // Add user's message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: input },
    ]);
  };

  return (
    <div className='chat-container'>
      <ChatBox messages={messages} />
      <InputForm
        userInput={userInput}
        setUserInput={setUserInput}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default Chat;
