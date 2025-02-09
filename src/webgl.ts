const canvas = document.getElementById("canvas") as HTMLCanvasElement;

export const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true })!;

if (!gl) throw new Error("WebGL not supported");

export function createShader(type: GLenum, source: string) {
  const shader = gl.createShader(type);

  if (!shader) throw new Error("Shader not created");

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) return shader;

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

export function createProgram(vertex: WebGLShader, fragment: WebGLShader) {
  const program = gl.createProgram();

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (success) return program;

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}
