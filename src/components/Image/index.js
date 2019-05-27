import React, { memo, useCallback } from "react";
import Container from "./components/Container";
import SquareBox from "./components/SquareBox";
import Caption from "./components/Caption";
import ColorTile from "./components/ColorTile";
import { useSelectable, SELECTED } from "../BulkSelection";

// Keep image separated as memoized component to avoid re-renders
// due to selection changes.
const Image = memo(
  ({ data, width, dataLength, selected, toggleSelect, onHover }) => (
    <Container
      width={width}
      selected={selected}
      onClick={toggleSelect}
      onMouseEnter={onHover}
    >
      <SquareBox>
        <ColorTile hue={(360 / dataLength) * data.id} />
      </SquareBox>
      <Caption selected={selected}># {data.name}</Caption>
    </Container>
  )
);

export default ({ index, data, width, dataLength }) => {
  const { selected, shiftSelected, toggleSelect, shiftSelect } = useSelectable(
    data.id,
    index
  );

  return (
    <Image
      data={data}
      dataLength={dataLength}
      width={width}
      selected={shiftSelected || selected}
      toggleSelect={toggleSelect}
      onHover={shiftSelect}
    />
  );
};
