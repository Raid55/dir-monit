import styled from "styled-components";
import { AiOutlineFile } from "react-icons/ai";
import {
  DiJavascript,
  DiCss3Full,
  DiHtml5,
  DiReact,
  DiPython,
  DiMarkdown,
} from "react-icons/di";
import StyledLabel from "./Label";

const StyledFile = styled.div`
  padding-left: 20px;
`;

const FILE_ICONS = {
  py: <DiPython />,
  js: <DiJavascript />,
  css: <DiCss3Full />,
  html: <DiHtml5 />,
  jsx: <DiReact />,
  md: <DiMarkdown />,
};

const File = ({ name }) => {
  let ext = name.split(".");
  ext = ext[ext.length - 1];

  return (
    <StyledFile>
      <StyledLabel>
        {FILE_ICONS[ext] || <AiOutlineFile />}
        <span>{name}</span>
      </StyledLabel>
    </StyledFile>
  );
};

export default File;
