import React, { useState, useCallback, Fragment } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import ImageGrid from "./components/ImageGrid";
import Controls from "./components/Controls";
import Image from "./components/Image";

const COLUMN_WIDTHS = [200, 350, 450];

const List = ({ items, shuffleOrder, changeNumItems }) => {
  const [columnWidthLevel, setColumnWidthLevel] = useState(0);
  const increaseSize = useCallback(() => {
    setColumnWidthLevel(
      Math.min(columnWidthLevel + 1, COLUMN_WIDTHS.length - 1)
    );
  }, [columnWidthLevel]);
  const decreaseSize = useCallback(() => {
    setColumnWidthLevel(Math.max(columnWidthLevel - 1, 0));
  }, [columnWidthLevel]);

  return (
    <AutoSizer>
      {({ height, width }) => {
        return (
          <Fragment>
            <Controls
              changeNumItems={changeNumItems}
              numItems={items.length}
              decreaseSize={decreaseSize}
              increaseSize={increaseSize}
              isMaxSize={columnWidthLevel >= COLUMN_WIDTHS.length - 1}
              isMinSize={columnWidthLevel <= 0}
              shuffleOrder={shuffleOrder}
            />
            <ImageGrid
              columnWidth={COLUMN_WIDTHS[columnWidthLevel]}
              controlHeight={40}
              height={height}
              width={width}
              paddingTop={39}
              itemCount={items.length}
            >
              {({ index, width, height }) => {
                const data = items[index];
                return (
                  <Image
                    key={data.id}
                    width={width}
                    data={data}
                    index={index}
                    dataLength={items.length}
                  />
                );
              }}
            </ImageGrid>
          </Fragment>
        );
      }}
    </AutoSizer>
  );
};

export default List;
