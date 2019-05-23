import React, {
  createContext,
  useCallback,
  useReducer,
  useMemo,
  useContext
} from "react";
import useKeyPress from "./hooks/use-key-press";
const BulkSelectionContext = createContext();

// selection states
export const NOT_SELECTED = 0;
export const SHIFT_DESELECT_PREVIEW = 1;
export const SELECTED = 2;

const initialState = {
  // store for actually selected items
  selection: {},
  // store for current shif-selection preview
  shiftPreview: {},
  // keep track wether shift-selection is for
  // select or deselect
  isShiftModeSelect: true,
  // Keep track of last item that received a
  // select or deselect. This is needed to define
  // the shift-preview set.
  lastInteractionIndex: undefined
};

function selectionReducer(state, action) {
  switch (action.type) {
    case "select":
      return {
        selection: {
          ...state.selection,
          [action.id]: SELECTED,
          ...(action.shiftPressed &&
            Object.fromEntries(
              Object.keys(state.shiftPreview).map(id => [id, SELECTED])
            ))
        },
        shiftPreview: {},
        lastInteractionIndex: action.index
      };
    case "deselect":
      return {
        ...state,
        selection: {
          ...state.selection,
          [action.id]: NOT_SELECTED,
          ...(action.shiftPressed &&
            Object.fromEntries(
              Object.keys(state.shiftPreview).map(id => [id, NOT_SELECTED])
            ))
        },
        lastInteractionIndex: action.index
      };
    case "selectAll":
      return {
        ...state,
        selection: action.data.reduce((acc, item) => {
          acc[item.id] = SELECTED;
          return acc;
        }, {})
      };
    case "setShiftPreview":
      return {
        ...state,
        shiftPreview: action.data,
        isShiftModeSelect: action.isShiftModeSelect
      };
    case "clear":
      return initialState;
    default:
      throw new Error(`${action.type} is not a defined action`);
  }
}

function BulkSelectionProvider({ data, ...props }) {
  const [store, dispatch] = useReducer(selectionReducer, initialState);
  // keep track of shift-key state
  const shiftPressed = useKeyPress("Shift");

  // Mouse-enter handler to update current shift-select preview.
  // This is always updated with every mouse-enter event on selectable
  // items.
  const shiftSelect = useCallback(
    (index, isDeselect) => {
      if (store.lastInteractionIndex !== undefined) {
        const from = Math.min(store.lastInteractionIndex, index);
        const to = Math.max(store.lastInteractionIndex, index) + 1;
        dispatch({
          type: "setShiftPreview",
          data: data.slice(from, to).reduce((acc, item) => {
            acc[item.id] = true;
            return acc;
          }, {}),
          isShiftModeSelect: !isDeselect
        });
      }
    },
    [data, store.lastInteractionIndex]
  );

  // select handler
  const select = useCallback(
    (id, index) =>
      dispatch({
        type: "select",
        id,
        index,
        shiftPressed
      }),
    [dispatch, shiftPressed]
  );

  // deselect handler
  const deselect = useCallback(
    (id, index) =>
      dispatch({
        type: "deselect",
        id,
        index,
        shiftPressed
      }),
    [dispatch, shiftPressed]
  );

  // select-all handler
  const selectAll = useCallback(
    () =>
      dispatch({
        type: "selectAll",
        data
      }),
    [dispatch, data]
  );

  // clear handler
  const clear = useCallback(() => dispatch({ type: "clear" }), [dispatch]);

  // context value
  const value = useMemo(() => {
    return {
      clear,
      deselect,
      select,
      selectAll,
      shiftSelect,
      selection: store.selection,
      shiftPreview: store.shiftPreview,
      isShiftModeSelect: store.isShiftModeSelect,
      shiftPressed
    };
  }, [
    selectAll,
    clear,
    store.selection,
    select,
    deselect,
    store.shiftPreview,
    store.isShiftModeSelect,
    shiftPressed,
    shiftSelect
  ]);
  return <BulkSelectionContext.Provider value={value} {...props} />;
}

// Hook for selectables. It provides the items selection state
// and all necessary handlers.
function useSelectable(id, index) {
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
    selection,
    shiftPreview,
    isShiftModeSelect,
    shiftPressed
  } = context;
  // is this item part of a shift-selection preview? If so, is
  // it a select or deselect preview?
  const shiftSelected =
    shiftPressed &&
    shiftPreview[id] &&
    (isShiftModeSelect ? SELECTED : SHIFT_DESELECT_PREVIEW);

  // is this item selected?
  const selected = selection[id] ? SELECTED : NOT_SELECTED;

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
  const shiftSelect = useCallback(
    () => shiftSelectHandler(index, selected === SELECTED),
    [index, selected, shiftSelectHandler]
  );
  return {
    deselect,
    select,
    shiftSelect,
    selected,
    shiftSelected
  };
}

// Hook for bulk selection master controls and consumers.
// It provides the number and the array of selected items (ids)
// and all necessary master handlers.
function useBulkSelection() {
  const context = useContext(BulkSelectionContext);
  if (!context) {
    throw new Error(
      "useCouseBulkSelectionunt must be used within a BulkSelectionContext"
    );
  }
  const { clear, selection, selectAll } = context;
  // `selection` is an object storing the selection status for every
  // object that has been selected. So getting the count of selected
  // items has a little overhead.
  const selectionSize = useMemo(
    () =>
      Object.entries(selection).filter(([, value]) => value === SELECTED)
        .length,
    [selection]
  );
  const getSelection = () =>
    Object.entries(selection)
      .filter(([, value]) => value === SELECTED)
      .map(([id]) => id);
  return {
    clear,
    selectAll,
    getSelection,
    selectionSize
  };
}
export { BulkSelectionProvider, useBulkSelection, useSelectable };
