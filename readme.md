# Game of life

[Game of life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) in [typescript](https://www.typescriptlang.org/]
Runs pretty slow for now but works.

To compile to javascript, install typescript and run `tsc -t ESNext ./js/main.ts` from the root directory

Uses CSS grid to position all of the cells. Won't work on older browsers at all.

## TODO

- Add comments to code
- Improve performance
- Update click event to allow clicking and dragging
- Add navigation between states with using a range input element
- Create visual queue that it is playing
- Make it look better