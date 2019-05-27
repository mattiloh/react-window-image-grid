import React, { createContext, useCallback, useReducer, useMemo } from "react";
import useKeyHandler from "../../hooks/use-key-handler";
export const BulkSelectionContext = createContext();

const initialState = {
  // store for actually selected items
  selection: new Set(),
  // store for current shif-selection preview
  shiftPreview: new Set(),
  // store pressed state of shift button
  shiftPressed: false,
  // keep track wether shift-selection is for
  // select or deselect
  isShiftModeSelect: true,
  // Keep track of last item that received a
  // select or deselect. This is needed to define
  // the shift-preview set.
  lastInteractionIndex: 0
};

// Slice data with normalized start and end parameters
function getNormalizedSlice(data, start, stop) {
  const from = Math.min(start, stop);
  const to = Math.max(start, stop) + 1;
  return data.slice(from, to);
}

function addToSelection(state, action) {
  const newSelection = state.shiftPressed
    ? new Set([...state.selection, ...state.shiftPreview])
    : new Set([...state.selection, String(action.id)]);
  return {
    selection: newSelection,
    shiftPreview: new Set(),
    lastInteractionIndex: action.index
  };
}

function removeFromSelection(state, action) {
  const newSelection = new Set(state.selection);
  newSelection.delete(String(action.id));
  if (state.shiftPressed) {
    state.shiftPreview.forEach(id => newSelection.delete(String(id)));
  }
  return {
    ...state,
    selection: newSelection,
    shiftPreview: new Set(),
    lastInteractionIndex: action.index
  };
}

const createReducer = getItemId =>
  function selectionReducer(state, action) {
    switch (action.type) {
      case "select":
        return addToSelection(state, action);
      case "deselect":
        return removeFromSelection(state, action);
      case "toggleSelect": {
        const newValue =
          action.value || !state.selection.has(String(action.id));
        return newValue === true
          ? addToSelection(state, action)
          : removeFromSelection(state, action);
      }
      case "selectAll":
        return {
          ...state,
          selection: new Set(action.data)
        };
      case "setShiftPreview":
        return {
          ...state,
          shiftPreview: new Set(
            getNormalizedSlice(
              action.data,
              action.index,
              state.lastInteractionIndex
            ).map(getItemId)
          ),
          isShiftModeSelect: !state.selection.has(String(action.id))
        };
      case "toggleShift":
        return {
          ...state,
          shiftPressed: action.value
        };
      case "clear":
        return initialState;
      default:
        throw new Error(`${action.type} is not a defined action`);
    }
  };

export default function BulkSelectionProvider({ data, getItemId, ...props }) {
  const [store, dispatch] = useReducer(createReducer(getItemId), initialState);
  // keep track of shift-key state
  const onShiftDown = useCallback(
    () =>
      dispatch({
        type: "toggleShift",
        value: true
      }),
    [dispatch]
  );

  const onShiftUp = useCallback(
    () =>
      dispatch({
        type: "toggleShift",
        value: false
      }),
    [dispatch]
  );

  useKeyHandler("Shift", onShiftDown, onShiftUp);

  // Mouse-enter handler to update current shift-select preview.
  // This is always updated with every mouse-enter event on selectable
  // items.
  const shiftSelect = useCallback(
    (id, index) =>
      dispatch({
        type: "setShiftPreview",
        data,
        id,
        index
      }),
    [data, dispatch]
  );

  // select handler
  const select = useCallback(
    (id, index) =>
      dispatch({
        type: "select",
        id,
        index
      }),
    [dispatch]
  );

  // deselect handler
  const deselect = useCallback(
    (id, index) =>
      dispatch({
        type: "deselect",
        id,
        index
      }),
    [dispatch]
  );

  const toggleSelect = useCallback(
    (id, index) =>
      dispatch({
        type: "toggleSelect",
        id,
        index
      }),
    [dispatch]
  );

  // select-all handler
  const selectAll = useCallback(
    () =>
      dispatch({
        type: "selectAll",
        data: data.map(getItemId)
      }),
    [dispatch, data, getItemId]
  );

  // clear handler
  const clear = useCallback(() => dispatch({ type: "clear" }), [dispatch]);

  // context value
  const value = useMemo(() => {
    return {
      clear,
      deselect,
      isShiftModeSelect: store.isShiftModeSelect,
      select,
      selectAll,
      selection: store.selection,
      shiftPressed: store.shiftPressed,
      shiftPreview: store.shiftPreview,
      shiftSelect,
      toggleSelect
    };
  }, [
    clear,
    deselect,
    select,
    selectAll,
    shiftSelect,
    store.isShiftModeSelect,
    store.selection,
    store.shiftPressed,
    store.shiftPreview,
    toggleSelect
  ]);
  return <BulkSelectionContext.Provider value={value} {...props} />;
}
