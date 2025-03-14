import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send } from "lucide-react";
import { Box, Card, CardContent, TextField, IconButton, Typography } from "@mui/material";

const ChatGPT = () => {
  const [messages, setMessages] = useState([
    { text: "¡Hola! ¿En qué puedo ayudarte?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    try {
      const { data } = await axios.post("https://backendcentro.onrender.com/api/GPT/chat", { message: input });
      setMessages([...newMessages, { text: data.response, sender: "bot" }]);
    } catch (error) {
      console.error("Error enviando mensaje:", error);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 420,
        width: "100%",
        mx: "auto",
        mt: 4,
        p: 2,
        borderRadius: 3,
        boxShadow: 3,
        backgroundColor: "#ffffff",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          background: "linear-gradient(135deg, #00796b, #009688)",
          color: "white",
          p: 2,
          borderRadius: 2,
        }}
      >
        Estoy aquí para ayudarte. Pregunta lo que necesites.
      </Typography>

      <CardContent
        ref={chatMessagesRef}
        sx={{
          maxHeight: 400,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 2,
          p: 1,
          borderRadius: 2,
          backgroundColor: "#f9fafb",
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              maxWidth: "80%",
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#00796b" : "#e5e7eb",
              color: msg.sender === "user" ? "white" : "#333",
              p: 1.5,
              borderRadius: 2,
              boxShadow: 1,
              fontSize: "1rem",
              wordBreak: "break-word",
            }}
          >
            {msg.text}
          </Box>
        ))}
      </CardContent>

      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          sx={{
            borderRadius: 5,
            backgroundColor: "white",
          }}
        />
        <IconButton
          onClick={sendMessage}
          sx={{
            ml: 1,
            backgroundColor: "#00796b",
            color: "white",
            "&:hover": { backgroundColor: "#005a4f" },
          }}
        >
          <Send size={24} />
        </IconButton>
      </Box>
    </Card>
  );
};

export default ChatGPT;
