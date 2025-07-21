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
          <Typography variant="body2">www.ethiopian.cms.com</Typography>
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
          <Typography variant="body2">www.berhanbanksc.com</Typography>
        </Box>
      </Paper>
    </Box>
  );
};
