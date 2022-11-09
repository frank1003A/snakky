import { Component, ComponentProps, JSXElement } from "solid-js";
import styles from "../../src/App.module.css";

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
      <div class={styles["banner"]}>{props.bannerMessage}</div>
      <div class={styles["snake-container"]}>
        <div class={styles["grid"]}>{props.displayRows()}</div>
      </div>
    </div>
  );
};

export default Board;

/**return (
                <div className="snake-container">
                    <div className="grid">{displayRows}</div>
                </div>
        )     */

/**<div
      style={{
        background: "rgb(85, 85, 85)",
        width: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div class={styles.board}>
        <Snake/>
      </div>
    </div> */