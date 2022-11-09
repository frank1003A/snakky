# Snakky

### Same old snake game with something different - `exploring solidjs`

![This is an image](src/assets/snakeimg.jpg)

## Core Concept

Snakky is a web based snake game. You eat while your score increases, but i added a
new concept: `exception`. The exception concept entails that random variety of food is
generated at 3 seconds interval, and the type of food generated and eaten produces an effect on
a users score.

## Food Exceptions

You can eat them but they have effects on your score during play.
| Exception | Description / Effect |
| --- | --- |
| 🐍 | sets your score to 0 |
| 🍕 | score - 2 |
| 🧱 | ends the game - broken teeth i guess |
| 🥩 | score + 5 |
|🧃 | increases your speed to an uncontrollable state |

## Game Play
In order to avoid eating the exception, you have to move around for as long as possible until a new food is generated, but be careful, the new food might just be another exception. 😁🤣😂
## Todo

- [x] Add play and pause button
- [ ] mobile compatibility
- [ ] snake redesign
- [ ] issue with the bottom and left side of the grid system
