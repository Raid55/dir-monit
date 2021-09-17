import { useState } from "react";
import styled from "styled-components";
import { AiOutlineFolder } from "react-icons/ai";

import StyledLabel from "./Label";

const StyledFolder = styled.div`
  padding-left: 20px;
`;

const Collapse = styled.div`
  height: ${(p) => (p.open ? "auto" : "0")};
  overflow: hidden;
  padding-bottom: 6px;
`;

const Folder = ({ name, children }) => {
  const [open, setOpen] = useState(false);

  const handleToggle = (e) => {
    e.preventDefault();
    setOpen(!open);
  };

  return (
    <StyledFolder>
      <StyledLabel onClick={handleToggle}>
        <AiOutlineFolder />
        <span>{name}</span>
      </StyledLabel>
      <Collapse open={open}>{children}</Collapse>
    </StyledFolder>
  );
};

export default Folder;
