import { Avatar, Box } from "@mui/material";
import { useCallback } from "react";
import { useAlert } from "../../features/notification";
import { usePermission } from "../../hooks";
import { DocumentUpload } from "../../components";
import { useAddUserPhotoMutation, UserDto } from "../../app/store";

interface UserPhotoProps {
  employee?: UserDto;
}

export const UserPhoto = ({ employee }: UserPhotoProps) => {
  const permissions = usePermission();
  const { showErrorAlert, showSuccessAlert } = useAlert();
  const [savePhoto, { isLoading }] = useAddUserPhotoMutation();

  const onProfilePictureAdd = useCallback(
    (files: File[]) => {
      if (!employee?.id || !files?.length) return;

      const file = files[0];

      const formData = new FormData();
      formData.append("File", file);
console.log(employee.id,file)
      savePhoto({ id: employee.id, body: { file } })
        .unwrap()
        .then(() => {
          showSuccessAlert("Photo uploaded successfully.");
        })
        .catch(() => {
          showErrorAlert("An error occurred while uploading the photo.");
        });
    },
    [employee?.id, savePhoto, showErrorAlert, showSuccessAlert]
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <Avatar
        sx={{ width: 100, height: 100 }}
        src={employee?.photoUrl || undefined}
        alt={employee?.firstName || "User"}
        variant="rounded"
      />

      <DocumentUpload
        onAdd={onProfilePictureAdd}
        label={employee?.photoUrl ? "Change Photo" : "Add Photo"}
        showIcon={false}
        size="small"
        accepts={["Image"]}
        disabled={isLoading}
      />
    </Box>
  );
};
