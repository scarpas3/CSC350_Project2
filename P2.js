//Anthony Scarpa
//CSC350-02
//Project 2 - Rat in Maze
//you should give me extra credit if you find the movie reference in my code :DD

"use strict";
//global variables
var gl;
var translationMatrixX = -11 / 12; //where the rat starts on the x axis
var translationMatrixY = 5 / 12; //where the rat starts on the y axis
var modelViewMatrixLoc; //matrix that is sent to html to translate and rotate
var currDirection = 1; //current direction of rate. starts at 1 (up). the rat's rotation in radians is 90* current direction
var numPoints = 0; //for creating the maze
var thinRedLine = 1; //number of points on the rat's trail
var ratLocX = -11 / 12; //current x location of the rat (for the red trail)
var ratLocY = 5 / 12; //current y location of the rat (for the red trail)
var red; //just a vec3 for the color red
var program;
var cBuffer;
var vBuffer;    //all the variables for sending to the shader
var vColor;
var vPosition;
window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext("webgl2");
    if (!gl) {
        alert("WebGL 2.0 isn't available");
    }
    var currXLoc = -1;
    var currYLoc = 1;
    var vertices = [];
    var color;
    var colors = [];
    for (var l = 0; l < 12; l++) {
        for (var s = 0; s < 12; s++) {
            color = vec3(1.0, 1.0, 1.0);
            vertices.push(vec2(currXLoc, currYLoc));
            colors.push(color);
            vertices.push(vec2(currXLoc, currYLoc - 2 / 12));
            colors.push(color);
            vertices.push(vec2(currXLoc + 2 / 12, currYLoc)); //pushing all the vertices needed, 
            colors.push(color); //as well as getting a white background for the maze
            vertices.push(vec2(currXLoc + 2 / 12, currYLoc - 2 / 12));
            colors.push(color);
            currXLoc = currXLoc + 2 / 12;
        }
        currYLoc = currYLoc - 2 / 12;
        currXLoc = -1;
    }

    var rows = [
        11, 7, 13, 7, 10, 3, 7, 7, 13, 7, 7, 10,
        6, 5, 6, 5, 9, 10, 11, 7, 8, 11, 10, 6,
        14, 8, 6, 9, 7, 12, 15, 5, 11, 15, 11, 8,
        8, 11, 15, 11, 10, 3, 8, 14, 8, 9, 8, 5,
        11, 8, 1, 6, 9, 7, 10, 9, 10, 3, 7, 15,
        14, 7, 7, 12, 7, 2, 9, 10, 9, 7, 10, 6,// this is the entire maze, with each number representing
        6, 11, 7, 10, 11, 7, 7, 8, 11, 2, 9, 15,// a type of square. Since it is a 12 x 12 grid, the array
        6, 6, 5, 6, 6, 3, 13, 13, 8, 11, 13, 8,// has 144 elements.
        6, 6, 6, 6, 9, 10, 6, 6, 11, 8, 3, 10,
        6, 9, 15, 9, 10, 6, 1, 6, 6, 3, 13, 16,
        6, 5, 6, 5, 1, 9, 10, 6, 9, 7, 8, 6,
        9, 8, 9, 12, 7, 7, 8, 9, 7, 7, 7, 8];
    for (var x = 0; x < 144; ++x) {
        // what follows is a type of square for each scenario. For the exit, there was a blank square, so I just put it down as 16
        if (rows[x] == 1) {
            vertices.push(vertices[x * 4 + 1]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 3]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 1]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 2]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 3]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
        }

        if (rows[x] == 2) {
            vertices.push(vertices[x * 4]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 2]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 2]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 3]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 1]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 3]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
        }

        if (rows[x] == 3) {
            vertices.push(vertices[x * 4]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 2]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 1]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 1]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 3]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
        }

        if (rows[x] == 5) {
            vertices.push(vertices[x * 4]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 2]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 1]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 2]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 3]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
        }

        if (rows[x] == 6) {
            vertices.push(vertices[x * 4]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 1]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 2]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 3]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
        }


        if (rows[x] == 7) {
            vertices.push(vertices[x * 4]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 2]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 1]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 3]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
        }

        if (rows[x] == 8) {
            vertices.push(vertices[x * 4 + 1]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 3]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 2]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 3]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
        }

        if (rows[x] == 9) {
            vertices.push(vertices[x * 4]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 1]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 1]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 3]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
        }

        if (rows[x] == 10) {
            vertices.push(vertices[x * 4]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 2]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 2]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 3]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
        }

        if (rows[x] == 11) {
            vertices.push(vertices[x * 4]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 1]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 2]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
        }

        if (rows[x] == 12) {
            vertices.push(vertices[x * 4 + 1]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 3]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
        }

        if (rows[x] == 13) {
            vertices.push(vertices[x * 4]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 2]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
        }

        if (rows[x] == 14) {
            vertices.push(vertices[x * 4]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 1]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
        }

        if (rows[x] == 15) {
            vertices.push(vertices[x * 4 + 2]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
            vertices.push(vertices[x * 4 + 3]);
            colors.push(vec3(0.0, 0.0, 0.0));
            numPoints++;
        }
    }

    vertices.push(vec2(0, 0 - 0.5 / 12));
    colors.push(vec3(0.5, 0.5, 0.5));
    vertices.push(vec2(0 + 0.5 / 12, 0));
    colors.push(vec3(0.5, 0.5, 0.5));
    vertices.push(vec2(0, 0 + 0.5 / 12));
    colors.push(vec3(0.5, 0.5, 0.5));

    vertices.push(vec2(0, 0 - 0.25 / 12));
    colors.push(vec3(0.5, 0.5, 0.5));
    vertices.push(vec2(0, 0 + 0.25 / 12));
    colors.push(vec3(0.5, 0.5, 0.5));
    vertices.push(vec2(0 - 0.5 / 12, 0));
    colors.push(vec3(0.5, 0.5, 0.5));
    vertices.push(vec2(0 + 0.5 / 12, 0));
    colors.push(vec3(0.5, 0.5, 0.5));
    vertices.push(vec2(0.0, 0.0));
    colors.push(vec3(0.5, 0.5, 0.5));
    vertices.push(vec2(0, 0 - 0.25 / 12)); //rat vertices
    colors.push(vec3(0.5, 0.5, 0.5));
    red = vec3(1.0, 0.0, 0.0);
    vertices.push(vec2(ratLocX, ratLocY)); //first location of the red lines
    colors.push(red);
    var square = 36;
    var ratSquare = rows[square]; //current square the mouse is in
    //everytime 1153 is translated, we draw a red line to the new location

    //use cube assignment for reference as well as spinning square for key interaction
    //use variables to keep track of rotation and position of mouse
    //start rat at the origin
    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    // Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    // Load the data into the GPU
    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    // Load the data into the GPU
    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    window.onkeydown = function (event) {
        var key = String.fromCharCode(event.keyCode);
        switch (key) {
            case 'J':
                currDirection = currDirection + 1;
                if (currDirection == 4) { //will rotate to the left
                    currDirection = 0;
                }
                break;

            case 'K':
                if (currDirection == 1) { //move up (all the other directions are very similar in structure to this if statement and its contents)
                    if (ratSquare != 2 && ratSquare != 3 && ratSquare != 5 && ratSquare != 7 && ratSquare != 10 && ratSquare != 11 && ratSquare != 13) {
                        ratLocY = ratLocY + 2 / 12; //location of the line up a square
                        vertices.push(vec2(ratLocX, ratLocY)); //push new line vertice
                        colors.push(red); //push new color for line
                        thinRedLine++; //inc number of vertices for line
                        cBuffer = gl.createBuffer();
                        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                        gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

                        // Associate out shader variables with our data buffer
                        vColor = gl.getAttribLocation(program, "vColor");
                        gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
                        gl.enableVertexAttribArray(vColor);

                        // Load the data into the GPU
                        vBuffer = gl.createBuffer();
                        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
                        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

                        // Associate out shader variables with our data buffer
                        vPosition = gl.getAttribLocation(program, "vPosition");
                        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
                        gl.enableVertexAttribArray(vPosition);
                        translationMatrixY = translationMatrixY + 2 / 12; //translate rat up a square
                        square = square - 12; //square rat is in is now a row up
                        ratSquare = rows[square];
                        break;
                    }
                }
                else if (currDirection == 0) { //right
                    if (ratSquare != 1 && ratSquare != 2 && ratSquare != 5 && ratSquare != 6 && ratSquare != 8 && ratSquare != 10 && ratSquare != 15) {
                        ratLocX = ratLocX + 2 / 12;
                        thinRedLine++;
                        vertices.push(vec2(ratLocX, ratLocY));
                        colors.push(red);
                        cBuffer = gl.createBuffer();
                        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                        gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

                        // Associate out shader variables with our data buffer
                        vColor = gl.getAttribLocation(program, "vColor");
                        gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
                        gl.enableVertexAttribArray(vColor);

                        // Load the data into the GPU
                        vBuffer = gl.createBuffer();
                        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
                        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

                        // Associate out shader variables with our data buffer
                        vPosition = gl.getAttribLocation(program, "vPosition");
                        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
                        gl.enableVertexAttribArray(vPosition);
                        translationMatrixX = translationMatrixX + 2 / 12;
                        square = square + 1;
                        ratSquare = rows[square];
                        break;
                    }
                }
                else if (currDirection == 3) { //down
                    if (ratSquare != 1 && ratSquare != 2 && ratSquare != 3 && ratSquare != 7 && ratSquare != 8 && ratSquare != 9 && ratSquare != 12) {
                        ratLocY = ratLocY - 2 / 12;
                        vertices.push(vec2(ratLocX, ratLocY));
                        colors.push(red);
                        cBuffer = gl.createBuffer();
                        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                        gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

                        // Associate out shader variables with our data buffer
                        vColor = gl.getAttribLocation(program, "vColor");
                        gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
                        gl.enableVertexAttribArray(vColor);

                        // Load the data into the GPU
                        vBuffer = gl.createBuffer();
                        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
                        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

                        // Associate out shader variables with our data buffer
                        vPosition = gl.getAttribLocation(program, "vPosition");
                        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
                        gl.enableVertexAttribArray(vPosition);
                        thinRedLine++;
                        translationMatrixY = translationMatrixY - 2 / 12;
                        square = square + 12;
                        ratSquare = rows[square];
                        break;
                    }
                }
                else if (currDirection == 2) { //left
                    if (ratSquare != 1 && ratSquare != 3 && ratSquare != 5 && ratSquare != 6 && ratSquare != 9 && ratSquare != 11 && ratSquare != 14) {
                        ratLocX = ratLocX - 2 / 12;
                        vertices.push(vec2(ratLocX, ratLocY));
                        colors.push(red);
                        cBuffer = gl.createBuffer();
                        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                        gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

                        // Associate out shader variables with our data buffer
                        vColor = gl.getAttribLocation(program, "vColor");
                        gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
                        gl.enableVertexAttribArray(vColor);

                        // Load the data into the GPU
                        vBuffer = gl.createBuffer();
                        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
                        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

                        // Associate out shader variables with our data buffer
                        vPosition = gl.getAttribLocation(program, "vPosition");
                        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
                        gl.enableVertexAttribArray(vPosition);
                        thinRedLine++;
                        translationMatrixX = translationMatrixX - 2 / 12;
                        square = square - 1;
                        ratSquare = rows[square];
                        break;
                    }
                }
                break;

            case 'L':
                currDirection = currDirection - 1;
                if (currDirection == -1) { //rotate right
                    currDirection = 3;
                }
                break;
        }
    };
    render();
};

function render() {
    var ctm = mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
    //identity
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 576); //displaying white background
    gl.drawArrays(gl.LINES, 576, numPoints); //displaying all points for the maze
    gl.drawArrays(gl.LINE_STRIP, 1157, thinRedLine);
    //tranformation matrix
    ctm = mat4();
    ctm = mult(ctm, translate(translationMatrixX, translationMatrixY, 0.0)); 
    ctm = mult(ctm, rotateZ(currDirection * 90));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm)); //rat translation matrix
    gl.drawArrays(gl.TRIANGLES, 1148, 3);
    gl.drawArrays(gl.TRIANGLE_STRIP, 1151, 6); //drawing rat
    requestAnimationFrame(render);
}

