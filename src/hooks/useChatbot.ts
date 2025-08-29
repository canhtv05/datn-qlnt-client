import { useState } from "react";
import axios from "axios";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const useChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const sendMessage = async (message: string) => {
    await delay(500);

    const newMessages: Message[] = [...messages, { text: message, sender: "user" }];
    setMessages(newMessages);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: message }],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const botMessage = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi từ Gemini.";
      setMessages([...newMessages, { text: botMessage, sender: "bot" }]);
    } catch (error) {
      console.error("Lỗi từ Gemini API:", error);
      setMessages([...newMessages, { text: "Đã xảy ra lỗi khi gọi API.", sender: "bot" }]);
    }
  };

  return { messages, sendMessage };
};

export default useChatbot;
