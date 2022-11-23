import { Component, ComponentProps } from 'solid-js';
import styles from "../../src/App.module.css";
import { setSnakeState } from "../App"


const Controls: Component = () => {
    let left = "◀"
    let right = "▶"
    let up = "🔺"
    let down = "🔻"
    return (
        <div class={styles["btn-controls"]}>
            <button onClick={() => setSnakeState({direction: 38})}>{up}</button>
            <div>
            <button onClick={() => setSnakeState({direction: 37})}>{left}</button>
            <button onClick={() => setSnakeState({direction: 40})}>{down}</button>
            <button onClick={() => setSnakeState({direction: 39})}>{right}</button>
            </div>
        </div>
    )
}

export default Controls;

//▶◀▶🔽🔼⏏🔻🔺🔝