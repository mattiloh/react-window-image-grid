import React, { useMemo, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { VariableSizeList as List } from "react-window";
import Row from "./Row";

const ImageGrid = ({
  children,
  columnWidth,
  controlHeight,
  itemCount,
  height,
  paddingBottom,
  paddingTop,
  width
}) => {
  // We need a ref to List to access its methods.
  const listRef = useRef();
  // The next two refs are needed to keep the current
  // images on screen when the number of columns changes.
  // The current row index is updated on every scroll event.
  // The previous number of columns is set when the number of
  // columns changes.
  const currentIndex = useRef();
  const prevNumColumns = useRef();

  // Calculate number of columns based on list-width and
  // target column-width.
  const numColumns = useMemo(() => Math.floor(width / columnWidth), [
    columnWidth,
    width
  ]);

  // Calculate number of rows based on number of columns
  // and number of items.
  const numRows = useMemo(() => Math.ceil(itemCount / numColumns), [
    itemCount,
    numColumns
  ]);

  // Calculate row height based on column width and controlHeight.
  const rowHeight = useMemo(() => width / numColumns + controlHeight, [
    width,
    numColumns,
    controlHeight
  ]);

  // List padding is created by adding dummy rows at the top
  // and the bottom of the list. This method returns the respective
  // height for padding and regular content rows.
  const getRowHeight = index => {
    if (index === 0) return paddingTop;
    if (index === numRows + 1) return paddingBottom;
    return rowHeight;
  };

  // The following effect is called as soon as the list's width or
  // the number of columns change.
  // <VariableSizeList> caches row-heights based on indices.
  // If the number of columns or list-width changes, this
  // cache needs to be reset. Apart from that, this effect
  // helps to maintain the current position in the image grid,
  // if the number of columns changes.
  useEffect(() => {
    if (listRef.current && prevNumColumns.current) {
      // Reset cache and force re-render.
      listRef.current.resetAfterIndex(0, true);
      // Scroll to to row, that displays the images
      // that had been on screen before the resize.
      listRef.current.scrollToItem(
        Math.round(
          (currentIndex.current * prevNumColumns.current) / numColumns
        ),
        "start"
      );
    }

    // Update prevNumColumns.
    if (prevNumColumns.current !== numColumns) {
      prevNumColumns.current = numColumns;
    }
  }, [width, numColumns]);
  return (
    <List
      ref={listRef}
      height={height}
      itemCount={numRows + 2}
      itemSize={getRowHeight}
      estimatedItemSize={rowHeight}
      width={width}
      onItemsRendered={({ visibleStartIndex }) => {
        currentIndex.current = visibleStartIndex;
      }}
    >
      {({ index, style }) => {
        // Return padding rows (first and last).
        if (index === 0 || index === numRows + 1) {
          return <Row style={style} />;
        }

        // The index contains dummy rows for top and bottom padding.
        // We need to reduce it by one to normalize the index
        // for data access.
        const dataIndex = index - 1;
        const columnIndices = Array(
          Math.min(numColumns, itemCount - dataIndex * numColumns)
        )
          .fill(dataIndex * numColumns)
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
  paddingBottom: PropTypes.number,
  paddingTop: PropTypes.number,
  width: PropTypes.number.isRequired
};

ImageGrid.defaultProps = {
  columnWidth: 150,
  controlHeight: 0,
  paddingBottom: 0,
  paddingTop: 0,
  height: 600,
  width: 600
};

export default ImageGrid;
