# Rogue Engine
This repo is meant to be a template used to create new rogulike games. It will house a library of functions, tools, and design paradigms helpful for quickly prototyping ideas.

# Game Engine Overview
An outline of how the main components of this library can be used

## Game
An object that holds the entire state of the game and all its components

## Engine
This keeps track of all actors in the game and processes turns accordingly

## Display
This processes data withing the tilemap and animation layer, and renders images to the screen accordingly

## Entities
Composable classes used to represent entites within the game via data and functions which modify that data

## Actions
Composable classes representing any Entity action or Entity state change

## KeyActions (Abilities)
An abstraction layer above **Actions** that consist of an **Action** instance, a name / label, a **Renderer** or image, and an activation function which is responsible for triggering the action and handling any other UI triggers.  

## Constants
A place to keep universal values that never change

## TileMap

## Tiles

## Status Effects

## Actors

## Items

## Renderers

## Sounds

## Screens

## Modes

## UI
## Keymap
## Messages

## Deploy
To Github Pages: `npm run deploy`
To itch.io: copy `/build`, compress `/build`, upload zipped file to itch page.
