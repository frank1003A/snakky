import {
  Component,
  createSignal,
  createEffect,
  createSelector,
  JSXElement,
  createRenderEffect,
} from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";
import Button from "./components/Button";
import Header from "./components/Header";
import Board, { cor_const } from "./components/Board";
import ScoreBoard from "./components/ScoreBoard";
import { createStore } from "solid-js/store";

interface GlobalGameState {
  rows: string[][];
  snake: { x: number; y: number }[];
  food: { x: number; y: number };
  direction: number;
  speed: number;
  head?: { x: number; y: number };
}

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
  // obviously nobody likes to eat stone.
  const Stone = "🧱";
  // our snake loves beef
  const bestFood = "🥩";
  // our snake becomes really fast
  const booster = "🧃"

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

  // create initial snake state
  const [snakeState, setSnakeState] = createStore<GlobalGameState>({
    rows: emptyRows(),
    snake: [getRandom()],
    food: getRandom(),
    direction: Direction.STOP,
    speed: Speed.SLOW,
  });

  // score
  const [score, setScore] = createSignal(snakeState.snake.length - 1);

  // PLAY and PAUSE
  const [playPause, setPlayPause] = createSignal<boolean>(false);

  /** 
   * Genertes random food types for snake
   * avoid whatever food the snake does not like
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
      `${Stone}`,
      `${Friend}`,
      `${booster}`
    ];
    let randFood = foods[Math.floor(Math.random() * foods.length)]
    return randFood;
  };

  /**Snake likes beef so it gains 5 score point but only increases ones */
  const bestSnakeFood = () => {
    let snake = [...snakeState.snake];
    let head = { ...snake[snake.length - 1] };
    let food = snakeState.food;
    let inFoodPosition = head.x === food.x && head.y === food.y;
    let snakeLength = snake.length - 1;

    if (inFoodPosition && generatedFood.randFood === bestFood) {
      alert("Tasty")
      // +5
      setScore(snakeLength + 5);
    }
  };

  /**It looses all point and looses body length too */
  const friendFoodException = () => {
    let state = { ...snakeState };
    let snake = [...snakeState.snake];
    let head = { ...snake[snake.length - 1] };
    let food = snakeState.food;
    let inFoodPosition = head.x === food.x && head.y === food.y;
    if (inFoodPosition && generatedFood.randFood === Friend) {
      alert("We don't eat our friends")
      //start from 0
      snake.splice(1, snake.length);
      setSnakeState({
        snake: snake,
      });
      setScore(0);
    }
  };

  const pizzaFoodException = () => {
    let state = { ...snakeState };
    let snake = [...snakeState.snake];
    let head = { ...snake[snake.length - 1] };
    let food = snakeState.food;
    let inFoodPosition = head.x === food.x && head.y === food.y;
    if (inFoodPosition && generatedFood.randFood === Yuck) {
      alert("Pizza is disgusting")
      // loose 2 point
      snake.length - 1 < 2
        ? snake.splice(0, 0)
        : snake.splice(snake.length - 2, snake.length);
      setSnakeState({
        snake: snake,
      });
      setScore(snake.length);
    }
  };

  const stoneFoodException = () => {
    let state = { ...snakeState };
    let snake = [...snakeState.snake];
    let head = { ...snake[snake.length - 1] };
    let food = snakeState.food;
    let inFoodPosition = head.x === food.x && head.y === food.y;
    if (inFoodPosition && generatedFood.randFood === Stone) {
      // game over
      alert(`game over: ${score()}`);
      gameOver();
    }
  };

  const boosterException = () => {
    let state = { ...snakeState };
    let snake = [...snakeState.snake];
    let head = { ...snake[snake.length - 1] };
    let food = snakeState.food;
    let inFoodPosition = head.x === food.x && head.y === food.y;
    if (inFoodPosition && generatedFood.randFood === booster) {
      // increase speed to FAST
      increaseSpeed(Speed.FAST)
    }
  }

  const gameOver = () => {
    let snake = [...snakeState.snake];
    snake.splice(1, snake.length);
    setScore(0);
    setSnakeState({
      direction: 32,
      snake: snake,
    });
  };

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

  createEffect(() => {
    bestSnakeFood();
    friendFoodException();
    pizzaFoodException();
    stoneFoodException();
    boosterException();
  });

  createEffect(() => setInterval(foodTimeOut, 3000));

  const [generatedFood, setGeneratedFood] = createStore<{ randFood: string }>({
    randFood: getRandomFood(),
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

    const Height = cor_const.HEIGHT - 1;
    const Width = cor_const.WIDTH - 1;

    /* keep the value within range of 0 to HEIGHT */
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
    let startGame = 39;
    if (playPause() === true) setSnakeState({ direction: pauseGame });
    if (playPause() === false) setSnakeState({ direction: startGame });
  };

  createEffect(() => {
    setInterval(moveSnake, snakeState.speed);
    document.onkeydown = ({ keyCode }) => changeDirection(keyCode);
  });

  createEffect(() => {
    handlePlayStop();
  });

  const isCollapsed = () => {
    let snake = snakeState.snake;
    let head = { ...snake[snake.length - 1] };
    for (let i = 0; i < snake.length - 3; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        setSnakeState(snakeState);
        alert(`game over: ${score()}`);
        gameOver()
      }
    }
  };

  const increaseSpeed = (speed: number) => {
    setSnakeState({speed: speed})
  }

  const isEaten = () => {
    let snakecopy = [...snakeState.snake];
    let head = { ...snakecopy[snakecopy.length - 1] };
    let food = snakeState.food;
    if (head.x === food.x && head.y === food.y) {
      snakecopy.push(head);
      setSnakeState({
        snake: snakecopy,
        food: getRandom(),
       // speed: increaseSpeed(snakeState.speed),
      });
      setScore(snakeState.snake.length);
      setGeneratedFood({ randFood: getRandomFood() });
    }
  };

  createEffect(() => {
    isCollapsed();
    isEaten();
  });

  //{'🎇 You are Exceptional, watch out!'}

  return (
    <div
      class={styles["game-bg"]}
    >
      <Board
        displayRows={displayRows}
        bannerMessage={`🎇 Snakky.com, watch out for ${Friend}, ${Stone}, ${Yuck}, ${bestFood}, ${booster}`}
      />
      <ScoreBoard
        btnCurrent={playPause() === true ? "PLAY" : "PAUSE"}
        score={score()}
        onClick={() => setPlayPause(!playPause())}
      />
    </div>
  );
};

export default App;
