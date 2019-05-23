import styled from "styled-components";
import {
  SELECTED,
  SHIFT_DESELECT_PREVIEW,
  NOT_SELECTED
} from "../../../BulkSelectionContext";

const colors = {
  [SELECTED]: "#fff",
  [SHIFT_DESELECT_PREVIEW]: "#000",
  [NOT_SELECTED]: "#000"
};

export default styled.div`
  padding-top: 17px;
  font-weight: bold;
  color: ${props => colors[props.selected]};
  user-select: none;
`;
