import type { ReactNode } from "@tanstack/react-router";
import { Provider } from "jotai";

export default function JotaiProvider({ children }: { children: ReactNode }) {
  return <Provider>{children}</Provider>;
}
