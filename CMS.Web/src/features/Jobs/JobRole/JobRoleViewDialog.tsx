// import {
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Button,
//     Typography,
//     Box,
//     Divider,
//     Stack,
//     Paper,
//   } from "@mui/material";
//   import WorkIcon from "@mui/icons-material/Work";
//   import CategoryIcon from "@mui/icons-material/Category";
//   import StarRateIcon from "@mui/icons-material/StarRate";
//   import LocalOfferIcon from "@mui/icons-material/LocalOffer";
//   import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
//   import CloseIcon from "@mui/icons-material/Close";

//   import { JobRoleDto } from "../../../app/api";

//   interface Props {
//     jobRole: JobRoleDto;
//     onClose: () => void;
//   }

//   export const JobRoleViewDialog = ({ jobRole, onClose }: Props) => {
//     return (
//       <Dialog open onClose={onClose} maxWidth="md" fullWidth>
//         <DialogTitle>
//           <Stack direction="row" alignItems="center" spacing={1}>
//             <WorkIcon color="primary" />
//             <Typography variant="h6">Job Role Details</Typography>
//           </Stack>
//         </DialogTitle>

//         <DialogContent dividers>
//           <Stack spacing={2}>
//             <Typography>
//               <CategoryIcon fontSize="small" /> <strong>Role Name:</strong>{" "}
//               {jobRole.roleName}
//             </Typography>
//             <Typography>
//               <CategoryIcon fontSize="small" /> <strong>Category:</strong>{" "}
//               {jobRole.jobCatagory}
//             </Typography>
//             <Typography>
//               <LocalOfferIcon fontSize="small" /> <strong>Role Category:</strong>{" "}
//               {jobRole.jobRoleCatagory}
//             </Typography>
//             <Typography>
//               <StarRateIcon fontSize="small" /> <strong>Grade:</strong>{" "}
//               {jobRole.jobGrade}
//             </Typography>

//             <Divider />

//             <Typography variant="subtitle1" gutterBottom>
//               <MonetizationOnIcon sx={{ verticalAlign: "middle", mr: 0.5 }} />
//               <strong>Benefits</strong>
//             </Typography>

//             {jobRole.benefits?.length ? (
//               <Stack spacing={2}>
//                 {jobRole.benefits.map((benefit, index) => (
//                   <Paper
//                     key={index}
//                     elevation={2}
//                     sx={{ p: 2, backgroundColor: "#f9f9f9", borderRadius: 2 }}
//                   >
//                     {/* Benefit Name Horizontally */}
//                     <Typography
//                       variant="subtitle1"
//                       color="primary"
//                       sx={{ mb: 1, fontWeight: "bold" }}
//                     >
//                       <LocalOfferIcon
//                         fontSize="small"
//                         sx={{ verticalAlign: "middle", mr: 0.5 }}
//                       />
//                       {benefit.benefitName}
//                     </Typography>

//                     {/* Benefit Details Vertically */}
//                     <Stack spacing={0.5} pl={3}>
//                       <Typography>
//                         Value: {benefit.value ?? 0} {benefit.unitOfMeasurementName ?? ""}
//                       </Typography>
//                       {benefit.isUnitPriced &&
//                         typeof benefit.unitPrice === "number" &&
//                         typeof benefit.value === "number" && (
//                           <>
//                             <Typography>Unit Price (ETB): {benefit.unitPrice}</Typography>
//                             <Typography>
//                               Calculated Amount (ETB): {benefit.unitPrice * benefit.value}
//                             </Typography>
//                           </>
//                         )}
//                     </Stack>
//                   </Paper>
//                 ))}
//               </Stack>
//             ) : (
//               <Typography color="textSecondary">No benefits defined.</Typography>
//             )}
//           </Stack>
//         </DialogContent>

//         <DialogActions>
//           <Button
//             onClick={onClose}
//             variant="outlined"
//             color="secondary"
//             startIcon={<CloseIcon />}
//           >
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     );
//   };
import React from "react";

function JobRoleViewDialog() {
  return <div>Hello Job Role</div>;
}

export default JobRoleViewDialog;
