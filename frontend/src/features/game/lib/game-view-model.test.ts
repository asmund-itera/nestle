import { describe, expect, it } from "vitest";
import { buildKeyboardKeyStates } from "./game-view-model";
import type { GameRunLetter } from "../types/game";

describe("buildKeyboardKeyStates", () => {
    it("returns absent for letters only marked absent", () => {
        const letters: GameRunLetter[] = [
            { value: "a", isCorrect: false, isPresent: false },
        ];

        const states = buildKeyboardKeyStates(letters, ["a"]);

        expect(states.a).toBe("absent");
    });

    it("keeps present when both absent and present exist", () => {
        const letters: GameRunLetter[] = [
            { value: "a", isCorrect: false, isPresent: false },
            { value: "a", isCorrect: false, isPresent: true },
        ];

        const states = buildKeyboardKeyStates(letters, ["a"]);

        expect(states.a).toBe("present");
    });

    it("keeps correct when absent/present/correct all exist", () => {
        const letters: GameRunLetter[] = [
            { value: "a", isCorrect: false, isPresent: false },
            { value: "a", isCorrect: false, isPresent: true },
            { value: "a", isCorrect: true, isPresent: false },
        ];

        const states = buildKeyboardKeyStates(letters, ["a"]);

        expect(states.a).toBe("correct");
    });
});
