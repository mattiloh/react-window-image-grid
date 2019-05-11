import styled from "styled-components";
export default styled.div`
  position: relative;
  &::before {
    display: block;
    content: "";
    width: 100%;
    padding-top: 100%;
  }
  > * {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
`;
