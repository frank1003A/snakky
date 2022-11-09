import type { Component, ComponentProps } from "solid-js";
import solid from "solid-js";
import styles from "../../src/App.module.css";

interface ButtonProps extends ComponentProps<any> {
  onClick?: solid.JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  text?: string;
  styleOverride?: solid.JSX.CSSProperties;
}

const Button: Component<ButtonProps> = (props: ButtonProps) => {
  return (
    <button
      class={styles["button-88"]}
      style={props.styleOverride}
      role="button"
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
};

export default Button;
