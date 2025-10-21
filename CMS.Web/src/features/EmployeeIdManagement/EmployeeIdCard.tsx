// EmployeeIDCard.tsx
import { Box, Paper, Typography } from "@mui/material";
import { EmployeeDto } from "../../app/api/HCMSApi";
// import BrhanLogo from "../../assets/Brhanlogo.png";
// import logoTwo from "../../assets/logoTwo.png";
import BrhanLogo from "../../images/image.png";
import logoTwo from "../../images/image.png";

interface Props {
  employee: EmployeeDto;
  issueDate: string;
}

export const EmployeeIdCard = ({ employee, issueDate }: Props) => {
  return (
    <Box
      id="id-card-content"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        p: 2,
      }}
    >
      <Paper
        className="id-card-front"
        sx={{
          width: "100mm",
          height: "130mm",
          p: 0,
          border: "1px solid #000",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          overflow: "hidden",
          textAlign: "center",
          pageBreakAfter: "always",
        }}
      >
        <Box
          component="img"
          src={BrhanLogo}
          alt="Company Logo"
          sx={{
            height: "30mm",
            mb: 1,
            align: "center",
            maxWidth: "100%",
          }}
        />
        <Box
          sx={{
            width: "100mm",
            height: "50mm",
            border: "1px solid #ccc",
            backgroundColor: "#f5f5f5",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
            padding: "15px",
          }}
        >
          {employee?.photoUrl ? (
            <Box
              component="img"
              src={employee.photoUrl}
              alt="Employee"
              sx={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <Typography variant="caption">No Photo</Typography>
          )}
        </Box>
        <Typography variant="subtitle2" fontWeight="bold">
          {employee?.displayName || "Employee Name"}
        </Typography>
        {employee?.amharicDisplayName && (
          <Typography variant="subtitle2" fontWeight="bold">
            {employee?.amharicDisplayName || "Employee Amharic Name"}
          </Typography>
        )}
        <Typography variant="body2">Tel: 0116-185732</Typography>
        <Typography variant="caption">P.O.Box 387 Code 1110</Typography>
        <Typography variant="body2">Addis Ababa, Ethiopia</Typography>
        <Typography variant="body2">info@ethiopiancourt.com</Typography>
        <Typography></Typography>
        <Box
          sx={{
            width: "100%",
            height: "10mm",
            backgroundColor: "#0a3d52",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body2">www.ethiopianCourt.com</Typography>
        </Box>
      </Paper>
      <Paper
        className="id-card-back"
        sx={{
          width: "100mm",
          height: "130mm",
          p: 0,
          border: "1px solid #000",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // Don't space-between, so content flows top-to-bottom
          alignItems: "center",
          boxSizing: "border-box",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        {/* Text Section */}
        <Box sx={{ paddingTop: "30px" }}>
          <Typography>We hereby certify that the bearer of this ID</Typography>
          <Typography>card is an employee of ethiopian court</Typography>
          <Typography>ይህን መታወቂያ ካርድ የያዙ ግለሰብ የኢትዮጲያ </Typography>
          <Typography>ፍርድ ቤት ሰራተኛ መሆናቸውን እናረጋግጣለን።</Typography>
        </Box>

        <Box
          sx={{
            position: "relative",
            mt: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            border: "3px solid #1976d2",
            backgroundColor: "#fff",
          }}
        >
          {/* Top Curved Text */}
          <svg
            width="160"
            height="160"
            viewBox="0 0 300 300"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
            }}
          >
            <defs>
              <path
                id="topCurve"
                d="M 40,140 A 100,100 0 0,1 260,140"
                fill="none"
              />
            </defs>
            <text
              fontSize="18"
              fontWeight="bold"
              fill="#000"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              <textPath href="#topCurve" startOffset="50%">
                የኢትዮጲያ ፍርድ ቤት
              </textPath>
            </text>
          </svg>

          <Box
            sx={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              border: "1px solid #1976d2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
              zIndex: 2,
            }}
          >
            <Box
              component="img"
              src={logoTwo}
              alt="Company Logo"
              sx={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
              }}
            />
          </Box>

          <svg
            width="160"
            height="160"
            viewBox="0 0 160 160"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
            }}
          >
            <defs>
              <path
                id="bottomCurve"
                d="M 30,90 A 50,50 0 0,0 130,80"
                fill="none"
              />
            </defs>
            <text
              fontSize="14"
              fontWeight="bold"
              fill="#000"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              <textPath href="#bottomCurve" startOffset="50%">
               Ethiopian Court
              </textPath>
            </text>
          </svg>
        </Box>

        <Box sx={{ paddingTop: "20px", textAlign: "left", px: 2 }}>
          <Typography>የተሰጠበት ቀን </Typography>
          <Typography>Date Issued: {issueDate}</Typography>
          <Typography>የሰራተኛው ፊርማ:</Typography>
          <Typography>Employee Signature: ______________</Typography>
          <Typography>የባለስልጣን ፊርማ:</Typography>
          <Typography>Authorized Signature: ______________</Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "10mm",
            backgroundColor: "#0a3d52",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body2">www.ethiopianCourt.com</Typography>
        </Box>
      </Paper>
    </Box>
  );
};

// import { Box, Typography, Paper, Divider } from "@mui/material";
// import { EmployeeDto } from "../../app/api/HCMSApi";
// import logo from "../../images/823a89f4-cd31-4d5a-9124-d3705cf35cc3.png";

