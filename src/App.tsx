import { Component, createEffect, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";

import styles from "./App.module.css";
import Board, { cor_const } from "./components/Board";
import Button from "./components/Button";
import ScoreBoard from "./components/ScoreBoard";

interface GlobalGameState {
  rows: string[][];
  snake: { x: number; y: number }[];
  food: { x: number; y: number };
  direction: number;
  speed: number;
  head?: { x: number; y: number };
}

let initialStateValue: GlobalGameState = {
  rows: [["grid-item"]],
  snake: [{ x: 5, y: 5 }],
  food: { x: 0, y: 0 },
  direction: 39,
  speed: 500,
};

// create initial snake state
const [snakeState, setSnakeState] = createStore<GlobalGameState>({
  ...initialStateValue,
});

// score
const [score, setScore] = createSignal<number>(0);

// PLAY and PAUSE
const [playPause, setPlayPause] = createSignal<boolean>(false);

const App: Component = () => {
  enum Direction {
    // mapping keycode  for changing direction
    LEFT = 37,
    UP = 38,
    RIGHT = 39,
    DOWN = 40,
    STOP = 32 /* [space] used for pause */,
  }

  // Predefined speed
  enum Speed {
    FAST = 100,
    SLOW = 500,
    NORMAL = 300,
  }

  // our snake does not eat friends
  const Friend = "🐍";
  // our snake does not like pizza, throws up
  const Yuck = "🍕";
  // obviously nobody likes to eat Brick.
  const Brick = "🧱";
  // our snake loves beef
  const bestFood = "🥩";
  // our snake becomes really fast
  const booster = "🧃";

  /**The board rows rendered on a grid system*/
  const emptyRows = () =>
    [...Array(cor_const.WIDTH)].map((_) =>
      [...Array(cor_const.HEIGHT)].map((_) => "grid-item")
    );

  /**Random x and y coordinates for the grid system*/
  const getRandom = (): { x: number; y: number } => {
    return {
      x: Math.floor(Math.random() * cor_const.WIDTH),
      y: Math.floor(Math.random() * cor_const.HEIGHT),
    };
  };

  // mount
  const [mount, setMount] = createSignal<boolean>(false);

  // Game Over
  const [gameOver, setGameOver] = createSignal<boolean>(false);

  // eating Brick
  const [eatenBrick, setEatenBrick] = createSignal<boolean>(false);

  // eating Booster
  const [eatenBooster, setEatenBooster] = createSignal<boolean>(false);

  const increaseSpeed = (speed: number) => {
    setSnakeState({ speed: speed });
  };

  /**
   * Genertes random food types for snake
   */
  const getRandomFood = () => {
    const foods = [
      "🍗",
      "🥗",
      "🥟",
      "🥒",
      "🥑",
      "🍐",
      "🍏",
      "🍒",
      "🍓",
      "🥬",
      "🌲",
      "🌵",
      `${Yuck}`,
      `${bestFood}`,
      `${Brick}`,
      `${Friend}`,
      `${booster}`,
    ];
    let randFood = foods[Math.floor(Math.random() * foods.length)];
    return randFood;
  };

  /** stop every activity */
  const cancelGame = () => {
    setScore(0);
    clearInterval(foodTime);
    clearInterval(motionTime);
    setGameOver(true);
    setSnakeState((prev) => ({
      snake: [{ x: 5, y: 5 }],
      food: getRandom(),
      direction: 32,
    }));
    setGeneratedFood({ randFood: getRandomFood() });
  };

  /**Restart game by reintializing states so to counter page reloads */
  const restartGame = () => {
    setGameOver(false);
    setEatenBrick(false);
    foodTime = setInterval(foodTimeOut, 3000);
    motionTime = setInterval(moveSnake, snakeState.speed);
  };

  /**New food should regenerate every 3 seconds */
  const foodTimeOut = () => {
    let snake = [...snakeState.snake];
    let head = { ...snake[snake.length - 1] };
    let food = snakeState.food;
    let inFoodPosition = head.x === food.x && head.y === food.y;
    if (!inFoodPosition && generatedFood.randFood !== undefined) {
      setGeneratedFood({
        randFood: getRandomFood(),
      });
    }
  };

  const [generatedFood, setGeneratedFood] = createStore<{ randFood: string }>({
    randFood: getRandomFood(),
  });

  const checkException = () => {
    let snake = [...snakeState.snake];
    let head = { ...snake[snake.length - 1] };
    let food = snakeState.food;
    let inFoodPosition = head.x === food.x && head.y === food.y;
    if (inFoodPosition) {
      switch (generatedFood.randFood) {
        case bestFood:
          alert("Tasty");
          score() >= 0
            ? setScore((score) => {
                let newscore = score + 4;
                score = newscore;
                return score;
              })
            : setScore(score);
          break;

        case Yuck:
          alert("Pizza is disgusting");
          score() >= 2
            ? setScore((score) => {
                let newscore = score - 3;
                score = newscore;
                return score;
              })
            : setScore(score);
          break;

        case Friend:
          alert("We don't eat our friends");
          score() > 0
            ? setScore((score) => {
                let newscore = 0;
                score = newscore;
                return score;
              })
            : setScore(score);
          break;

        case Brick:
          setEatenBrick(true);
          setGameOver(true);
          cancelGame();
          break;

        case booster:
          setEatenBooster(true);
          increaseSpeed(Speed.FAST);
          break;

        default:
          break;
      }
    }
  };

  // food timeout interval
  let foodTime = 0;

  // motion interval
  let motionTime = 0;

  createEffect(() => {
    foodTime = setInterval(foodTimeOut, 3000);
  });

  const displayRows = () => {
    let elementArr = snakeState.rows.map((row, i) => {
      let jsx = row.map((value, j) => {
        let elm = (
          <div
            data-content={
              snakeState.rows[i][j] === "food" ? generatedFood.randFood : ""
            }
            title={`[${j},${i}]`}
            class={styles[value]}
          />
        );
        return elm;
      });
      return jsx;
    });
    return elementArr;
  };

  const changeDirection = (key: number) => {
    let direction = snakeState.direction;
    switch (key) {
      case Direction.LEFT:
        direction =
          direction === Direction.RIGHT ? Direction.RIGHT : Direction.LEFT;
        break;

      case Direction.RIGHT:
        direction =
          direction === Direction.LEFT ? Direction.LEFT : Direction.RIGHT;
        break;

      case Direction.UP:
        direction =
          direction === Direction.DOWN ? Direction.DOWN : Direction.UP;
        break;

      case Direction.DOWN:
        direction = direction === Direction.UP ? Direction.UP : Direction.DOWN;
        break;

      case Direction.STOP:
        direction = Direction.STOP;
        break;

      default:
        break;
    }
    // set state
    setSnakeState({ direction: direction });
  };

  const moveSnake = () => {
    let snakecopy = [...snakeState.snake];
    let head = { ...snakecopy[snakecopy.length - 1] };

    const Height = cor_const.HEIGHT + 1;
    const Width = cor_const.WIDTH + 1;

    /*keep the value within range of 0 to HEIGHT */
    head.x += Height * (Number(head.x < 0) - Number(head.x >= Height));
    head.y += Width * (Number(head.y < 0) - Number(head.y >= Width));

    switch (snakeState.direction) {
      case Direction.LEFT:
        head.y += -1;
        break;
      case Direction.UP:
        head.x += -1;
        break;
      case Direction.RIGHT:
        head.y += 1;
        break;
      case Direction.DOWN:
        head.x += 1;
        break;
      default:
        return;
    }

    snakecopy.push(head);
    snakecopy.shift();
    setSnakeState({
      snake: snakecopy,
      head: head,
    });

    //update
    update();
  };

  const isSnakeOutofBound = () => {
    let snakecopy = [...snakeState.snake];
    let head = { ...snakecopy[snakecopy.length - 1] };
    let rowsLength = snakeState.rows.length;
    let outofBounds = false;
    if (
      head.x === -1 ||
      head.x === rowsLength ||
      head.y === -1 ||
      head.y === rowsLength
    )
      outofBounds = true;
    return outofBounds;
  };

  const onSnakeOutofBounds = () => {
    if (isSnakeOutofBound()) {
      cancelGame();
    }
  };

  const update = () => {
    let newRows = emptyRows();
    let snake = snakeState.snake;
    let head = { ...snake[snake.length - 1] };
    snakeState.snake.forEach((elementArr) => {
      newRows[elementArr.x][elementArr.y] = "snake";
    });
    newRows[head.x][head.y] = "snake-head";
    newRows[snakeState.food.x][snakeState.food.y] = "food";

    setSnakeState({ rows: newRows });
  };

  const handlePlayStop = () => {
    let pauseGame = 32;
    let restartGame = 39;
    if (playPause() === true) setSnakeState({ direction: restartGame });
    if (playPause() === false) setSnakeState({ direction: pauseGame });
  };

  const controlBtn = (dir: Direction) => {
    let direction = snakeState.direction;
    switch (dir) {
      case Direction.LEFT:
        direction =
          direction === Direction.RIGHT ? Direction.RIGHT : Direction.LEFT;
        break;

      case Direction.RIGHT:
        direction =
          direction === Direction.LEFT ? Direction.LEFT : Direction.RIGHT;
        break;

      case Direction.UP:
        direction =
          direction === Direction.DOWN ? Direction.DOWN : Direction.UP;
        break;

      case Direction.DOWN:
        direction = direction === Direction.UP ? Direction.UP : Direction.DOWN;
        break;

      case Direction.STOP:
        direction = Direction.STOP;
        break;

      default:
        break;
    }
    // set state
    setSnakeState({ direction: direction });
  };

  createEffect(() => {
    motionTime = setInterval(moveSnake, snakeState.speed);
    document.onkeydown = ({ keyCode }) => {
      if (mount() || gameOver()) {
        // do nothing
      } else {
        changeDirection(keyCode);
      }
    };
  });

  createEffect(() => {
    onSnakeOutofBounds();
  });

  createEffect(() => {
    handlePlayStop();
  });

  const isCollapsed = () => {
    let snake = snakeState.snake;
    let head = { ...snake[snake.length - 1] };
    for (let i = 0; i < snake.length - 3; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        cancelGame();
        setGameOver(true);
      }
    }
  };

  const isEaten = () => {
    let snakecopy = [...snakeState.snake];
    let head = { ...snakecopy[snakecopy.length - 1] };
    let food = snakeState.food;
    if (head.x === food.x && head.y === food.y) {
      snakecopy.push(head);
      setSnakeState({
        snake: snakecopy,
        food: getRandom(),
        //speed: increaseSpeed(snakeState.speed),
      });
      setScore((score) => score + 1);
      setGeneratedFood({ randFood: getRandomFood() });
      checkException();
    }
  };

  createEffect(() => {
    isCollapsed();
  });

  createEffect(() => {
    isEaten();
  });

  onMount(() => {
    setMount(true);
  });

  return (
    <div class={styles["main-container"]}>
      {mount() ? (
        <div class={styles["backdrop"]}>
          <Button
            text="Start Game"
            onClick={() => {
              setPlayPause(true);
              setMount(false);
              setSnakeState({
                rows: emptyRows(),
                snake: [{ x: 5, y: 5 }],
                food: getRandom(),
                direction: Direction.RIGHT,
                speed: Speed.SLOW,
              });
            }}
          />
          <div>
            <h1 class={styles["txtlogo"]}>Snakky.com</h1>
            <h5 class={styles["txtwrtup"]}>Something a little bit different</h5>
          </div>
        </div>
      ) : null}
      {gameOver() ? (
        <div class={styles["backdrop"]}>
          <div class={styles["banner"]}>
            {eatenBrick() ? <p>You ate {Brick} </p> : null}
            {eatenBooster() ? <p>{booster} forced a restart</p> : null}
          </div>
          <h1 class={styles["txtlogo"]}>Game Over</h1>
          {eatenBooster() ? null : (
            <Button text="Restart Game" onClick={() => restartGame()} />
          )}
          <Button
            text="End Game"
            styleOverride={{
              background: "red",
            }}
            onClick={() => window.location.reload()}
          />
        </div>
      ) : null}
      <div class={styles["game-bg"]}>
        <Board
          displayRows={displayRows}
          bannerMessage={`🎇 Snakky.com, watch out for ${Friend}, ${Brick}, ${Yuck}, ${bestFood}, ${booster}`}
        />
        <ScoreBoard
          btnCurrent={playPause() === false ? "PLAY" : "PAUSE"}
          score={score()}
          onClick={() => setPlayPause(!playPause())}
        />
      </div>
    </div>
  );
};

export { setSnakeState, score, playPause, setPlayPause };
export default App;
