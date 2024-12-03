import { useState } from 'react';
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

  const inference = async (input: string) => {
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
          }, {
            role: 'user',
            content: input
          }
        ],
        max_tokens: 1000,
      })
      .then((response) => response.choices[0]);

    return chatCompletion.message;
  };

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

    try {
      // Send user input to Hugging Face API
      const response = await inference(input);

      // Get the model's response and add to the chat
      const botResponse = response.content;
      console.log('Bot response:', botResponse);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'bot',
          content: botResponse
            ? botResponse
            : "Sorry, I'm having trouble understanding right now.",
        },
      ]);
    } catch (error) {
      console.error('Error fetching from Hugging Face:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'bot',
          content: 'Sorry, there was an error. Please try again later.',
        },
      ]);
    }
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
