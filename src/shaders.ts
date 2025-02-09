export const VEXTER_SHADER = `
    precision mediump float;

    attribute vec3 position;
    attribute vec3 color;
    varying vec3 vColor;

    uniform mat4 matrix;

    void main() {
        vColor = color;
        gl_Position = matrix * vec4(position, 1);
    }
`;

export const FRAGMENT_SHADER = `
    precision mediump float;

    varying vec3 vColor;
    
    void main() {
        gl_FragColor = vec4(vColor, 1);
    }
`;
