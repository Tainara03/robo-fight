export function randomColor() {
  return [Math.random(), Math.random(), Math.random()];
}

export function generateColorSet(length = 24) {
  const data = [];

  for (let i = 0; i <= length; i++) data.push(...randomColor());

  return data;
}

export function getColorAt(index: number, data: number[]) {
  return [data[index * 3], data[index * 3 + 1], data[index * 3 + 2]];
}
