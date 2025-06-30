import { Avatar, Box } from "@mui/material";
import { useCallback } from "react";
import { useAlert } from "../notification";
import { DocumentUpload } from "../../components/DocumentUpload";
import { LetterDto, useAddEmployeePhotoMutation } from "../../app/store";

interface EmployeePhotoProps {
  employee?: LetterDto;
}

export const EmployeePhoto = ({ employee }: EmployeePhotoProps) => {
  const [savePhoto, { isLoading }] = useAddEmployeePhotoMutation();
  const { showErrorAlert, showSuccessAlert } = useAlert();

  // Callback to handle profile picture upload
  const onProfilePictureAdd = useCallback(
    (files: any[]) => {
      if (employee?.id && files.length) {
        const formData = new FormData();
        formData.append("file", files[0]); // Append the first file
      console.log("Uploading photo for employee:", employee.id, files[0]);  
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
          alt={employee?.id ? String(employee.id) : "Employee"}
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
          disabled={isLoading} // Disable if uploading
        />
      </Box>
    </>
  );
};
