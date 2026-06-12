import { Button } from "@/components/shared/ui/button";

export function ErrorFallback({ message }: { message: React.ReactNode }) {
  return (
    <div>
      <p>{message}</p>
      <Button onClick={() => window.location.reload()}>Reload</Button>
    </div>
  );
}
