import { PathFollower } from "../src/index";

describe("PathFollower", () => {
  it("should collect letters and path correctly", () => {
    const map: string[][] = [
      ["@", "-", "-", "-", "A", "-", "-", "-", "+"],
      [" ", " ", " ", " ", " ", " ", " ", " ", "|"],
      ["x", "-", "B", "-", "+", " ", " ", " ", "C"],
      [" ", " ", " ", " ", "|", " ", " ", " ", "|"],
      [" ", " ", " ", " ", "+", "-", "-", "-", "+"],
    ];
    const pathFollower = new PathFollower(map);
    const result = pathFollower.execute();
    expect(result.lettersCollected).toBe("ACB");
    expect(result.path).toBe("@---A---+|C|+---+|+-B-x");
  });

  it("should collect letters and path correctly and go straight through intersections", () => {
    const map: string[][] = [
      ["@", " ", " ", " ", " ", " ", " ", " ", " ", " "],
      ["|", " ", "+", "-", "C", "-", "-", "+", " ", " "],
      ["A", " ", "|", " ", " ", " ", " ", "|", " ", " "],
      ["+", "-", "-", "-", "B", "-", "-", "+", " ", " "],
      [" ", " ", "|", " ", " ", " ", " ", " ", " ", "x"],
      [" ", " ", "|", " ", " ", " ", " ", " ", " ", "|"],
      [" ", " ", "+", "-", "-", "-", "D", "-", "-", "+"],
    ];
    const pathFollower = new PathFollower(map);
    const result = pathFollower.execute();
    expect(result.lettersCollected).toBe("ABCD");
    expect(result.path).toBe("@|A+---B--+|+--C-+|-||+---D--+|x");
  });

  it("should collect letters and path correctly and letters may be found on turns", () => {
    const map: string[][] = [
      ["@", "-", "-", "-", "A", "-", "-", "-", "+"],
      [" ", " ", " ", " ", " ", " ", " ", " ", "|"],
      ["x", "-", "B", "-", "+", " ", " ", " ", "|"],
      [" ", " ", " ", " ", "|", " ", " ", " ", "|"],
      [" ", " ", " ", " ", "+", "-", "-", "-", "C"],
    ];
    const pathFollower = new PathFollower(map);
    const result = pathFollower.execute();
    expect(result.lettersCollected).toBe("ACB");
    expect(result.path).toBe("@---A---+|||C---+|+-B-x");
  });

  it("should collect letters and path correctly and should not collect a letter from the same location twice", () => {
    const map: string[][] = [
      [" ", " ", " ", " ", "+", "-", "O", "-", "N", "-", "+", " ", " "],
      [" ", " ", " ", " ", "|", " ", " ", " ", " ", " ", "|", " ", " "],
      [" ", " ", " ", " ", "|", " ", " ", " ", "+", "-", "I", "-", "+"],
      ["@", "-", "G", "-", "O", "-", "+", " ", "|", " ", "|", " ", "|"],
      [" ", " ", " ", " ", "|", " ", "|", " ", "+", "-", "+", " ", "E"],
      [" ", " ", " ", " ", "+", "-", "+", " ", " ", " ", " ", " ", "S"],
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "|"],
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "x"],
    ];
    const pathFollower = new PathFollower(map);
    const result = pathFollower.execute();
    expect(result.lettersCollected).toBe("GOONIES");
    expect(result.path).toBe("@-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x");
  });

  it("should collect letters and path correctly and should keep direction, even in a compact space", () => {
    const map: string[][] = [
      [" ", "+", "-", "L", "-", "+", " ", " "],
      [" ", "|", " ", " ", "+", "A", "-", "+"],
      ["@", "B", "+", " ", "+", "+", " ", "H"],
      [" ", "+", "+", " ", " ", " ", " ", "x"],
    ];
    const pathFollower = new PathFollower(map);
    const result = pathFollower.execute();
    expect(result.lettersCollected).toBe("BLAH");
    expect(result.path).toBe("@B+++B|+-L-+A+++A-+Hx");
  });

  it("should collect letters and path correctly and ignore stuff after end of path", () => {
    const map: string[][] = [
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        ["@", "-", "A", "-", "-", "+", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", "|", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", "+", "-", "B", "-", "-", "x", "-", "C", "-", "-", "D"],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
    ];
    const pathFollower = new PathFollower(map);
    const result = pathFollower.execute();
    expect(result.lettersCollected).toBe("AB");
    expect(result.path).toBe("@-A--+|+-B--x");
  });

  it("should throw an error for missing start character", () => {
    const map: string[][] = [
      [" "," "," ", "-", "A", "-", "-", "-", "+"],
      [" "," "," ", " ", " ", " ", " ", " ", "|"],
      ["x","-","B", "-", "+", " ", " ", " ", "C"],
      [" "," "," ", " ", "|", " ", " ", " ", "|"],
      [" "," "," ", " ", "+", "-", "-", "-", "+"],
    ];
    expect(() => new PathFollower(map).execute()).toThrow(
      "Invalid map: There should be exactly one start character @"
    );
  });

  it("should throw an error for missing end character", () => {
    const map: string[][] = [
      [" ","@","-", "-", "A", "-", "-", "-", "+"],
      [" "," "," ", " ", " ", " ", " ", " ", "|"],
      [" "," ","B", "-", "+", " ", " ", " ", "C"],
      [" "," "," ", " ", "|", " ", " ", " ", "|"],
      [" "," "," ", " ", "+", "-", "-", "-", "+"],
    ];
    expect(() => new PathFollower(map).execute()).toThrow(
      "Invalid map: There should be at least one end character x"
    );
  });

  it("should throw an error for having multiple starts test 1", () => {
    const map: string[][] = [
        [" ","@","-", "-", "A", "-", "@", "-", "+"],
        [" "," "," ", " ", " ", " ", " ", " ", "|"],
        [" "," ","B", "-", "+", " ", " ", " ", "C"],
        [" "," "," ", " ", "|", " ", " ", " ", "|"],
        [" "," "," ", " ", "+", "-", "-", "-", "+"],
    ];
    expect(() => new PathFollower(map).execute()).toThrow(
      "Invalid map: There should be exactly one start character @"
    );
  });


  it("should throw an error for having multiple starts test 2", () => {
    const map: string[][] = [
        [" ","@","-", "-", "A", "-", "-", "-", "+"],
        [" "," "," ", " ", " ", " ", " ", " ", "|"],
        [" "," "," ", " ", " ", " ", " ", " ", "C"],
        [" "," "," ", " ", " ", " ", " ", " ", "x"],
        [" "," "," ", " ", "@", "-", "B", "-", "+"],
    ];
    expect(() => new PathFollower(map).execute()).toThrow(
      "Invalid map: There should be exactly one start character @"
    );
  });

  it("should throw an error for having multiple starts test 3", () => {
    const map: string[][] = [
        [" ","@","-", "-", "A", "-", "-", "x", " "],
        [" "," "," ", " ", " ", " ", " ", " ", " "],
        ["x","-","B", "-", "+", " ", " ", " ", " "],
        [" "," "," ", " ", "|", " ", " ", " ", " "],
        [" "," "," ", " ", "@", " ", " ", " ", " "],
    ];
    expect(() => new PathFollower(map).execute()).toThrow(
      "Invalid map: There should be exactly one start character @"
    );
  });

  it("should throw an error for having fork in path", () => {
    const map: string[][] = [
        [" ", " ", " ", " ", " ", "x", "-", "B", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", "|", " ", " "],
        ["@", "-", "-", "A", "-", "-", "-", "+", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", "|", " ", " "],
        [" ", " ", "x", "+", " ", " ", " ", "C", " ", " "],
        [" ", " ", " ", "|", " ", " ", " ", "|", " ", " "],
        [" ", " ", " ", "+", "-", "-", "-", "+", " ", " "],
    ];
    expect(() => new PathFollower(map).execute()).toThrow(
      "Invalid map: Fork in path"
    );
  });

  it("should throw an error for having a broken path", () => {
    const map: string[][] = [
        ["@", "-", "-", "A", "+", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", "|", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", "B", "-", "x", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
    ];
    expect(() => new PathFollower(map).execute()).toThrow(
      "Invalid map: Broken path"
    );
  });


  it("should throw an error for having multiple starting paths", () => {
    const map: string[][] = [
        [" ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " "],
        ["x", "-", "B", "-", "@", "-", "A", "-", "x"],
        [" ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " "],
      ];
      
    expect(() => new PathFollower(map).execute()).toThrow(
      "Invalid map: Multiple starting paths"
    );
  });

  it("should throw an error for having a fake turn", () => {
    const map: string[][] = [
        [" ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " "],
        ["@", "-", "A", "-", "+", "-", "B", "-", "x"],
        [" ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " "],
      ];
      
    expect(() => new PathFollower(map).execute()).toThrow(
      "Invalid map: Fake turn"
    );
  });

  it("should throw an error for character out of scope", () => {
    const map: string[][] = [
        [" ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", "3", " ", " ", " ", " "],
        ["@", "-", "A", "-", "+", "-", "B", "-", "x"],
        [" ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " "],
      ];
      
    expect(() => new PathFollower(map).execute()).toThrow(
      "Invalid map: Contains invalid character"
    );
  });

});
