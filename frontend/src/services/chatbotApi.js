const API = "http://localhost:5000/api/chatbot";

export async function askChatbot(message) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  return res.json();
}