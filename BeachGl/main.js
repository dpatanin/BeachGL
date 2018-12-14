let gl;
let program;

let objects = [];

let posLoc;

// DONE: Deklariere benötigte Locations von Shadervariablen als globale Variablen
let normalLoc,
    lightPositionLoc,
    IaLoc,
    IdLoc,
    IsLoc,
    kaLoc,
    kdLoc,
    ksLoc,
    specularExponentLoc;

let modelMatrixLoc;

let viewMatrixLoc,
    viewMatrix;

let eye,
    target,
    up;

const speed = 0.01;

let keyPressed = {
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false,
    KeyQ: false,
    KeyE: false
};

function main() {

    // Get canvas and setup WebGL context
    const canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext('webgl2');

    // Configure viewport
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.75, 0.8, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    // Init shader program via additional function and bind it
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Get locations of shader variables
    posLoc = gl.getAttribLocation(program, "vPosition");
    modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
    viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");

    // Fülle globale Variablen mit Speicherlocations für Materialkoeffizienten und Lichtintensitäten
    normalLoc = gl.getAttribLocation(program, "vNormal");
    lightPositionLoc = gl.getUniformLocation(program, "lightPosition");
    IaLoc = gl.getUniformLocation(program, "Ia");
    IdLoc = gl.getUniformLocation(program, "Id");
    IsLoc = gl.getUniformLocation(program, "Is");
    kaLoc = gl.getUniformLocation(program, "ka");
    kdLoc = gl.getUniformLocation(program, "kd");
    ksLoc = gl.getUniformLocation(program, "ks");
    specularExponentLoc = gl.getUniformLocation(program, "n");

    // Erstelle mithilfe der Funktionen aus gl-matrix.js eine initiale View Matrix
    eye = vec3.fromValues(0.0, 0.8, 4.0);
    target = vec3.fromValues(0.0, 0.8, 0.0);
    up = vec3.fromValues(0.0, 1.0, 0.0);

    viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, eye, target, up);

    gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);

    // Position und Intensitäten der Lichtquelle als Uniform-Variablen
    gl.uniform4fv(lightPositionLoc, [1.0, 2.0, 1.0, 0.0]);
    gl.uniform4fv(IaLoc, [0.3, 0.3, 0.3, 1.0]);
    gl.uniform4fv(IdLoc, [0.8, 0.8, 0.8, 1.0]);
    gl.uniform4fv(IsLoc, [0.7, 0.7, 0.7, 1.0]);

    // Event Listener für Tastatureingaben und Mausbewegung hinzu
    document.addEventListener("mousemove", changeView);
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    canvas.onmousedown = function () {
        canvas.requestPointerLock();
    }

    // Object instances
    let palmTree = new PalmTree();
    objects.push(palmTree);

    let palmLeaves = new PalmLeaves();
    objects.push(palmLeaves);

    let palmTree1 = new PalmTree();
    palmTree1.SetModelMatrix([-1.8, 0.05, -1.8], [0, 45, 0], [1.0, 1.0, 1.0]);
    objects.push(palmTree1);

    let palmLeaves1 = new PalmLeaves();
    palmLeaves1.SetModelMatrix([-1.8, 0.05, -1.8], [0, 45, 0], [1.0, 1.0, 1.0]);
    objects.push(palmLeaves1);

    let tree1 = new Tree1();
    objects.push(tree1);

    let treeLeaves1 = new TreeLeaves1();
    objects.push(treeLeaves1);

    let tree2 = new Tree2();
    objects.push(tree2);

    let treeLeaves2 = new TreeLeaves2();
    objects.push(treeLeaves2);

    let tree3 = new Tree3();
    objects.push(tree3);

    let treeLeaves3 = new TreeLeaves3();
    objects.push(treeLeaves3);

    let tree4 = new Tree4();
    objects.push(tree4);

    let treeLeaves4 = new TreeLeaves4();
    objects.push(treeLeaves4);

    let sea = new Sea();
    objects.push(sea);

    let stone1 = new Stone1();
    objects.push(stone1);

    let stone2 = new Stone2();
    objects.push(stone2);

    let surface = new Surface();
    objects.push(surface);

    gameLoop();
}

function update() {
    let look = vec3.create();
    vec3.sub(look, target, eye);
    vec3.scale(look, look, speed * 10);

    if (keyPressed.KeyW) {
        eye[0] += look[0];
        eye[2] += look[2];
        target[0] += look[0];
        target[2] += look[2];
    }
    if (keyPressed.KeyS) {
        eye[0] -= look[0];
        eye[2] -= look[2];
        target[0] -= look[0];
        target[2] -= look[2];
    }
    if (keyPressed.KeyA) {
        eye[0] += look[2];
        eye[2] -= look[0];
        target[0] += look[2];
        target[2] -= look[0];
    }
    if (keyPressed.KeyD) {
        eye[0] -= look[2];
        eye[2] += look[0];
        target[0] -= look[2];
        target[2] += look[0];
    }
    //UP AND DOWN CONTROLS

    if (keyPressed.KeyQ) {
        eye[1] += look[1];
        target[1] += look[1];
    }
    if (keyPressed.KeyE) {
        eye[1] -= look[1];
        target[1] -= look[1];
    }

    mat4.lookAt(viewMatrix, eye, target, up);
    gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
}

function render() {

    // Only clear once
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Call render function of each scene object
    for (let object of objects) {
        object.Render();
    }

    requestAnimationFrame(render);
}


function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

function keyDownHandler(e) {
    keyPressed[e.code] = true;
}

function keyUpHandler(e) {
    keyPressed[e.code] = false;
}

function changeView(e) {
    vec3.rotateY(target, target, eye, -e.movementX * speed);
    mat4.lookAt(viewMatrix, eye, target, up);
    gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);

}

main();
