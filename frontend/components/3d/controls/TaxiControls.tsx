"use client";

import { useEffect, useRef } from "react";

export type TaxiControlsState = {
  forward: boolean;
  brake: boolean;
  left: boolean;
  right: boolean;
};

type TaxiControlsCallbacks = {
  onStart?: () => void;
  onFinish?: () => void;
};

export default function useTaxiControls(
  callbacks: TaxiControlsCallbacks = {}
): React.RefObject<TaxiControlsState> {
  const controls = useRef<TaxiControlsState>({
    forward: false,
    brake: false,
    left: false,
    right: false,
  });

  const callbacksRef = useRef(callbacks);

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          controls.current.forward = true;
          break;

        case "ArrowDown":
          controls.current.brake = true;
          break;

        case "ArrowLeft":
          controls.current.left = true;
          break;

        case "ArrowRight":
          controls.current.right = true;
          break;

        case "Enter":
          event.preventDefault();
          callbacksRef.current.onStart?.();
          break;

        case " ":
          event.preventDefault();
          callbacksRef.current.onFinish?.();
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          controls.current.forward = false;
          break;

        case "ArrowDown":
          controls.current.brake = false;
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