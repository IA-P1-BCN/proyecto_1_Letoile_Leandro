"use client";

import { useEffect, useRef } from "react";

export type TaxiControlsState = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
};

export default function useTaxiControls(): React.RefObject<TaxiControlsState> {
  const controls = useRef<TaxiControlsState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          controls.current.forward = true;
          break;

        case "ArrowDown":
          controls.current.backward = true;
          break;

        case "ArrowLeft":
          controls.current.left = true;
          break;

        case "ArrowRight":
          controls.current.right = true;
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          controls.current.forward = false;
          break;

        case "ArrowDown":
          controls.current.backward = false;
          break;

        case "ArrowLeft":
          controls.current.left = false;
          break;

        case "ArrowRight":
          controls.current.right = false;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return controls;
}