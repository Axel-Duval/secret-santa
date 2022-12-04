const fs = require("fs");

function dimension(matrix) {
  return Math.sqrt(matrix.length);
}

function add(a, b) {
  if (a.length !== b.length) {
    throw new Error("Array dimensions are not equal");
  }
  let c = [];
  for (let i = 0; i < a.length; i++) {
    c.push(a[i] + b[i]);
  }
  return c;
}

function includes(matrix, n) {
  let i = 0;
  while (i < matrix.length) {
    if (matrix[i] === n) {
      return true;
    }
    i++;
  }
  return false;
}

function isValid(candidate, filter) {
  return !includes(add(candidate, filter), 2);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function draw(dim) {
  const random = shuffle([...Array(dim).keys()]);
  let candidate = [];
  for (let i = 0; i < dim; i++) {
    const row = Array(dim).fill(0);
    row.splice(random[i], 1, 1);
    candidate.push(...row);
  }
  return candidate;
}

function compute(filter) {
  while (true) {
    const candidate = draw(dimension(filter));
    if (isValid(candidate, filter)) {
      return candidate;
    }
  }
}

function main(outputDir, names, filter = Array(names.length ** 2).fill(0)) {
  if (outputDir.length === 0) {
    throw new Error("Invalid output directory");
  }
  if (names.length < 2) {
    throw new Error("You must provide at least 2 participants");
  }
  if (dimension(filter) !== names.length) {
    throw new Error("The filter matrix dimensions are not good");
  }
  if (fs.existsSync(outputDir)) {
    fs.rmdirSync(outputDir, { recursive: true, force: true });
  }

  fs.mkdirSync(outputDir);

  const matrix = compute(filter);
  const dim = dimension(matrix);
  for (let i = 0; i < dim; i++) {
    const from = names[i];
    const to = names[matrix.splice(0, dim).indexOf(1)];
    fs.writeFileSync(
      `${outputDir}/${from}.txt`,
      `Tu es le secret santa de ${to}`
    );
  }
}

const filter = [
    1, 1, 0, 0, 0, 0, 0,
    1, 1, 0, 0, 0, 0, 0,
    0, 0, 1, 1, 0, 0, 0,
    0, 0, 1, 1, 0, 0, 0,
    0, 0, 0, 0, 1, 1, 0,
    0, 0, 0, 0, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 1,
];

const names = [
  "Axel",
  "Fiona",
  "Corentin",
  "Marine",
  "Florent",
  "Emeline",
  "Florine",
];

main("santas", names, filter);
