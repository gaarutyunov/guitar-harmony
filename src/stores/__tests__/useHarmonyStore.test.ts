import { describe, it, expect, beforeEach } from "vitest";
import { useHarmonyStore } from "@/stores/useHarmonyStore";
import type { StrumCell } from "@/types";

describe("useHarmonyStore", () => {
  beforeEach(() => {
    useHarmonyStore.setState({
      current: {
        id: "test-id",
        name: "",
        timeSignature: "4/4",
        bpm: 80,
        chords: [],
        createdAt: Date.now(),
      },
      saved: [],
    });
  });

  it("starts with empty harmony", () => {
    const state = useHarmonyStore.getState();
    expect(state.current.chords).toHaveLength(0);
    expect(state.current.name).toBe("");
  });

  it("adds a chord with 16-cell pattern and 4 beatTypes for 4/4", () => {
    const { addChord } = useHarmonyStore.getState();
    addChord({ name: "Am", degree: "vi", key: "C", mode: "major" });
    const state = useHarmonyStore.getState();
    expect(state.current.chords).toHaveLength(1);
    expect(state.current.chords[0].name).toBe("Am");
    expect(state.current.chords[0].strumPattern).toHaveLength(16);
    expect(state.current.chords[0].beatTypes).toHaveLength(4);
    expect(state.current.chords[0].beatTypes).toEqual([
      "negra",
      "negra",
      "negra",
      "negra",
    ]);
  });

  it("removes a chord", () => {
    const { addChord } = useHarmonyStore.getState();
    addChord({ name: "C", degree: "I", key: "C", mode: "major" });
    addChord({ name: "G", degree: "V", key: "C", mode: "major" });
    const chords = useHarmonyStore.getState().current.chords;
    expect(chords).toHaveLength(2);

    useHarmonyStore.getState().removeChord(chords[0].id);
    expect(useHarmonyStore.getState().current.chords).toHaveLength(1);
    expect(useHarmonyStore.getState().current.chords[0].name).toBe("G");
  });

  it("moves a chord up", () => {
    const { addChord } = useHarmonyStore.getState();
    addChord({ name: "C", degree: "I", key: "C", mode: "major" });
    addChord({ name: "G", degree: "V", key: "C", mode: "major" });
    const secondId = useHarmonyStore.getState().current.chords[1].id;

    useHarmonyStore.getState().moveChord(secondId, -1);
    const chords = useHarmonyStore.getState().current.chords;
    expect(chords[0].name).toBe("G");
    expect(chords[1].name).toBe("C");
  });

  it("sets name", () => {
    useHarmonyStore.getState().setName("My Harmony");
    expect(useHarmonyStore.getState().current.name).toBe("My Harmony");
  });

  it("changes time signature and resets to 12 cells / 3 beats for 3/4", () => {
    const { addChord } = useHarmonyStore.getState();
    addChord({ name: "Am", degree: "vi", key: "C", mode: "major" });
    expect(
      useHarmonyStore.getState().current.chords[0].strumPattern,
    ).toHaveLength(16);

    useHarmonyStore.getState().setTimeSignature("3/4");
    expect(useHarmonyStore.getState().current.timeSignature).toBe("3/4");
    expect(
      useHarmonyStore.getState().current.chords[0].strumPattern,
    ).toHaveLength(12);
    expect(
      useHarmonyStore.getState().current.chords[0].beatTypes,
    ).toHaveLength(3);
  });

  it("saves and loads a harmony", () => {
    const { addChord, setName, saveHarmony, clearCurrent, loadHarmony } =
      useHarmonyStore.getState();
    addChord({ name: "C", degree: "I", key: "C", mode: "major" });
    setName("Test Harmony");
    const result = saveHarmony();
    expect(result).toBe(true);
    expect(useHarmonyStore.getState().saved).toHaveLength(1);

    clearCurrent();
    expect(useHarmonyStore.getState().current.chords).toHaveLength(0);

    const savedId = useHarmonyStore.getState().saved[0].id;
    loadHarmony(savedId);
    expect(useHarmonyStore.getState().current.chords).toHaveLength(1);
    expect(useHarmonyStore.getState().current.name).toBe("Test Harmony");
  });

  it("fails to save without name", () => {
    const { addChord, saveHarmony } = useHarmonyStore.getState();
    addChord({ name: "C", degree: "I", key: "C", mode: "major" });
    expect(saveHarmony()).toBe(false);
  });

  it("fails to save without chords", () => {
    useHarmonyStore.getState().setName("Empty");
    expect(useHarmonyStore.getState().saveHarmony()).toBe(false);
  });

  it("deletes a saved harmony", () => {
    const { addChord, setName, saveHarmony, deleteHarmony } =
      useHarmonyStore.getState();
    addChord({ name: "C", degree: "I", key: "C", mode: "major" });
    setName("To Delete");
    saveHarmony();
    const savedId = useHarmonyStore.getState().saved[0].id;
    deleteHarmony(savedId);
    expect(useHarmonyStore.getState().saved).toHaveLength(0);
  });

  it("updates strum pattern", () => {
    const { addChord, updatePattern } = useHarmonyStore.getState();
    addChord({ name: "Am", degree: "vi", key: "C", mode: "major" });
    const chordId = useHarmonyStore.getState().current.chords[0].id;
    const newPattern: StrumCell[] = [
      "↓", "", "", "",
      "↓", "", "↑", "",
      "", "", "↑", "",
      "↓", "", "↑", "",
    ];
    updatePattern(chordId, newPattern);
    expect(
      useHarmonyStore.getState().current.chords[0].strumPattern[0],
    ).toBe("↓");
  });

  it("updates beat types", () => {
    const { addChord, updateBeatTypes } = useHarmonyStore.getState();
    addChord({ name: "Am", degree: "vi", key: "C", mode: "major" });
    const chordId = useHarmonyStore.getState().current.chords[0].id;
    updateBeatTypes(chordId, ["corchea", "semicorchea", "negra", "corchea"]);
    expect(
      useHarmonyStore.getState().current.chords[0].beatTypes,
    ).toEqual(["corchea", "semicorchea", "negra", "corchea"]);
  });
});
