import { useContext } from "react";
import { BulkSelectionContext } from "../BulkSelectionProvider";

// Hook for bulk selection master controls and consumers.
// It provides the number and the array of selected items (ids)
// and all necessary master handlers.
export default function useBulkSelection() {
  const context = useContext(BulkSelectionContext);
  if (!context) {
    throw new Error(
      "useCouseBulkSelectionunt must be used within a BulkSelectionContext"
    );
  }
  const { clear, selection, selectAll } = context;
  const getSelection = () => Array.from(selection);
  return {
    clear,
    selectAll,
    getSelection,
    selectionSize: selection.size
  };
}
