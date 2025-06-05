export function classifierBot(message: string): string {
  const input = message.toLowerCase();

  if (input.includes("hello") || input.includes("hi")) {
    return "Hi there! I'm your offline Switch Bot.";
  }

  if (input.includes("help")) {
    return "Sure! I can assist you with common queries even when offline.";
  }

  if (input.includes("bye")) {
    return "Goodbye! See you soon.";
  }

  return "Sorry, I didn't understand that. I'm still learning!";
}
