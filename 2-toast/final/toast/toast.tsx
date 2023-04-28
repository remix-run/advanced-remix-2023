import { useEffect, useState } from "react";
import { ToastMessage } from "./toast.server";
import { useTimeout } from "./use-timeout";

export function Toast({ serverMessages }: { serverMessages: ToastMessage[] }) {
  let [messages, setMessages] = useState(serverMessages);

  useEffect(() => {
    setMessages(messages.concat(serverMessages));
  }, [serverMessages]);

  return messages.length ? (
    <ol className="toast">
      {messages.map((msg, index) => (
        <ToastItem key={msg.content + index}>{msg.content}</ToastItem>
      ))}
    </ol>
  ) : null;
}

function ToastItem({ children }: { children: React.ReactNode }) {
  let [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    requestAnimationFrame(() => setIsHidden(false));
  }, []);

  useTimeout(() => setIsHidden(true), 6000);

  return (
    <li hidden={isHidden}>
      {children}{" "}
      <button
        type="button"
        aria-label="dismiss"
        onClick={() => {
          setIsHidden(true);
        }}
      >
        <Close />
      </button>
    </li>
  );
}

function Close() {
  return (
    <svg
      className="close"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
