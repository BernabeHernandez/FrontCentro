import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send } from "lucide-react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  IconButton,
  Typography,
  Fade,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { SmartToy, ChatBubbleOutline, Forum } from "@mui/icons-material";

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 480,
  width: "100%",
  margin: "auto",
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  borderRadius: 16,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  overflow: "hidden",
}));

const StyledChatContent = styled(CardContent)(({ theme }) => ({
  maxHeight: 450,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "4px",
  },
}));

const StyledMessage = styled(Box)(({ theme, sender }) => ({
  maxWidth: "75%",
  alignSelf: sender === "user" ? "flex-end" : "flex-start",
  background:
    sender === "user"
      ? "linear-gradient(135deg, #00e676 0%, #00c853 100%)" // Verde neón para mensajes del usuario
      : "rgba(255, 255, 255, 0.1)",
  color: sender === "user" ? "#fff" : "#e0e0e0",
  padding: theme.spacing(1.5),
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  fontSize: "1rem",
  wordBreak: "break-word",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.5)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#00e676", // Verde neón para el foco
    },
  },
  "& .MuiInputBase-input": {
    color: "#fff",
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
}));

// Función para renderizar tablas y texto limpio
const renderMessageContent = (text) => {
  const tableRegex = /\|(.+?)\|\n\|[-:|]+\|\n((?:\|.+?\|\n)+)/g;
  if (tableRegex.test(text)) {
    const html = text.replace(tableRegex, (match, header, rows) => {
      const headers = header.split("|").filter(Boolean).map((h) => h.trim());
      const rowData = rows
        .split("\n")
        .filter(Boolean)
        .map((row) => row.split("|").filter(Boolean).map((cell) => cell.trim()));

      return `
        <table style="border-collapse: collapse; width: 100%; color: #e0e0e0; font-size: 0.9rem;">
          <thead>
            <tr style="background: rgba(255, 255, 255, 0.15);">
              ${headers.map((h) => `<th style="padding: 8px; border: 1px solid rgba(255, 255, 255, 0.2);">${h}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${rowData.map((row) => `
              <tr>
                ${row.map((cell) => `<td style="padding: 8px; border: 1px solid rgba(255, 255, 255, 0.2);">${cell}</td>`).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
    });
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }
  const cleanText = text
    .replace(/\*/g, "") // Elimina asteriscos
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Convierte negritas Markdown a HTML
    .replace(/\n/g, "<br/>"); // Convierte saltos de línea a <br/>
  return <div dangerouslySetInnerHTML={{ __html: cleanText }} />;
};

const ChatGPT = () => {
  const [messages, setMessages] = useState([
    {
      text: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
    },
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
      const { data } = await axios.post("https://backendcentro.onrender.com/api/GPT/chat", {
        message: input,
      });
      setMessages([...newMessages, { text: data.response, sender: "bot" }]);
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      setMessages([
        ...newMessages,
        { text: "Ups, algo salió mal. Intenta de nuevo.", sender: "bot" },
      ]);
    }
  };

  return (
    <Fade in={true} timeout={700}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "radial-gradient(circle at center, #0f172a 0%, #1a1a2e 100%)",
          position: "relative",
          overflow: "hidden",
          py: 6,
          "&:before": {
            content: '""',
            position: "absolute",
            top: "10%",
            left: "20%",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(33, 150, 243, 0.2) 0%, transparent 70%)", // Azul neón
            filter: "blur(50px)",
            zIndex: 0,
          },
          "&:after": {
            content: '""',
            position: "absolute",
            bottom: "15%",
            right: "15%",
            width: "200px",
            height: "200px",
            background: "radial-gradient(circle, rgba(124, 77, 255, 0.2) 0%, transparent 70%)", // Morado neón
            filter: "blur(40px)",
            zIndex: 0,
          },
        }}
      >
        {/* Iconos animados de robots y chatbots */}
        <SmartToy
          sx={{
            position: "absolute",
            top: "15%",
            left: "10%",
            fontSize: 60,
            color: "rgba(33, 150, 243, 0.5)", // Azul neón
            animation: "float 6s infinite ease-in-out",
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
              "50%": { transform: "translateY(-20px) rotate(10deg)" },
            },
          }}
        />
        <ChatBubbleOutline
          sx={{
            position: "absolute",
            bottom: "20%",
            right: "12%",
            fontSize: 50,
            color: "rgba(124, 77, 255, 0.5)", // Morado neón
            animation: "float 5s infinite ease-in-out",
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
              "50%": { transform: "translateY(-15px) rotate(-10deg)" },
            },
          }}
        />
        <Forum
          sx={{
            position: "absolute",
            top: "30%",
            right: "8%",
            fontSize: 40,
            color: "rgba(33, 150, 243, 0.4)", // Azul neón más tenue
            animation: "float 7s infinite ease-in-out",
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
              "50%": { transform: "translateY(-10px) rotate(5deg)" },
            },
          }}
        />
        <SmartToy
          sx={{
            position: "absolute",
            bottom: "35%",
            left: "15%",
            fontSize: 45,
            color: "rgba(124, 77, 255, 0.4)", // Morado neón más tenue
            animation: "float 8s infinite ease-in-out",
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
              "50%": { transform: "translateY(-12px) rotate(-5deg)" },
            },
          }}
        />
        <ChatBubbleOutline
          sx={{
            position: "absolute",
            top: "25%",
            left: "25%",
            fontSize: 35,
            color: "rgba(33, 150, 243, 0.3)", // Azul neón más tenue
            animation: "float 9s infinite ease-in-out",
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
              "50%": { transform: "translateY(-15px) rotate(8deg)" },
            },
          }}
        />

        <StyledCard sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              textAlign: "center",
              background: "0 4px 12px rgba(0, 0, 0, 0.3)", // Azul neón
              color: "#fff",
              p: 2,
              borderRadius: "12px 12px 0 0",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <SmartToy sx={{ fontSize: 32 }} />
            <Typography variant="h5" fontWeight="bold">
              ChatBox
            </Typography>
          </Box>

          <StyledChatContent ref={chatMessagesRef}>
            {messages.map((msg, index) => (
              <StyledMessage key={index} sender={msg.sender}>
                {msg.sender === "bot" && (
                  <Avatar sx={{ bgcolor: "#00e676", width: 32, height: 32 }}>
                    <SmartToy fontSize="small" />
                  </Avatar>
                )}
                {renderMessageContent(msg.text)}
              </StyledMessage>
            ))}
          </StyledChatContent>

          <Box sx={{ display: "flex", alignItems: "center", mt: 2, px: 1 }}>
            <StyledTextField
              fullWidth
              variant="outlined"
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <IconButton
              onClick={sendMessage}
              sx={{
                ml: 1,
                background: "linear-gradient(135deg, #00e676 0%, #00c853 100%)", // Verde neón
                color: "#fff",
                p: 1.5,
                "&:hover": {
                  background: "linear-gradient(135deg, #00d066 0%, #00b34a 100%)",
                },
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Send size={24} />
            </IconButton>
          </Box>
        </StyledCard>
      </Box>
    </Fade>
  );
};

export default ChatGPT;