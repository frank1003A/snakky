import { Component, ComponentProps } from "solid-js";
import solid from "solid-js";
import styles from "../App.module.css";
import Button from "./Button";
import { playPause, score, setPlayPause } from "../App";

interface ScoreBoardProps extends ComponentProps<any> {
  onClick?: solid.JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  btnCurrent?: string;
}

const ScoreBoard: Component<ScoreBoardProps> = (props: ScoreBoardProps) => {
  return (
    <div class={styles["sidebar-right"]}>
      <div class={styles["guides"]}>
        <p>Snake does not eat friends 🐍</p>
        <p>Snake does not like pizza, throws up 🍕</p>
        <p>Obviously nobody likes to eat stone 🧱 </p>
        <p>Snake loves beef 🥩</p>
        <p>Snake becomes uncontrollably fast 🧃</p>
        <p>Please don't eat yourself 🟢</p>
      </div>

      <div class={styles["guides"]}>
        <table>
          <thead>
            <tr>
              <th>Exception</th>
              <th>Effect</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>🐍</td>
              <td> score to 0</td>
            </tr>
            <tr>
              <td>🍕</td>
              <td>score - 2</td>
            </tr>
            <tr>
              <td>🧱 / 🟢</td>
              <td>game over</td>
            </tr>
            <tr>
              <td>🥩</td>
              <td>score + 5</td>
            </tr>
            <tr>
              <td>🧃</td>
              <td>really fast</td>
            </tr>
            <tr></tr>
          </tbody>
        </table>
      </div>

      <div class={styles["board"]}>SCORE: {score}</div>
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

export default ScoreBoard;
