# Interactive Fretboard Visualizations

> An interactive fretboard visualization for learning music theory (Work in progress).

You can visit it online at [https://krystex.github.io/Fretboard/](https://krystex.github.io/Fretboard/)

## Run Locally

To run it locally, just clone the repository and open `index.html`.

## Develop
This webapp is written in [D3](https://d3js.org). For a good introduction and reference you can go to [Using D3](http://using-d3js.com).

All the computations for music theory are bundled in `musictheory.js`, the actual visualizations are in `fretboard.js`.

To automatically reload the application while coding, you can use `serve` for example:

```bash
npm install -g serve
serve .
```