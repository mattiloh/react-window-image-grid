import { useCallback, useContext } from "react";
import { BulkSelectionContext } from "../BulkSelectionProvider";
import { SELECTED, NOT_SELECTED, SHIFT_DESELECT_PREVIEW } from "../constants";
// Hook for selectables. It provides the items selection state
// and all necessary handlers.
export default function useSelectable(id, index) {
  const context = useContext(BulkSelectionContext);
  if (!context) {
    throw new Error(
      "useCouseBulkSelectionunt must be used within a BulkSelectionContext"
    );
  }
  const {
    deselect: deselectDispatcher,
    select: selectDispatcher,
    shiftSelect: shiftSelectHandler,
    toggleSelect: toggleSelectHandler,
    selection,
    shiftPreview,
    isShiftModeSelect,
    shiftPressed
  } = context;
  // is this item part of a shift-selection preview? If so, is
  // it a select or deselect preview?
  const shiftSelected =
    shiftPressed &&
    shiftPreview.has(String(id)) &&
    (isShiftModeSelect ? SELECTED : SHIFT_DESELECT_PREVIEW);

  // is this item selected?
  const selected = selection.has(String(id)) ? SELECTED : NOT_SELECTED;

  // create handler thunks (already using the correct id and index)
  const select = useCallback(() => selectDispatcher(id, index), [
    id,
    index,
    selectDispatcher
  ]);
  const deselect = useCallback(() => deselectDispatcher(id, index), [
    id,
    index,
    deselectDispatcher
  ]);
  const shiftSelect = useCallback(() => shiftSelectHandler(id, index), [
    id,
    index,
    shiftSelectHandler
  ]);

  const toggleSelect = useCallback(() => toggleSelectHandler(id, index), [
    id,
    index,
    toggleSelectHandler
  ]);
  return {
    deselect,
    select,
    shiftSelect,
    toggleSelect,
    selected,
    shiftSelected
  };
}
