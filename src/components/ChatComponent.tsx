import * as React from "react";
import { LuSendHorizontal } from "react-icons/lu";
import useChatbot from "../hooks/useChatbot";
import Markdown from "react-markdown";
import useChatScroll from "../hooks/useChatScroll";
import { SheetContent } from "./ui/sheet";
import { Bot } from "lucide-react";
import { Input } from "./ui/input";
import { useTranslation } from "react-i18next";

const ChatComponent: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const [input, setInput] = React.useState("");
  const { messages, sendMessage } = useChatbot();
  const ref = useChatScroll(messages);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <SheetContent side="right" className="p-0 w-[350px] sm:w-[400px] border-l rounded-none shadow-xl">
      <div className="flex flex-col h-full">
        <div className="p-3 border-b-input border font-semibold flex items-center gap-2">
          <Bot className="size-4" /> Chatbot AI
        </div>

        <div ref={ref} className="flex-1 overflow-y-auto p-4 space-y-2">
          <span className="text-center w-full block text-sm">{t("common.footer.startChat")} ✨</span>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 px-3 rounded-lg max-w-xs ${
                msg.sender === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-300 text-gray-800"
              }`}
            >
              <Markdown>{msg.text}</Markdown>
            </div>
          ))}
        </div>

        <div className="flex items-center border-t-input border p-4 justify-between">
          <div className="flex-1">
            <Input
              name="message"
              type="text"
              placeholder={t("common.footer.enterMessage")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
          </div>
          <button onClick={handleSend} className="p-2 ml-2 cursor-pointer">
            <LuSendHorizontal size={25} />
          </button>
        </div>
      </div>
    </SheetContent>
  );
};

export default ChatComponent;
