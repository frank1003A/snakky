# Snakky

### Same old snake game with something different - `exploring solidjs`

![Snakky_image](src/assets/snakeimg.jpg)

## Core Concept

Snakky is a web based snake game. You eat while your score increases, but I added a
new concept: `exception concept`. In this game, random food types are generated at 3 
seconds interval with the exception concept introducing random objects and sometimes food
that the snake doesn't like or can't eat. Eating this random objects and food types can affect
score, speed and length of snake, and can also fail tha game. Watch Out while you roam.

## Food Exceptions

You can eat them but they have effects on game play.
| Exception | Description / Effect |
| --- | --- |
| 🐍 | sets your score to 0 |
| 🍕 | score - 2 |
| 🧱 | ends the game - broken teeth i guess |
| 🥩 | score + 5 |
|🧃 | increases your speed to an uncontrollable state |

## Game Play
> Avoiding Exceptions
In order to avoid eating the exception, you have to move around for as long as possible until a new food is generated, but be careful, the new food might just be another exception. 😁🤣😂

> General 
You must stay within the bounds of the grid system else you fail the game. 

> 🐍 - Friend 
This is an exception that can be visualized as a friend to the snake. Eating sets your score back to zero.
if score is equal to zero, no effect takes place.

> 🧱 - Brick
This exception is powerful, since eating it kills the game. Just visualize a snake eating a brick and sustaining injuries. It's definitely over for that snake.

> 🍕 - Pizza 
This exception is straight-forward, the snake does not like pizza, but eats it anyways, the effect though is that 
you lose 2 points if score is greater than 2 else no point is added

> 🥩 - Beef 
This is not neccessarily an exception, but an exception to the exceptions, hence an exception. it's just food that the snake likes best, eating it adds five point to current score.

> 🧃 - Booster 
This exception is deadly, it increases the snake speed tremendously so as to make it impossible to control.
Failing after eating a booster also forces page reload.
## Todo

- [x] Add play and pause button
- [] mobile responsiveness with onscreen buttons
- [x] snake redesign
- [x] issue with the bottom and left side of the grid system
- [] Transition and general flow control
