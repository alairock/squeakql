export const arrayTransposeMatrix = <T = any>(matrix: T[][], numRows?: number) => {
  const grid: T[][] = []

  if (!matrix || matrix.length === 0) {
    return grid
  }

  const rows = numRows ? Math.min(matrix.length, numRows) : matrix.length,
    cols = matrix[0].length
  for (let j = 0; j < cols; j++) {
    grid[j] = Array(rows)
  }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[j][i] = matrix[i][j]
    }
  }
  return grid
}
