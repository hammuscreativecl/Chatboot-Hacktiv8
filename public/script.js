// Vanilla JS Chatbot Logic - Conforming to Hacktiv8 Slide 13, 15, 16, 18
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Append user's message to chat box
  appendMessage('user', userMessage);
  input.value = '';

  // Create a placeholder message that we can update later: "Gemini is thinking..."
  const botMessageElement = document.createElement('div');
  botMessageElement.classList.add('message', 'bot');
  botMessageElement.textContent = 'Gemini is thinking...';
  chatBox.appendChild(botMessageElement);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversation: [
          { role: 'user', text: userMessage }
        ]
      }),
    });

    if (!response.ok) {
      // Gracefully handle non-JSON or JSON error responses
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error || response.statusText;
      throw new Error(`Server error: ${errorMessage}`);
    }

    const data = await response.json();

    // Check if data && data.result as taught in Hacktiv8 Slide 15 & 18
    if (data && data.result) {
      botMessageElement.textContent = data.result;
    } else {
      botMessageElement.textContent = 'Sorry, no response received.';
    }
  } catch (error) {
    console.error('Error fetching response:', error);
    botMessageElement.textContent = 'Failed to get response from server.';
  } finally {
    // Ensure we scroll to the bottom after the final message is rendered
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
