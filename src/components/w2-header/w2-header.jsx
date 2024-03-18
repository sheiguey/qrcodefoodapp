import ChevronLeft from "../../assets/icons/chevron-left";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import classes from "./w2-header.module.css";
import PhoneOutlined from "../../assets/icons/phone-outlined";
import Magnifier from "../../assets/icons/magnifier";
import { useLocation, useNavigate } from "react-router-dom";
export const W2Header = ({type}) => {
  const navigate = useNavigate();
  const {search} = useLocation();
  return (
    <div className={classes.wrapper}>
      <Container maxWidth="sm" className={classes.container}>
        <button onClick={() => navigate(-1)} className={classes.button}>
          <ChevronLeft />
          Back
        </button>
        <div className={classes.actions}>
          <IconButton>
            <PhoneOutlined />
          </IconButton>
      
          <IconButton onClick={() => navigate({pathname: `/${type}/search`, search})}>
            <Magnifier />
          </IconButton>
        </div>
      </Container>
    </div>
  );
};

export default W2Header;
