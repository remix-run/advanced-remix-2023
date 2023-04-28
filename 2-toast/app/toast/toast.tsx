import { ToastMessage } from "./toast.server";
import { useTimeout } from "./use-timeout";

export function Toast({ serverMessages }: { serverMessages: ToastMessage[] }) {
  return serverMessages.length ? (
    <ol className="toast">
      {serverMessages.map((msg) => (
        <ToastItem key={msg.id}>{msg.content}</ToastItem>
      ))}
    </ol>
  ) : null;
}

function ToastItem({ children }: { children: React.ReactNode }) {
  return (
    <li>
      {children}{" "}
      <button type="button" aria-label="dismiss">
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
