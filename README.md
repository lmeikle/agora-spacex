# Agora - SpaceX App

## To run it

`npm run start`

## To run the tests

`npm run test`

## Notes

- Initialized the app using CRA (with typescript)
- Installed prettier and MUI
- Used native fetch, if I need to support ie11 I would use something like axios or a fetch polyfill
- Used the 'v4/launches/query' endpoint to limit results to 50 and perform sorting (v4/launches/past didn't seem to support this)
- Not used Redux at this point as it's a simple app. 
  If the app grew more complex I would use RTK with RTK Query.
- Used @testing-library as I'm a big fan of it.
- Used the table from MUI rather than adding another dependency like ag-grid.
  (It meets the requirements for the current simple table.)
- I've interpreted the requirements as: "limit the results to show the 50 most recent launches and
any sorting/searching should apply to that limited set of data". Hence, the sorting and searching is performed client side.
- There are lots of different ways to handle showing the rocket details, I've gone with simple state and a modal dialog. 
Other options could be setting the rocket id in the url and opening the details as a page (or still as a modal).
Or even using the expandable row functionality that MUI offers.
- I haven't implemented search by launch name - I felt that hopefully I had done enough to demonstrate my ability and decided to spend more time on polishing what I had already.
- Accessibility - I have run the app through Lighthouse and axe DevTools Chrome extension and they both score 100%.
I've also manually tested keyboard navigation works. 
However I do think the focus highlighting on the MUI table headers/sort icon isn't very clear - see below for future improvements.

## Things I would do next
- I've used the MUI Table to display the data but tables don't really work well on small screens, hence it's not fully responsive. 
I would think about switching to a card style layout on smaller devices.
- Show loading indicators
- Handle 'No data found'
- Handle errors
- Improve/tweak the focus highlighting in the MUI table headers and sort icon
- Tested in Chrome and Edge, test across other major browsers like Firefox and Safari
