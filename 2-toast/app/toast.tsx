import { useEffect, useState } from "react";
import { ToastMessage } from "./toast-session";
import { useTimeout } from "./use-timeout";

export function Toast({
  serverMessages: messages,
}: {
  serverMessages: ToastMessage[];
}) {
  let [clientMessages, setMessages] = useState(messages);

  useEffect(() => {
    setMessages(messages.concat(clientMessages));
  }, [messages]);

  let remove = (id: string) => {
    setMessages(clientMessages.filter((alleged) => alleged.id !== id));
  };

  return clientMessages.length ? (
    <ol className="toast">
      {clientMessages.map((msg) => (
        <ToastItem
          key={msg.id}
          onDismiss={() => {
            console.log("on dismiss");
            remove(msg.id);
          }}
        >
          {msg.content}
        </ToastItem>
      ))}
    </ol>
  ) : null;
}

const isBrowser = typeof window !== "undefined";

function ToastItem({
  children,
  onDismiss,
}: {
  children: React.ReactNode;
  onDismiss: () => void;
}) {
  let [hidden, setHidden] = useState(isBrowser ? true : false);

  useTimeout(() => {
    setHidden(false);
  }, 10);

  useTimeout(() => {
    setHidden(true);
  }, 4000 - 300);

  useTimeout(onDismiss, 4000);

  return (
    <li hidden={hidden}>
      {children}{" "}
      <button type="button" aria-label="dismiss" onClick={onDismiss}>
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
