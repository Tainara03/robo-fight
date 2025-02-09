export type Matrix = number[];
export type Vector = number[];

export function vectorModulus(vector: Vector) {
  return Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2) + Math.pow(vector[2], 2));
}

export function unitVector(vector: Vector) {
  const vModulus = vectorModulus(vector);

  return vector.map((x) => x / vModulus);
}

export function radiansToDegree(r: number) {
  return (r * 180) / Math.PI;
}

export function crossProduct(vectorA: Vector, vectorB: Vector) {
  return [vectorA[1] * vectorB[2] - vectorA[2] * vectorB[1], vectorA[2] * vectorB[0] - vectorA[0] * vectorB[2], vectorA[0] * vectorB[1] - vectorA[1] * vectorB[0]];
}

export function degreeToRadians(d: number) {
  return (d * Math.PI) / 180;
}

export function identity(): number[] {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

export function multiply(matrixA: Matrix, matrixB: Matrix) {
  const a00 = matrixA[0 * 4 + 0];
  const a01 = matrixA[0 * 4 + 1];
  const a02 = matrixA[0 * 4 + 2];
  const a03 = matrixA[0 * 4 + 3];
  const a10 = matrixA[1 * 4 + 0];
  const a11 = matrixA[1 * 4 + 1];
  const a12 = matrixA[1 * 4 + 2];
  const a13 = matrixA[1 * 4 + 3];
  const a20 = matrixA[2 * 4 + 0];
  const a21 = matrixA[2 * 4 + 1];
  const a22 = matrixA[2 * 4 + 2];
  const a23 = matrixA[2 * 4 + 3];
  const a30 = matrixA[3 * 4 + 0];
  const a31 = matrixA[3 * 4 + 1];
  const a32 = matrixA[3 * 4 + 2];
  const a33 = matrixA[3 * 4 + 3];
  const b00 = matrixB[0 * 4 + 0];
  const b01 = matrixB[0 * 4 + 1];
  const b02 = matrixB[0 * 4 + 2];
  const b03 = matrixB[0 * 4 + 3];
  const b10 = matrixB[1 * 4 + 0];
  const b11 = matrixB[1 * 4 + 1];
  const b12 = matrixB[1 * 4 + 2];
  const b13 = matrixB[1 * 4 + 3];
  const b20 = matrixB[2 * 4 + 0];
  const b21 = matrixB[2 * 4 + 1];
  const b22 = matrixB[2 * 4 + 2];
  const b23 = matrixB[2 * 4 + 3];
  const b30 = matrixB[3 * 4 + 0];
  const b31 = matrixB[3 * 4 + 1];
  const b32 = matrixB[3 * 4 + 2];
  const b33 = matrixB[3 * 4 + 3];

  return [
    b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
    b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
    b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
    b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
    b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
    b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
    b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
    b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
    b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
    b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
    b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
    b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
    b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
    b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
    b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
    b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
  ];
}

export function translation(tx: number, ty: number, tz: number) {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
}

export function xRotation(angleInRadians: number) {
  const c = Math.cos(angleInRadians);
  const s = Math.sin(angleInRadians);

  return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
}

export function yRotation(angleInRadians: number) {
  const c = Math.cos(angleInRadians);
  const s = Math.sin(angleInRadians);

  return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
}

export function zRotation(angleInRadians: number) {
  const c = Math.cos(angleInRadians);
  const s = Math.sin(angleInRadians);

  return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

export function scaling(sx: number, sy: number, sz: number) {
  return [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1];
}

export function translate(matrix: Matrix, tx: number, ty: number, tz: number) {
  return multiply(matrix, translation(tx, ty, tz));
}

export function xRotate(matrix: Matrix, angleInRadians: number) {
  return multiply(matrix, xRotation(angleInRadians));
}

export function yRotate(matrix: Matrix, angleInRadians: number) {
  return multiply(matrix, yRotation(angleInRadians));
}

export function zRotate(matrix: Matrix, angleInRadians: number) {
  return multiply(matrix, zRotation(angleInRadians));
}

export function scale(matrix: Matrix, sx: number, sy: number, sz: number) {
  return multiply(matrix, scaling(sx, sy, sz));
}

export function transpose(matrix: Matrix) {
  return [matrix[0], matrix[4], matrix[8], matrix[12], matrix[1], matrix[5], matrix[9], matrix[13], matrix[2], matrix[6], matrix[10], matrix[14], matrix[3], matrix[7], matrix[11], matrix[15]];
}

export function getRotationMatrix(P1: number[], P2: number[], theta: number) {
  let matrix = identity();

  const N = [P2[0] - P1[0], P2[1] - P1[1], P2[2] - P1[2]];

  const n = unitVector(N);

  //parallel to z-axis
  if (n[0] == 0 && n[1] == 0) {
    matrix = translation(P1[0], P1[1], P1[2]);
    matrix = multiply(matrix, zRotation(degreeToRadians(theta)));
    matrix = multiply(matrix, translation(-P1[0], -P1[1], -P1[2]));
    return matrix;
  }

  //parallel to y-axis
  if (n[0] == 0 && n[2] == 0) {
    matrix = translation(P1[0], P1[1], P1[2]);
    matrix = multiply(matrix, yRotation(degreeToRadians(theta)));
    matrix = multiply(matrix, translation(-P1[0], -P1[1], -P1[2]));
    return matrix;
  }

  //parallel to x-axis
  if (n[1] == 0 && n[2] == 0) {
    matrix = translation(P1[0], P1[1], P1[2]);
    matrix = multiply(matrix, xRotation(degreeToRadians(theta)));
    matrix = multiply(matrix, translation(-P1[0], -P1[1], -P1[2]));
    return matrix;
  }

  const a = n[0];
  const b = n[1];
  const c = n[2];
  const d = Math.sqrt(Math.pow(b, 2) + Math.pow(c, 2));

  const T_p1_origin = [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, -P1[0], -P1[1], -P1[2], 1.0];

  const Rx_alpha = [1.0, 0.0, 0.0, 0.0, 0.0, c / d, b / d, 0.0, 0.0, -b / d, c / d, 0.0, 0.0, 0.0, 0.0, 1.0];

  const Ry_beta = [d, 0.0, a, 0.0, 0.0, 1.0, 0.0, 0.0, -a, 0.0, d, 0.0, 0.0, 0.0, 0.0, 1.0];

  const Rz_theta = zRotation(degreeToRadians(theta));

  const T_origin_p1 = [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, P1[0], P1[1], P1[2], 1.0];

  matrix = multiply(matrix, T_origin_p1);
  matrix = multiply(matrix, transpose(Rx_alpha));
  matrix = multiply(matrix, transpose(Ry_beta));
  matrix = multiply(matrix, Rz_theta);
  matrix = multiply(matrix, Ry_beta);
  matrix = multiply(matrix, Rx_alpha);
  matrix = multiply(matrix, T_p1_origin);

  return matrix;
}

export function getOrtographicProjection(xw_min: number, xw_max: number, yw_min: number, yw_max: number, z_near: number, z_far: number) {
  return [2 / (xw_max - xw_min), 0, 0, 0, 0, 2 / (yw_max - yw_min), 0, 0, 0, 0, -2 / (z_near - z_far), 0, -(xw_max + xw_min) / (xw_max - xw_min), -(yw_max + yw_min) / (yw_max - yw_min), (z_near + z_far) / (z_near - z_far), 1];
}

export function getPerspectiveProjection(xw_min: number, xw_max: number, yw_min: number, yw_max: number, z_near: number, z_far: number) {
  return [-(2 * z_near) / (xw_max - xw_min), 0, 0, 0, 0, -(2 * z_near) / (yw_max - yw_min), 0, 0, (xw_max + xw_min) / (xw_max - xw_min), (yw_max + yw_min) / (yw_max - yw_min), (z_near + z_far) / (z_near - z_far), -1, 0, 0, -1, 0];
}

export function getViewingMatrix(P0: Vector, P_ref: Vector, V: Vector) {
  const N = [P0[0] - P_ref[0], P0[1] - P_ref[1], P0[2] - P_ref[2]];
  const n = unitVector(N);
  const u = unitVector(crossProduct(V, n));
  const v = crossProduct(n, u);

  const T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -P0[0], -P0[1], -P0[2], 1];

  const R = [u[0], v[0], n[0], 0, u[1], v[1], n[1], 0, u[2], v[2], n[2], 0, 0, 0, 0, 1];

  return multiply(R, T);
}
