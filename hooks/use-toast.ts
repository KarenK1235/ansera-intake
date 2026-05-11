export function useToast() {
  return {
    toast: (options: { title?: string; description?: string; variant?: string }) => {
      if (typeof window !== "undefined") {
        console.log(options.title || "Notice", options.description || "");
      }
    }
  };
}
