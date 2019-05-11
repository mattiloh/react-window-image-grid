import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { FixedSizeList as List } from "react-window";
import Row from "./Row";

const ImageGrid = ({
  children,
  columnWidth,
  controlHeight,
  itemCount,
  height,
  width
}) => {
  const numColumns = useMemo(() => Math.floor(width / columnWidth), [
    columnWidth,
    width
  ]);
  const numRows = useMemo(() => Math.ceil(itemCount / numColumns), [
    itemCount,
    numColumns
  ]);
  const rowHeight = useMemo(() => width / numColumns + controlHeight, [
    width,
    numColumns,
    controlHeight
  ]);
  return (
    <List
      height={height}
      itemCount={numRows}
      itemSize={rowHeight}
      width={width}
    >
      {({ index, style }) => {
        const columnIndices = Array(
          Math.min(numColumns, itemCount - index * numColumns)
        )
          .fill(index * numColumns)
          .map((base, i) => base + i);
        return (
          <Row style={style}>
            {columnIndices.map(columnIndex =>
              children({
                index: columnIndex,
                width: 100 / numColumns,
                height: rowHeight
              })
            )}
          </Row>
        );
      }}
    </List>
  );
};

ImageGrid.propTypes = {
  children: PropTypes.func.isRequired,
  controlHeight: PropTypes.number,
  columnWidth: PropTypes.number,
  itemCount: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};

ImageGrid.defaultProps = {
  columnWidth: 150,
  controlHeight: 0,
  height: 600,
  width: 600
};

export default ImageGrid;
