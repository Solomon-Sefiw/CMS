import { Avatar, Box, Typography, CircularProgress } from "@mui/material";
import { useCallback } from "react";
import { useAddUserPhotoMutation, UserDto } from "../../app/store";
import { useAlert } from "../../features/notification/useAlert";
import { DocumentUpload } from "../../components";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

interface UserPhotoProps {
  user?: UserDto;
  onPhotoUploaded?: () => void;
}

export const UserPhoto = ({ user, onPhotoUploaded }: UserPhotoProps) => {
  const [savePhoto, { isLoading }] = useAddUserPhotoMutation();
  const { showErrorAlert, showSuccessAlert } = useAlert();

  const onProfilePictureAdd = useCallback(
    (files: File[]) => {
      if (!user?.id || files.length === 0) {
        showErrorAlert("User ID or file missing.");
        return;
      }
      const file = files[0];

      if (!file.type.startsWith("image/")) {
        showErrorAlert("Please upload a valid image file.");
        return;
      }

      savePhoto({
        id: user.id,
        body: { file },
      })
        .unwrap()
        .then(() => {
          showSuccessAlert("Photo uploaded successfully.");
          onPhotoUploaded?.();
        })
        .catch((error) => {
          console.error("Photo upload error:", error);
          showErrorAlert((error as any)?.data?.detail || "An error occurred while uploading the photo.");
        });
    },
    [savePhoto, user?.id, showErrorAlert, showSuccessAlert, onPhotoUploaded]
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        mt: 2,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: 110,
          height: 110,
        }}
      >
        <Avatar
          src={user?.photoUrl || undefined}
          alt={`Profile of ${user?.firstName || "employee"}`}
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: 2,
            border: "2px solid #ddd",
            boxShadow: 2,
            transition: "transform 0.3s",
            ":hover": {
              transform: "scale(1.05)",
            },
          }}
        />
        {isLoading && (
          <CircularProgress
            size={24}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "-12px",
              marginLeft: "-12px",
            }}
          />
        )}
      </Box>

      <DocumentUpload
        onAdd={onProfilePictureAdd}
        label={user?.photoUrl ? "Change Photo" : "Upload Photo"}
        startIcon={<PhotoCameraIcon fontSize="small" />}
        showIcon={false}
        size="small"
        accepts={["Image"]}
        disabled={isLoading}
      />
    </Box>
  );
};