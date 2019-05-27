import { useEffect } from "react";
// copied from https://usehooks.com/useKeyPress/
// Hook
export default function useKeyPress(targetKey, downHandler, upHandler) {
  // State for keeping track of whether key is pressed
  // If pressed key is our target key then set to true
  function handleKeyDown({ key }) {
    if (key === targetKey && downHandler) {
      downHandler();
    }
  }

  // If released key is our target key then set to false
  const handleKeyUp = ({ key }) => {
    if (key === targetKey && upHandler) {
      upHandler();
    }
  };

  // Add event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
}
