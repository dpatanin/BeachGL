let gl;
let defaultProgram,
    waterProgram;

let objects = [];

let viewMatrix,
    projectionMatrix;

let eye,
    target,
    up;

let keyPressed = {
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false
};

const speed = 0.01;

function main() {

    // Get canvas and setup WebGL context
    const canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext('webgl2');

    // Configure viewport
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.75, 0.8, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    // Init shader program via additional function and bind it
    defaultProgram = initShaders(gl, "vertex-shader", "fragment-shader");
    waterProgram = initShaders(gl, "vertex-shader-water", "fragment-shader-water");

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

    // Compute view matrix
    eye = vec3.fromValues(0.0, 5.0, 4.0);
    target = vec3.fromValues(0.0, 5.0, 0.0);
    up = vec3.fromValues(0.0, 1.0, 0.0);

    viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, eye, target, up);

    // Compute projection matrix
    projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI * 0.25, canvas.width / canvas.height, 0.5, 100);

    for(let object of objects) {

        gl.useProgram(object.shader);

        // Set view and projection matrix
        gl.uniformMatrix4fv(object.viewMatrixLoc, false, viewMatrix);
        gl.uniformMatrix4fv(object.projectionMatrixLoc, false, projectionMatrix);

        // Set position und intensity of the light source
        gl.uniform3fv(object.lightPositionLoc, [1.0, 2.0, 1.0]);
        gl.uniform4fv(object.IaLoc, [0.3, 0.3, 0.3, 1.0]);
        gl.uniform4fv(object.IdLoc, [0.8, 0.8, 0.8, 1.0]);
        gl.uniform4fv(object.IsLoc, [0.7, 0.7, 0.7, 1.0]);
    }

    document.addEventListener("keydown", keydown);
    document.addEventListener("keyup", keyup);
    document.addEventListener("mousemove", changeView);

    canvas.onmousedown = function () {
        canvas.requestPointerLock();
    };

    gameLoop();
}

function update()
{
    let look = vec3.create();
    vec3.sub(look, target, eye);
    vec3.scale(look, look, speed);

    if(keyPressed.KeyW) {
        eye[0] += look[0];
        eye[2] += look[2];
        target[0] += look[0];
        target[2] += look[2];
    }
    if(keyPressed.KeyS) {
        eye[0] -= look[0];
        eye[2] -= look[2];
        target[0] -= look[0];
        target[2] -= look[2];
    }
    if(keyPressed.KeyA) {
        eye[0] += look[2];
        eye[2] -= look[0];
        target[0] += look[2];
        target[2] -= look[0];
    }
    if(keyPressed.KeyD) {
        eye[0] -= look[2];
        eye[2] += look[0];
        target[0] -= look[2];
        target[2] += look[0];
    }
    mat4.lookAt(viewMatrix, eye, target, up);
    for(let object of objects) {
        gl.useProgram(object.shader);
        gl.uniformMatrix4fv(object.viewMatrixLoc, false, viewMatrix);
    }
}

function render() {

    // Only clear once
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Call render function of each scene object
    for(let object of objects) {
        object.Render();
    };
}


function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

function keydown(e)
{
    keyPressed[e.code] = true;
}

function keyup(e)
{
    keyPressed[e.code] = false;
}

function changeView(e)
{
    vec3.rotateY(target, target, eye, -e.movementX * speed);
    mat4.lookAt(viewMatrix, eye, target, up);
    for(let object of objects) {
        gl.useProgram(object.shader);
        gl.uniformMatrix4fv(object.viewMatrixLoc, false, viewMatrix);
    }
}

main();
