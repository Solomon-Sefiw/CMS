import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom"; 
import { skipToken } from "@reduxjs/toolkit/query";
import { Typography, Box, useTheme, CircularProgress, IconButton } from "@mui/material";
import ReactQuill from "react-quill";
import SendIcon from "@mui/icons-material/Send";
import { useAuth } from "../../hooks";
import { useGetMessagesQuery, useMarkMessagesAsReadMutation, useSendMessageMutation } from "../../app/api/HCMSApi";

export default function ChatDetail() {
  const user = useAuth();
  const { chatPartnerId } = useParams<{ chatPartnerId: string }>(); 
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const messagesEndRef = useRef<HTMLDivElement>(null); 

  const { data: messages = [], isLoading, isError, error, refetch } = useGetMessagesQuery(
    chatPartnerId ? { userId: user.user?.id ?? undefined, chatPartnerId: chatPartnerId } : skipToken
  );

  const [sendMessage] = useSendMessageMutation();
  const [markAsRead] = useMarkMessagesAsReadMutation();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (chatPartnerId) {
      markAsRead({ chatPartnerId });
    }
  }, [chatPartnerId, markAsRead]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage({ sendMessageCommand: { senderId: user.user?.id, receiverId: chatPartnerId, content: message } });
      setMessage("");
      refetch();
    }
  };

  if (isError) {
    return <Typography color="error">Failed to load messages: { 'status' in error ? error.status : error.message }</Typography>;
  }

  const handleImageResize = (htmlContent: string) => {
    return htmlContent.replace(/<img[^>]*>/g, (match) => {
      return match.replace('>', ' style="max-width: 300px; height: auto;" />');
    });
  };

  return (
    <Box
      sx={{
        p: 2,
        maxWidth: "700px",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        bgcolor: isDarkMode ? "#121212" : "#fff",
        borderRadius: "12px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          p: 1,
          "::-webkit-scrollbar": { width: "5px" },
          "::-webkit-scrollbar-thumb": { background: "#888", borderRadius: "10px" },
        }}
      >
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: msg.senderId === user.user?.id ? "flex-end" : "flex-start",
                animation: "fadeIn 0.3s ease-in-out",
              }}
            >
              <Typography
                component="div"
                sx={{
                  backgroundColor: msg.senderId === user.user?.id
                    ? isDarkMode
                      ? "#005f56"
                      : "#d1e7dd"
                    : isDarkMode
                    ? "#3b3b3b"
                    : "#f8d7da",
                  padding: "10px 15px",
                  borderRadius: "20px",
                  maxWidth: "75%",
                  color: isDarkMode ? "#fff" : "black",
                  wordBreak: "break-word",
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    backgroundColor: msg.senderId === user.user?.id
                      ? isDarkMode
                        ? "#00897b"
                        : "#b8d6b3"
                      : isDarkMode
                      ? "#5c5c5c"
                      : "#f1c2b5",
                  },
                }}
                dangerouslySetInnerHTML={{
                  __html: handleImageResize(msg.content || "")
                }}
              />
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <ReactQuill
            value={message}
            onChange={setMessage}
            theme="snow"
            placeholder="Type a message..."
            style={{
              backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
              color: isDarkMode ? "#fff" : "#000",
              borderRadius: "8px",
              minHeight: "100px",
            }}
            modules={{
              toolbar: [
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
              ],
            }}
          />
        </Box>

        <IconButton
          onClick={handleSendMessage}
          color="primary"
          sx={{
            backgroundColor: isDarkMode ? "#00897b" : "#00796b",
            borderRadius: "50%",
            padding: "10px",
            "&:hover": { backgroundColor: isDarkMode ? "#00695c" : "#004d40" },
          }}
        >
          <SendIcon sx={{ color: "#fff" }} />
        </IconButton>
      </Box>
    </Box>
  );
}
