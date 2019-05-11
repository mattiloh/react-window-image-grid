import styled from "styled-components";

export default styled.div`
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid pink;
  flex-basis: ${props => props.width}%;
  flex-grow: 0;
`;
