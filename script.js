const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
gl.viewport(0, 0, canvas.width, canvas.height);

if (!gl) {
    alert("WebGL não suportado");
}

const vertexShaderSource = `
    attribute vec2 a_position;
    uniform vec2 u_translation;
    void main() {
        gl_Position = vec4(a_position + u_translation, 0, 1);
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    uniform vec4 u_color;
    void main() {
        gl_FragColor = u_color;
    }
`;

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Erro no shader:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Erro ao linkar programa:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

const positionLocation = gl.getAttribLocation(program, "a_position");
const translationLocation = gl.getUniformLocation(program, "u_translation");
const colorLocation = gl.getUniformLocation(program, "u_color");

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

function drawRobot(x, y, color) {
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(colorLocation, color);

    const body = [
        -0.05, -0.1,
         0.05, -0.1,
        -0.05,  0.1,
         0.05,  0.1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(body), gl.STATIC_DRAW);
    gl.uniform2f(translationLocation, x, y);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function drawWheel(x, y, color) {
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(colorLocation, color);

    const wheel = [
        -0.02, -0.02,
         0.02, -0.02,
        -0.02,  0.02,
         0.02,  0.02,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wheel), gl.STATIC_DRAW);
    gl.uniform2f(translationLocation, x, y);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function drawCylinder(x, y, radius, height, color) {
    const numSegments = 30;
    const angleStep = 2 * Math.PI / numSegments;
    let vertices = [];
    
    for (let i = 0; i < numSegments; i++) {
        const angle = i * angleStep;
        const nextAngle = (i + 1) * angleStep;
        
        vertices.push(radius * Math.cos(angle), radius * Math.sin(angle));
        vertices.push(radius * Math.cos(nextAngle), radius * Math.sin(nextAngle));
        vertices.push(0, 0);
        
        vertices.push(radius * Math.cos(angle), radius * Math.sin(angle) - height);
        vertices.push(radius * Math.cos(nextAngle), radius * Math.sin(nextAngle) - height);
        vertices.push(0, 0);
    }

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(colorLocation, color);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.uniform2f(translationLocation, x, y);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 2);
}

function drawScene() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    drawCylinder(0, -0.2, 0.8, 0.1, [0.5, 0.5, 0.5, 1]);

    drawRobot(player1X, 0, player1Defending ? [1, 1, 0, 1] : [1, 0, 0, 1]);
    drawRobot(player2X, 0, player2Defending ? [0, 1, 1, 1] : [0, 0, 1, 1]);

    drawWheel(player1X - 0.05, -0.1, [0, 0, 0, 1]);
    drawWheel(player1X + 0.05, -0.1, [0, 0, 0, 1]);
    drawWheel(player2X - 0.05, -0.1, [0, 0, 0, 1]);
    drawWheel(player2X + 0.05, -0.1, [0, 0, 0, 1]);

    drawCylinder(-0.6, 0.4, 0.05, 0.2, [1, 1, 0, 1]);
    drawCylinder(0.6, 0.4, 0.05, 0.2, [1, 1, 0, 1]);

    drawRectangle(-0.9, -0.7, 0.1, 0.2, [0.8, 0.8, 0.8, 1]);
    drawRectangle(0.8, -0.7, 0.1, 0.2, [0.8, 0.8, 0.8, 1]);

    if (player1Attacking) {
        drawSword(player1X + 0, 0.15, [1, 0, 0, 1]);
    }
    if (player2Attacking) {
        drawSword(player2X - 0, 0.15, [0, 0, 1, 1]);
    }
    if (player1Defending) {
        drawShield(player1X + 0, -0.3, [1, 1, 0, 1]);
    }
    if (player2Defending) {
        drawShield(player2X - 0, -0.3, [0, 1, 1, 1]);
    }

    requestAnimationFrame(drawScene);
}

function drawRectangle(x, y, width, height, color) {
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(colorLocation, color);

    const rect = [
        x - width / 2, y - height / 2,
        x + width / 2, y - height / 2,
        x - width / 2, y + height / 2,
        x + width / 2, y + height / 2,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rect), gl.STATIC_DRAW);
    gl.uniform2f(translationLocation, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function drawSword(x, y, color) {
    const sword = [
        -0.01, -0.01,
         0.01, -0.09,
        -0.01,  0.01,
         0.01,  0.09,
    ];
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(colorLocation, color);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sword), gl.STATIC_DRAW);
    gl.uniform2f(translationLocation, x, y);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function drawShield(x, y, color) {
    const shield = [
        -0.02, 0.1, 
         0.02, 0.1, 
         0,   -0.1,
    ];
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(colorLocation, color);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shield), gl.STATIC_DRAW);
    gl.uniform2f(translationLocation, x, y + 0.2);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
}

requestAnimationFrame(drawScene);


let player1X = -0.5;
let player2X = 0.5;
let player1Attacking = false;
let player2Attacking = false;
let player1Defending = false;
let player2Defending = false;

const messageElement = document.createElement("div");
messageElement.style.position = "absolute";
messageElement.style.top = "10px";
messageElement.style.left = "50%";
messageElement.style.transform = "translateX(-50%)";
messageElement.style.color = "white";
messageElement.style.fontSize = "24px";
messageElement.style.display = "none";
document.body.appendChild(messageElement);

function showMessage(message) {
    messageElement.innerText = message;
    messageElement.style.display = "block";
    setTimeout(() => {
        messageElement.style.display = "none";
        resetGame();
    }, 2000);
}

function checkCollision() {
    if (player1Attacking && !player2Defending && Math.abs(player1X - player2X) < 0.1) {
        showMessage("Jogador 1 venceu!");
    } else if (player2Attacking && !player1Defending && Math.abs(player1X - player2X) < 0.1) {
        showMessage("Jogador 2 venceu!");
    }
}

function resetGame() {
    player1X = -0.5;
    player2X = 0.5;
    player1Attacking = false;
    player2Attacking = false;
    player1Defending = false;
    player2Defending = false;
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") player1X -= 0.05;
    if (event.key === "ArrowRight") player1X += 0.05;
    if (event.key === "a") player2X -= 0.05;
    if (event.key === "d") player2X += 0.05;

    if (event.key === "ArrowUp") player1Attacking = true;
    if (event.key === "w") player2Attacking = true;

    if (event.key === "ArrowDown") player1Defending = true;
    if (event.key === "s") player2Defending = true;
    
    checkCollision();
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowUp") player1Attacking = false;
    if (event.key === "w") player2Attacking = false;

    if (event.key === "ArrowDown") player1Defending = false;
    if (event.key === "s") player2Defending = false;
});

