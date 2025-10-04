

import { List, ListItem, ListItemText, Divider, Typography, Box, Avatar, Badge, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks";
import { useGetUserConversationsQuery } from "../../app/api/HCMSApi";

export default function ChatList() {
  const user = useAuth();
  const { data: conversations } = useGetUserConversationsQuery({ userId: user.user?.id ?? undefined });
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column", // Mobile-first, stack on small screens
        height: "100vh",
        bgcolor: isDarkMode ? "#121212" : "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        padding: "8px", // Added padding for better spacing
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: "100%", // Full width for small screens
          overflowY: "auto",
          borderBottom: isDarkMode ? "1px solid #333" : "1px solid #e0e0e0", // Border for separation
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: isDarkMode ? "#fff" : "#333" }}>
          Messages
        </Typography>

        {conversations && conversations.length > 0 ? (
          <List sx={{ paddingLeft: 0, marginBottom: "16px" }}>
            {conversations.map((chat) => {
              const lastMessage = chat.lastMessage ? chat.lastMessage : "";

              
              // If the last message contains HTML tags (like <img> for images)
              const sanitizedMessage = lastMessage && lastMessage.includes("<img")
                ? (
                    <Typography
                      sx={{
                        color: isDarkMode ? "#ccc" : "#666",
                        fontSize: "0.9rem",
                        maxWidth: "250px", // Limit message width
                        display: "inline-block",
                        lineHeight: "1.2em",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        verticalAlign: "middle", // Ensure alignment
                        maxHeight: "1.2em", // Constrain the height for a single line of content
                      }}
                      dangerouslySetInnerHTML={{ __html: lastMessage }}
                    />
                  ) : (
                    <Typography sx={{
                        color: isDarkMode ? "#ccc" : "#666",
                        fontSize: "0.9rem",
                        maxWidth: "250px", // Same width limit for plain text
                        display: "inline-block",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        verticalAlign: "middle", // Ensure alignment
                    }}
                      dangerouslySetInnerHTML={{ __html: lastMessage }}
                    />
                  );

              return (
                <div key={chat.chatPartnerId}>
                  <ListItem
                    component={Link}
                    to={`/chat/${chat.chatPartnerId}`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "8px",
                      marginBottom: "12px", // Added margin for spacing
                      padding: "8px 12px", // Adjusted padding for compactness
                      transition: "all 0.3s ease",
                      height: "56px", // Set a fixed height for the entire item to keep it single-line
                      "&:hover": {
                        backgroundColor: isDarkMode ? "#444" : "#f1f1f1", // Slight change for hover effect
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      badgeContent={null}
                    >
                      <Avatar alt={chat.chatPartnerName ?? ""} sx={{ width: 40, height: 40, marginRight: "16px" }} />
                    </Badge>

                    <ListItemText
                      primary={<Typography sx={{ fontWeight: "bold", color: isDarkMode ? "#fff" : "#333" }}>{chat.chatPartnerName}</Typography>}
                      secondary={
                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", maxWidth: "calc(100% - 56px)" }}>
                          {sanitizedMessage}
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider sx={{ borderColor: isDarkMode ? "#333" : "#e0e0e0" }} />
                </div>
              );
            })}
          </List>
        ) : (
          <Typography sx={{ color: isDarkMode ? "#ccc" : "#666", padding: "16px" }}>
            No conversations yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
