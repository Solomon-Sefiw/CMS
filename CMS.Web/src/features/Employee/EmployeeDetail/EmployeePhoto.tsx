import { Avatar, Box } from "@mui/material";
import { useCallback } from "react";
import { EmployeeDto, useAddEmployeePhotoMutation } from "../../../app/api";
import { useAlert } from "../../notification";
import { DocumentUpload } from "../../../components/DocumentUpload";
import { usePermission } from "../../../hooks";

interface EmployeePhotoProps {
  employee?: EmployeeDto;
}

export const EmployeePhoto = ({ employee }: EmployeePhotoProps) => {
  const permissions = usePermission();
  const [savePhoto, { isLoading }] = useAddEmployeePhotoMutation();
  const { showErrorAlert, showSuccessAlert } = useAlert();

  // Callback to handle profile picture upload
  const onProfilePictureAdd = useCallback(
    (files: any[]) => {
      if (employee?.id && files.length) {
        const formData = new FormData();
        formData.append("file", files[0]); // Append the first file

        savePhoto({
          id: employee.id, // Use the correct employeeId
          body: {
            file: files[0],
          },
        })
          .unwrap()
          .then(() => {
            showSuccessAlert("Photo uploaded successfully.");
          })
          .catch(() => {
            showErrorAlert("An error occurred while uploading the photo.");
          });
      }
    },
    [
      savePhoto,
      employee?.id,
      employee?.id,
      showErrorAlert,
      showSuccessAlert,
    ]
  );

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Avatar
          sx={{ width: 100, height: 100 }}
          src={employee?.photoUrl || undefined}
          alt={employee?.displayName || "Employee"}
          variant="rounded"
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <DocumentUpload
          onAdd={onProfilePictureAdd}
          label={employee?.photoUrl ? "Change photo" : "Add photo"}
          showIcon={false}
          size="small"
          accepts={["Image"]} // Explicitly accept image files
          disabled={isLoading || !permissions.CanCreateOrUpdateEmployeeInfo} // Disable if uploading
        />
      </Box>
    </>
  );
};
