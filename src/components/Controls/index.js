import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import Container from "./Container";
import Input from "./Input";
import { useBulkSelection } from "../BulkSelection";

const Controls = ({
  changeNumItems,
  decreaseSize,
  increaseSize,
  isMaxSize,
  isMinSize,
  numItems,
  shuffleOrder
}) => {
  const [numValue, setNumValue] = useState(numItems);
  const onChangeNumValue = useCallback(
    e => {
      setNumValue(e.target.value);
      changeNumItems(e.target.value);
    },
    [changeNumItems]
  );
  const {
    clear: clearSelection,
    selectAll,
    selectionSize
  } = useBulkSelection();
  return (
    <Container>
      <strong>Size</strong>
      <span>
        <button disabled={isMaxSize} onClick={increaseSize}>
          +
        </button>
        <button disabled={isMinSize} onClick={decreaseSize}>
          -
        </button>
      </span>
      <strong>Order</strong>
      <button onClick={shuffleOrder}>Shuffle</button>
      <span>
        Number of items: <Input onChange={onChangeNumValue} value={numValue} />
      </span>
      <strong>Selection ({selectionSize})</strong>
      <button onClick={clearSelection}>clear</button>
      <button onClick={selectAll}>all</button>
      <a href="https://codesandbox.io/s/imagegrid-with-padding-m6n0n">Code</a>
    </Container>
  );
};

Controls.propTypes = {
  decreaseSize: PropTypes.func.isRequired,
  increaseSize: PropTypes.func.isRequired,
  isMaxSize: PropTypes.bool.isRequired,
  isMinSize: PropTypes.bool.isRequired,
  shuffleOrder: PropTypes.func.isRequired
};

export default Controls;
