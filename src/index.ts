interface Point {
  x: number;
  y: number;
}

export class PathFollower {
  private map: string[][];
  private lettersCollected: string;
  private path: string;
  private visitedPositions: Set<string>;
  private startPosition: Point;
  private endPosition: Point;

  constructor(map: string[][]) {
    this.map = map;
    this.lettersCollected = "";
    this.path = "";
    this.visitedPositions = new Set();

    this.validateMap();
    this.startPosition = this.getStartPosition();
    this.endPosition = this.getEndPosition();

    this.checkConnectivity();
    this.checkMultipleStartingPaths();
  }

  //Check if it is a letter
  private isLetter(char: string): boolean {
    return /^[A-Z]$/.test(char);
  }

  //Get starting position of the starting character '@'
  private getStartPosition(): Point {
    for (let y = 0; y < this.map.length; y++) {
      const x = this.map[y].indexOf("@");
      if (x !== -1) {
        return { x, y };
      }
    }
    throw new Error("Invalid map: Missing start character @");
  }

  //Get end position of the ending character 'x'
  private getEndPosition(): Point {
    for (let y = 0; y < this.map.length; y++) {
      const x = this.map[y].indexOf("x");
      if (x !== -1) {
        return { x, y };
      }
    }
    throw new Error(
      "Invalid map: There should be at least one end character x"
    );
  }

  //Check if map is valid, if there is only 1 start character '@' and at least one ending character 'x'
  private validateMap(): void {
    let startCount = 0;
    let endCount = 0;

    for (const row of this.map) {
      for (const char of row) {
        if (char === "@") {
          startCount++;
        } else if (char === "x") {
          endCount++;
        }
        // Validate each character to check if there are any invalid characters present inside the map
        if (
          !this.isLetter(char) &&
          ![" ", "@", "x", "|", "-", "+"].includes(char)
        ) {
          throw new Error("Invalid map: Contains invalid character");
        }
      }
    }

    //Check if there are more than 1 starts
    if (startCount !== 1) {
      throw new Error(
        "Invalid map: There should be exactly one start character @"
      );
    }

    //Check if there is at least 1 end character
    if (endCount < 1) {
      throw new Error(
        "Invalid map: There should be at least one end character x"
      );
    }
  }

  private checkConnectivity(): void {
    const visited = new Set<string>();
    const queue: Point[] = [this.startPosition];

    while (queue.length > 0) {
      const { x, y } = queue.shift()!;
      const posKey = `${x},${y}`;

      if (visited.has(posKey)) continue;
      visited.add(posKey);

      if (x === this.endPosition.x && y === this.endPosition.y) {
        return; // Path is connected
      }

      const neighbors = [
        { x: x + 1, y },
        { x: x - 1, y },
        { x, y: y + 1 },
        { x, y: y - 1 },
      ];

      for (const neighbor of neighbors) {
        const { x: nx, y: ny } = neighbor;
        if (
          nx >= 0 &&
          ny >= 0 &&
          ny < this.map.length &&
          nx < this.map[ny].length &&
          this.map[ny][nx] !== " " &&
          !visited.has(`${nx},${ny}`)
        ) {
          queue.push(neighbor);
        }
      }
    }

    throw new Error("Invalid map: Broken path");
  }

  private checkMultipleStartingPaths(): void {
    const { x, y } = this.startPosition;
    const possibleDirections = [
      { x: 0, y: -1 }, // up
      { x: 0, y: 1 }, // down
      { x: -1, y: 0 }, // left
      { x: 1, y: 0 }, // right
    ];

    const validPaths = possibleDirections.filter((dir) => {
      const nx = x + dir.x;
      const ny = y + dir.y;
      return (
        nx >= 0 &&
        ny >= 0 &&
        ny < this.map.length &&
        nx < this.map[ny].length &&
        this.map[ny][nx] !== " "
      );
    });

    if (validPaths.length > 1) {
      throw new Error("Invalid map: Multiple starting paths");
    }
  }

