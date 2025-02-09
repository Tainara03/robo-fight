import { canvas, createProgram, createShader, gl } from "./webgl";
import { FRAGMENT_SHADER, VEXTER_SHADER } from "./shaders";
import { degreeToRadians, getOrtographicProjection, getPerspectiveProjection, getViewingMatrix, identity, multiply, scale, translate, yRotate } from "./transform";

function main() {
  const vertexShader = createShader(gl.VERTEX_SHADER, VEXTER_SHADER);
  const fragmentShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

  const program = createProgram(vertexShader, fragmentShader);

  gl.useProgram(program);

  gl.enable(gl.DEPTH_TEST);

  const positionBuffer = gl.createBuffer();

  const positionLocation = gl.getAttribLocation(program, `position`);
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

  const colorBuffer = gl.createBuffer();

  const colorLocation = gl.getAttribLocation(program, `color`);
  gl.enableVertexAttribArray(colorLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

  const matrixUniformLocation = gl.getUniformLocation(program, `matrix`);

  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  let vertexData = setCubeVertices();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

  let colorData = setCubeColors();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

  gl.viewport(0, 0, canvas.width, canvas.height);
  const P0 = [1.0, 1.0, 2.0];
  const P_ref = [0.0, 0.0, 0.0];
  const V = [0.0, 1.0, 0.0];
  let viewingMatrix = getViewingMatrix(P0, P_ref, V);
  const xw_min = -1.0;
  const xw_max = 1.0;
  const yw_min = -1.0;
  const yw_max = 1.0;
  const z_near = -0.0;
  const z_far = -20.0;

  let viewingProjectionMatrix: number[] = [];

  const bodyElement = document.getElementsByTagName("body")[0]!;

  bodyElement.addEventListener("keydown", keyDown, false);

  function keyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "1":
        let orthographicMatrix = getOrtographicProjection(xw_min, xw_max, yw_min, yw_max, z_near, z_far);
        viewingProjectionMatrix = identity();
        viewingProjectionMatrix = multiply(viewingProjectionMatrix, orthographicMatrix);
        viewingProjectionMatrix = multiply(viewingProjectionMatrix, viewingMatrix);
        break;
      case "2":
        let perspectiveMatrix = getPerspectiveProjection(xw_min, xw_max, yw_min, yw_max, z_near, z_far);
        viewingProjectionMatrix = identity();
        viewingProjectionMatrix = multiply(viewingProjectionMatrix, perspectiveMatrix);
        viewingProjectionMatrix = multiply(viewingProjectionMatrix, viewingMatrix);
        break;
    }
  }

  let theta = 0.0;

  function drawCube() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta += 1.0;

    let modelMatrix = identity();
    modelMatrix = yRotate(modelMatrix, degreeToRadians(theta));
    modelMatrix = translate(modelMatrix, 0.0, 0.0, 1.0);
    modelMatrix = scale(modelMatrix, 0.5, 0.5, 0.5);
    let matrix = identity();
    matrix = multiply(matrix, viewingProjectionMatrix);
    matrix = multiply(matrix, modelMatrix);
    gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);

    modelMatrix = identity();
    modelMatrix = yRotate(modelMatrix, degreeToRadians(theta));
    modelMatrix = translate(modelMatrix, 0.0, 0.0, -1.0);
    modelMatrix = scale(modelMatrix, 0.5, 0.5, 0.5);
    matrix = identity();
    matrix = multiply(matrix, viewingProjectionMatrix);
    matrix = multiply(matrix, modelMatrix);
    gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);

    modelMatrix = identity();
    modelMatrix = yRotate(modelMatrix, degreeToRadians(theta));
    modelMatrix = translate(modelMatrix, 1.0, 0.0, 0.0);
    modelMatrix = scale(modelMatrix, 0.5, 0.5, 0.5);
    matrix = identity();
    matrix = multiply(matrix, viewingProjectionMatrix);
    matrix = multiply(matrix, modelMatrix);
    gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);

    modelMatrix = identity();
    modelMatrix = yRotate(modelMatrix, degreeToRadians(theta));
    modelMatrix = translate(modelMatrix, -1.0, 0.0, 0.0);
    modelMatrix = scale(modelMatrix, 0.5, 0.5, 0.5);
    matrix = identity();
    matrix = multiply(matrix, viewingProjectionMatrix);
    matrix = multiply(matrix, modelMatrix);
    gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);

    requestAnimationFrame(drawCube);
  }

  drawCube();
}

function setCubeVertices() {
  const vertexData = [
    // Front
    0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5,

    // Left
    -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5,

    // Back
    -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5,

    // Right
    0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5,

    // Top
    0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5,

    // Bottom
    0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5,
  ];
  return vertexData;
}

function setCubeColors() {
  function randomColor() {
    return [Math.random(), Math.random(), Math.random()];
  }

  let colorData = [];
  for (let face = 0; face < 6; face++) {
    let faceColor = randomColor();
    for (let vertex = 0; vertex < 6; vertex++) {
      colorData.push(...faceColor);
    }
  }
  return colorData;
}

main();
