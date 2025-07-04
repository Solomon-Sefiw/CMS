import { Box, styled } from "@mui/material";
//import { useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import { useNavigate } from "react-router-dom";

export const Logo = ({ height }: { height?: number }) => {
  const navigate = useNavigate();

  return (
    <LogoContainer
      component="img"
      height={height !== undefined ? height : "unset"}
      src={logo}
      alt="CMS logo."
      onClick={() => {
        navigate("/");
      }}
    />
  );
};

const LogoContainer = styled(Box<"img">)({
  maxWidth: "60%",
  cursor: "pointer",
  padding : 20
});
