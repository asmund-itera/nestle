import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PuzzleGrid } from "./puzzle-grid";

describe("PuzzleGrid", () => {
  it("renders current guess row in red when guess is illegal", () => {
    const committedGrid = [
      [
        { letter: "x", status: "absent" as const },
        { letter: "x", status: "absent" as const },
        { letter: "x", status: "absent" as const },
        { letter: "x", status: "absent" as const },
        { letter: "x", status: "absent" as const },
      ],
      [
        { letter: "", status: "empty" as const },
        { letter: "", status: "empty" as const },
        { letter: "", status: "empty" as const },
        { letter: "", status: "empty" as const },
        { letter: "", status: "empty" as const },
      ],
    ];

    const { container } = render(
      <PuzzleGrid
        committedGrid={committedGrid}
        currentGuess="abcde"
        isCurrentGuessIllegal={true}
      />,
    );

    expect(container.querySelectorAll(".bg-red-200")).toHaveLength(5);
  });
});
