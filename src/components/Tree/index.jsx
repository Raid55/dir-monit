import { useState } from "react";
import styled from "styled-components";
import { IconContext } from "react-icons";

import Folder from "./Folder";
import File from "./File";

const StyledTree = styled.div`
  line-height: 1.5;
`;

const TreeRecursive = ({ data }) => {
  return data.map((item) => {
    return item.model.dir ? (
      <Folder name={item.model.id} key={item.model.id}>
        {item.children ? <TreeRecursive data={item.children} /> : null}
      </Folder>
    ) : (
      <File name={item.model.id} key={item.model.id} />
    );
  });
};

const Tree = ({ data }) => {
  return (
    <IconContext.Provider value={{ size: "1.5rem" }}>
      <StyledTree>
        <TreeRecursive data={data} />
      </StyledTree>
    </IconContext.Provider>
  );
};

export default Tree;
