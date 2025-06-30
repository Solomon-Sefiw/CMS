import { Avatar, Box, Typography, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { useCallback } from "react";
import { useAddUserPhotoMutation, UserDto } from "../../app/store";
import { useAlert } from "../../features/notification/useAlert";
import { DocumentUpload } from "../../components";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

interface EmployeePhotoProps {
  user?: UserDto;
}

export const UserPhoto = ({ user }: EmployeePhotoProps) => {
  const [savePhoto, { isLoading }] = useAddUserPhotoMutation();
  const { showErrorAlert, showSuccessAlert } = useAlert();

  // Callback to handle profile picture upload
  const onProfilePictureAdd = useCallback(
    (files: File[]) => {
      if (user?.id && files.length) {
        const file = files[0];

        // Validate file type (only images)
        if (!file.type.startsWith("image/")) {
          showErrorAlert("Please upload a valid image file.");
          return;
        }

        // Trigger photo upload mutation
        savePhoto({
          id: user.id,
          body: { file },
        })
          .unwrap()
          .then(() => showSuccessAlert("Photo uploaded successfully."))
          .catch(() => showErrorAlert("An error occurred while uploading the photo."));
      }
    },
    [savePhoto, user?.id, showErrorAlert, showSuccessAlert]
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
      {/* Avatar */}
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
        {/* Show loading indicator while uploading */}
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

      {/* Document Upload with Icon */}
      <DocumentUpload
        onAdd={onProfilePictureAdd}
        label={user?.photoUrl ? "Change Photo" : "Upload Photo"}
        startIcon={<PhotoCameraIcon fontSize="small" />}
        showIcon={false}
        size="small"
        accepts={["Image", "PDF"]} // Accept image and PDF
        disabled={isLoading} // Disable when uploading
      />
    </Box>
  );
};