// interface Props {
//   employee: EmployeeDto;
//   issueDate: string;
//   validUntil: string;
// }

// export const EmployeeIDCard = ({ employee, issueDate, validUntil }: Props) => {
//   return (
//     <Box
//       id="employee-id-card"
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         gap: 4,
//         p: 2,
//         backgroundColor: "#f2f6f7",
//       }}
//     >
//       {/* FRONT SIDE */}
//       <Paper
//         elevation={3}
//         sx={{
//           width: "85.6mm",
//           height: "54mm",
//           borderRadius: 2,
//           overflow: "hidden",
//           display: "flex",
//           flexDirection: "column",
//           position: "relative",
//           backgroundColor: "#ffffff",
//         }}
//       >
//         {/* Header Background */}
//         <Box
//           sx={{
//             backgroundColor: "#004a64",
//             height: "35%",
//             color: "white",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             p: 1,
//           }}
//         >
//           <Box
//             component="img"
//             src={logo}
//             alt="Organization Logo"
//             sx={{ width: "40px", height: "40px", mb: 0.5 }}
//           />
//           <Typography fontSize={10} fontWeight={600}>
//             የአማራ ክልል መንግሥት
//           </Typography>
//           <Typography fontSize={9}>ከፍተኛ ፍርድ ቤት</Typography>
//         </Box>

//         {/* Photo + Info */}
//         <Box
//           sx={{
//             flex: 1,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: 0.4,
//             p: 1.2,
//           }}
//         >
//           <Box
//             component="img"
//             src={employee?.photoUrl || "/no-photo.png"}
//             alt="Employee"
//             sx={{
//               width: "55px",
//               height: "55px",
//               borderRadius: "50%",
//               border: "2px solid #004a64",
//               objectFit: "cover",
//             }}
//           />
//           <Typography fontSize={11} fontWeight="bold" sx={{ mt: 0.5 }}>
//             {employee?.amharicDisplayName || "ዮዲት ደበበ"}
//           </Typography>
//           <Typography fontSize={10} color="#004a64">
//             {employee?.displayName || "Yodit Debebe"}
//           </Typography>
//           <Typography fontSize={9}>
//             {employee?.jobTitle || "GENERAL MANAGER"}
//           </Typography>
//           <Typography fontSize={8} mt={0.3}>
//             ID NO: {employee?.id || "0001"}
//           </Typography>
//         </Box>

//         {/* Footer */}
//         <Box
//           sx={{
//             backgroundColor: "#004a64",
//             height: "12%",
//             color: "white",
//             textAlign: "center",
//             fontSize: "8px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           www.asc.com
//         </Box>
//       </Paper>

//       {/* BACK SIDE */}
//       <Paper
//         elevation={3}
//         sx={{
//           width: "85.6mm",
//           height: "54mm",
//           borderRadius: 2,
//           overflow: "hidden",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "space-between",
//           backgroundColor: "#ffffff",
//         }}
//       >
//         <Box sx={{ p: 1.2 }}>
//           <Typography fontSize={8} mb={0.3}>
//             ስልክ ቁጥር (Phone Number)
//           </Typography>
//           <Typography fontSize={8} fontWeight="bold">
//             {employee?.contact?.value || "+251 900 000 000"}
//           </Typography>

//           <Typography fontSize={8} mt={0.8}>
//             የደም ቡድን (Blood Type)
//           </Typography>
//           <Typography fontSize={8} fontWeight="bold">
//             {employee?.hasAddressInfo ? "A+" : "A+"}
//           </Typography>

//           <Typography fontSize={8} mt={0.8}>
//             አደጋ ጊዜ ያገኙት (Emergency Contact)
//           </Typography>
//           <Typography fontSize={8} fontWeight="bold">
//             {employee?.hasEmergencyContactInfo ? "+251 900 000 000" : "+251 900 000 000"}
//           </Typography>

//           <Typography fontSize={8} mt={0.8}>
//             የኩባንያ ስልክ (Company Phone Number)
//           </Typography>
//           <Typography fontSize={8} fontWeight="bold">
//             +251 900 000 000
//           </Typography>

//           <Typography fontSize={8} mt={0.8}>
//             የኩባንያ አድራሻ (Company Address)
//           </Typography>
//           <Typography fontSize={8} fontWeight="bold" lineHeight={1.3}>
//             Amhara Regional State Supreme Court,
//             <br />
//             Bahir Dar, Ethiopia
//           </Typography>
//         </Box>

//         <Divider sx={{ borderColor: "#004a64", opacity: 0.2 }} />

//         <Box sx={{ px: 1.2, pb: 0.8 }}>
//           <Typography fontSize={8}>
//             የተፈቀደ ፊርማ (Authorized Signature)
//           </Typography>
//           <Typography
//             fontSize={9}
//             fontStyle="italic"
//             fontWeight="bold"
//             mt={0.4}
//           >
//             ______________________
//           </Typography>

//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               mt: 0.8,
//             }}
//           >
//             <Box>
//               <Typography fontSize={7}>Issued: {issueDate}</Typography>
//               <Typography fontSize={7}>Valid Until: {validUntil}</Typography>
//             </Box>
//             <Box
//               component="img"
//               src={logo}
//               alt="Logo"
//               sx={{ width: "28px", height: "28px", opacity: 0.5 }}
//             />
//           </Box>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

