import React, { useState, useCallback, Fragment } from "react";
import { render } from "react-dom";
import AutoSizer from "react-virtualized-auto-sizer";
import ImageGrid from "./components/ImageGrid";
import Container from "./components/Container";
import "./styles.css";
import SquareBox from "./components/SquareBox";
import Image from "./components/Image";
import Navigation from "./components/Navigation";

const COLUMN_WIDTHS = [150, 250, 400];
const NUM_ITEMS = 1000;
const initialItems = Array(NUM_ITEMS)
  .fill(0)
  .map((_, i) => ({
    id: i,
    name: i + 1
  }));

const shuffleArray = arr => [...arr.sort(() => Math.random() - 0.5)];

const Example = () => {
  const [items, setItems] = useState(initialItems);
  const [columnWidthLevel, setColumnWidthLevel] = useState(0);
  const shuffleOrder = useCallback(() => {
    const newItems = shuffleArray(items);
    setItems(newItems);
  }, [items]);
  return (
    <AutoSizer>
      {({ height, width }) => {
        return (
          <Fragment>
            <Navigation>
              <button
                disabled={columnWidthLevel >= 2}
                onClick={() => setColumnWidthLevel(columnWidthLevel + 1)}
              >
                +
              </button>
              <button
                disabled={columnWidthLevel <= 0}
                onClick={() => setColumnWidthLevel(columnWidthLevel - 1)}
              >
                -
              </button>
            </Navigation>
            <ImageGrid
              columnWidth={COLUMN_WIDTHS[columnWidthLevel]}
              controlHeight={40}
              height={height}
              width={width}
              itemCount={items.length}
            >
              {({ index, width, height }) => {
                //const row = items.slice(index * columns, (index + 1) * columns);
                const data = items[index];
                return (
                  <Container key={data.id} width={width}>
                    <SquareBox>
                      <Image onClick={shuffleOrder}>{data.name}</Image>
                    </SquareBox>
                  </Container>
                );
              }}
            </ImageGrid>
          </Fragment>
        );
      }}
    </AutoSizer>
  );
};

render(<Example />, document.getElementById("root"));
