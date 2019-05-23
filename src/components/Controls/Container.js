import styled from "styled-components";

export default styled.div`
  padding: 10px;
  box-sizing: border-box;
  position: fixed;
  background-color: #fff;
  border: 2px solid black;
  height: 40px;
  z-index: 1000;

  & > * {
    margin-right: 8px;
  }
`;
