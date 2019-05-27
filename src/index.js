import React, { useState, useCallback } from "react";
import { render } from "react-dom";
import "./styles.css";
import List from "./List";
import { BulkSelectionProvider } from "./components/BulkSelection";
const NUM_ITEMS = 1000;
const createItems = num =>
  Array(num)
    .fill(0)
    .map((_, i) => ({
      id: i,
      name: i + 1
    }));

const shuffleArray = arr => [...arr.sort(() => Math.random() - 0.5)];

const App = () => {
  const [items, setItems] = useState(createItems(NUM_ITEMS));
  const changeNumItems = useCallback(
    num => {
      setItems(createItems(parseInt(num, 10)));
    },
    [setItems]
  );
  const shuffleOrder = useCallback(() => {
    const newItems = shuffleArray(items);
    setItems(newItems);
  }, [items]);
  const getItemId = useCallback(item => String(item.id), []);

  return (
    <BulkSelectionProvider getItemId={getItemId} data={items}>
      <List
        items={items}
        changeNumItems={changeNumItems}
        shuffleOrder={shuffleOrder}
      />
    </BulkSelectionProvider>
  );
};

render(<App />, document.getElementById("root"));