  private followPath(position: Point, direction: Point): void {
    while (true) {
      const { x, y } = position;
      if (x < 0 || y < 0 || y >= this.map.length || x >= this.map[y].length) {
        throw new Error("Invalid map: Broken path");
      }

      const currentChar = this.map[y][x];
      this.path += currentChar;
      const posKey = `${x},${y}`;

      if (currentChar === "x") {
        break;
      }

      if (this.isLetter(currentChar) && !this.visitedPositions.has(posKey)) {
        this.lettersCollected += currentChar;
        this.visitedPositions.add(posKey);
      }

      const nextPosition = this.getNextPosition(
        position,
        direction,
        currentChar
      );
      const possibleDirections = [
        { x: 0, y: -1 }, // up
        { x: 0, y: 1 }, // down
        { x: -1, y: 0 }, // left
        { x: 1, y: 0 }, // right
      ];

      const validDirections = possibleDirections.filter((dir) => {
        const checkX = x + dir.x;
        const checkY = y + dir.y;
        return (
          checkX >= 0 &&
          checkY >= 0 &&
          checkY < this.map.length &&
          checkX < this.map[checkY].length &&
          this.map[checkY][checkX] !== " " &&
          !(dir.x === -direction.x && dir.y === -direction.y) // avoid going back
        );
      });

      //If we are currently on an intersection, and there are more than 1 valid path/turns ( not including the way we came from )
      //we should throw error for fork
      if (validDirections.length > 1 && currentChar === "+") {
        const turns = validDirections.filter(
          (dir) => !(dir.x === direction.x && dir.y === direction.y)
        );
        if (turns.length > 1) {
          throw new Error("Invalid map: Fork in path");
        }
      }
      if (nextPosition) {
        position.x = nextPosition.x;
        position.y = nextPosition.y;
        direction.x = nextPosition.direction.x;
        direction.y = nextPosition.direction.y;
      }
    }
  }

  private getNextPosition(
    position: Point,
    direction: Point,
    currentChar: string
  ): { x: number; y: number; direction: Point } | null {
    const { x, y } = position;
    const nextX = x + direction.x;
    const nextY = y + direction.y;

    // If the current character is not '+', continue straight if possible
    if (currentChar !== "+") {
      if (
        nextX >= 0 &&
        nextY >= 0 &&
        nextY < this.map.length &&
        nextX < this.map[nextY].length &&
        this.map[nextY][nextX] !== " "
      ) {
        return { x: nextX, y: nextY, direction };
      }
    }

    // Handle '+' intersection
    const possibleDirections = [
      { x: 0, y: -1 }, // up
      { x: 0, y: 1 }, // down
      { x: -1, y: 0 }, // left
      { x: 1, y: 0 }, // right
    ];

    const validDirections = possibleDirections.filter((dir) => {
      const checkX = x + dir.x;
      const checkY = y + dir.y;
      return (
        checkX >= 0 &&
        checkY >= 0 &&
        checkY < this.map.length &&
        checkX < this.map[checkY].length &&
        this.map[checkY][checkX] !== " " &&
        !(dir.x === -direction.x && dir.y === -direction.y) // avoid going back
      );
    });

    // Check for fake turns
    if (currentChar === "+") {
      const turns = validDirections.filter(
        (dir) => !(dir.x === direction.x && dir.y === direction.y)
      );
      if (turns.length === 0) {
        throw new Error("Invalid map: Fake turn");
      }
    }

    if (validDirections.length > 0) {
      for (const validDirection of validDirections) {
        const checkX = x + validDirection.x;
        const checkY = y + validDirection.y;

        if (
          checkX >= 0 &&
          checkY >= 0 &&
          checkY < this.map.length &&
          checkX < this.map[checkY].length &&
          this.map[checkY][checkX] !== " " &&
          !(
            validDirection.x === direction.x && validDirection.y === direction.y
          ) // avoid going straight
        ) {
          return {
            x: checkX,
            y: checkY,
            direction: validDirection,
          };
        }
      }
    }

    return null;
  }

  public execute(): { lettersCollected: string; path: string } {
    this.followPath(this.startPosition, { x: 1, y: 0 });

    return {
      lettersCollected: this.lettersCollected,
      path: this.path,
    };
  }
}

// Example usage
const exampleMap: string[][] = [
  ["@", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  ["|", " ", "+", "-", "C", "-", "-", "+", " ", " "],
  ["A", " ", "|", " ", " ", " ", " ", "|", " ", " "],
  ["+", "-", "-", "-", "B", "-", "-", "+", " ", " "],
  [" ", " ", "|", " ", " ", " ", " ", " ", " ", "x"],
  [" ", " ", "|", " ", " ", " ", " ", " ", " ", "|"],
  [" ", " ", "+", "-", "-", "-", "D", "-", "-", "+"],
];

const pathFollower = new PathFollower(exampleMap);
const result = pathFollower.execute();
console.log("Letters:", result.lettersCollected);
console.log("Path:", result.path);
