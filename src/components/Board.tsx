import { Component, ComponentProps, JSXElement } from "solid-js";
import styles from "../../src/App.module.css";
import Controls from "./Controls";
import { score } from "./../App";
import Button from "./Button";
import { playPause, setPlayPause } from "../App";

interface BoardProps extends ComponentProps<any> {
  displayRows: () => JSXElement[][];
  bannerMessage?: string;
}

export enum cor_const {
  HEIGHT = 10,
  WIDTH = 10,
}

const Board: Component<BoardProps> = (props: BoardProps) => {
  return (
    <div class={styles["bounds"]}>
      <div class={styles["xl-board"]}>SCORE: {score()}</div>
      <div class={styles["banner"]}>{props.bannerMessage}</div>
      <div class={styles["snake-container"]}>
        <div class={styles["grid"]}>{props.displayRows()}</div>
      </div>
      <Controls />
      <div class={styles["btn-container"]}>
        <Button
          text={playPause() === false ? "PLAY" : "PAUSE"}
          onClick={() => setPlayPause(!playPause())}
        />
        <Button
          text="Restart"
          styleOverride={{
            background: "red",
          }}
          onClick={() => window.location.reload()}
        />
      </div>
    </div>
  );
};

export default Board;
