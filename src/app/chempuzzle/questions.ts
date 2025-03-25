export const questions = [
  {
    id: 1,
    type: "drawing",
    title: "Draw the dipole moment vector for water (H2O)",
    time: 30,
    content: {
      drawingProps: {
        tools: ["arrow", "eraser"],
        initialState: "H2O-molecule.svg",
      },
    },
    correctAnswer: {
      // Vector coordinates or pattern to match
      start: { x: 100, y: 100 },
      end: { x: 100, y: 150 },
    },
  },
  {
    id: 2,
    type: "table",
    title: "Complete the following reaction table",
    time: 60,
    content: {
      tableProps: {
        headers: ["Reactant", "Product", "Yield %"],
        rows: 3,
      },
    },
  },
];
