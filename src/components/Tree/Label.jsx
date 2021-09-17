import styled from "styled-components";

const StyledLabel = styled.div`
  display: flex;
  align-items: center;
  padding: 2px 4px;
  width: fit-content;
  cursor: pointer;

  span {
    font-size: 1.5rem;
    margin-left: 5px;
  }

  :hover {
    box-shadow: 8px 8px 12px 0 rgba(0, 0, 0, 0.25),
      -4px -4px 4px 0 rgba(255, 255, 255, 0.3);
    border-radius: 10px;
  }
`;

export default StyledLabel;
