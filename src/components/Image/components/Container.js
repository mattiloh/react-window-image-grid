import styled from "styled-components";
import {
  SELECTED,
  SHIFT_DESELECT_PREVIEW,
  NOT_SELECTED
} from "../../BulkSelection";

const backgroundColors = {
  [SELECTED]: "#000",
  [SHIFT_DESELECT_PREVIEW]: "#ccc",
  [NOT_SELECTED]: "#fff"
};

const borderColors = {
  [SELECTED]: "#fff",
  [SHIFT_DESELECT_PREVIEW]: "#000",
  [NOT_SELECTED]: "#000"
};

export default styled.div.attrs(({ selected }) => ({
  backgroundColor: backgroundColors[selected],
  borderColor: borderColors[selected]
}))`
  padding: 10px;
  box-sizing: border-box;
  background-color: ${props => props.backgroundColor};
  border: 2px solid ${props => props.borderColor};
  flex-basis: ${props => props.width}%;
  flex-grow: 0;
`;
