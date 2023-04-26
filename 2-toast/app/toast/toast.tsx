import { useEffect, useLayoutEffect, useState } from "react";
import { ToastMessage } from "./toast.server";
import { useTimeout } from "./use-timeout";

export function Toast({
  serverMessages: messages,
}: {
  serverMessages: ToastMessage[];
}) {
  let [clientMessages, setMessages] = useState(messages);

  useEffect(() => {
    document.documentElement.classList.add("toast-has-js");
    return () => {
      document.documentElement.classList.remove("toast-has-js");
    };
  }, []);

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
            remove(msg.id);
          }}
        >
          {msg.content}
        </ToastItem>
      ))}
    </ol>
  ) : null;
}

function ToastItem({
  children,
  onDismiss,
}: {
  children: React.ReactNode;
  onDismiss: () => void;
}) {
  let [hidden, setHidden] = useState(false);

  if (typeof document !== "undefined") {
    useLayoutEffect(() => {
      setHidden(true);
    }, []);
  }

  useTimeout(() => {
    setHidden(false);
  }, 10);

  useTimeout(() => {
    setHidden(true);
  }, 6000 - 300);

  useTimeout(onDismiss, 6000);

  return (
    <li hidden={hidden}>
      {children}{" "}
      <button
        type="button"
        aria-label="dismiss"
        onClick={() => {
          setHidden(true);
          setTimeout(onDismiss, 300);
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
