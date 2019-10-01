//@ts-ignore
import vertSourceShader from '../shaders/shader.vert'
//@ts-ignore
import fragSourceShader from '../shaders/shader.frag'

import Maths from '../utils/Maths.class'


export default class Renderer {

    gl: WebGLRenderingContext
    vertexShader: WebGLShader
    fragmentShader: WebGLShader
    program: WebGLProgram

    positionAttributeLocation: number
    resolutionUniformLocation: WebGLUniformLocation
    colorUniformLocation: WebGLUniformLocation

    matrixUniformLocation: WebGLUniformLocation

    positionBuffer: WebGLBuffer

    image: HTMLImageElement
    maths: any

    constructor (public canvas: HTMLCanvasElement) {
        this.maths = new Maths();
        this.bind()
        this.init()
        this.displayImage()
    }

    init() {
        //GET CONTEXT
        this.gl = this.canvas.getContext("webgl")
        if (!this.gl) {
            alert('WebGL not supported on this browser')
        }

        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight

        //CHOOSE THE SHADERS TO CREATE A PROGRAM
        this.vertexShader = this.createShader(this.gl, this.gl.VERTEX_SHADER, vertSourceShader)
        this.fragmentShader = this.createShader(this.gl, this.gl.FRAGMENT_SHADER, fragSourceShader)
        this.program = this.createProgram(this.gl, this.vertexShader, this.fragmentShader)
    }

    displayImage() {
        this.image = new Image()
        this.image.src = './src/assets/CP3O2tUWoAA0IPl.png'
        this.image.onload = () => { this.renderImage(this.image) }
    }

    renderImage(image) {
        var texCoordLocation = this.gl.getAttribLocation(this.program, "a_texCoord");

        // provide texture coordinates for the rectangle.
        var texCoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texCoordBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0]), this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(texCoordLocation);
        this.gl.vertexAttribPointer(texCoordLocation, 2, this.gl.FLOAT, false, 0, 0);

        // Create a texture.
        var texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

        // Set the parameters so we can render any size image.
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

        // Upload the image into the texture.
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);

        this.createPlane(10, 10, 200, 200)
    }

    createPlane(x_, y_, width_, height_) {
        let x = x_
        let y = y_
        let width = width_
        let height = height_
        this.positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position")
        this.resolutionUniformLocation = this.gl.getUniformLocation(this.program, "u_resolution");

        this.matrixUniformLocation = this.gl.getUniformLocation(this.program, "u_matrix");


        this.colorUniformLocation = this.gl.getUniformLocation(this.program, "u_color")


        this.positionBuffer = this.gl.createBuffer()

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.rect(width, height)), this.gl.STATIC_DRAW);

        this.draw()
    }

    draw() {
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.useProgram(this.program)
        this.gl.enableVertexAttribArray(this.positionAttributeLocation)

        this.gl.uniform2f(this.resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);

        var translationMatrix = this.maths.m3.translation(200, 200);
        var rotationMatrix = this.maths.m3.rotation(Math.PI / 2);
        var scaleMatrix = this.maths.m3.scaling(1, 1);
        var moveOriginMatrix = this.maths.m3.translation(-50, -75);
        var projectionMatrix = this.maths.m3.projection(
            this.gl.canvas.width, this.gl.canvas.height);

        // Multiply the matrices.
        var matrix = this.maths.m3.projection(this.gl.canvas.width, this.gl.canvas.height);
        matrix = this.maths.translate2D(matrix, 400, 200);
        matrix = this.maths.rotate2D(matrix, 1);
        matrix = this.maths.scale2D(matrix, 2, 1);
        this.gl.uniformMatrix3fv(this.matrixUniformLocation, false, matrix);

        this.gl.uniform4f(this.colorUniformLocation, 1., 0.5, 0.5, 1)


        this.gl.vertexAttribPointer(this.positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0)
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    bind() {
        this.createShader = this.createShader.bind(this)
        this.createProgram = this.createProgram.bind(this)
        this.renderImage = this.renderImage.bind(this)
        this.createPlane = this.createPlane.bind(this)
    }

    rect(width, height) {
        var positions = [
            0, 0,
            width, 0,
            0, height,
            0, height,
            width, 0,
            width, height];
        return positions
    }

    resizeCanvas(canvas) {
        // Lookup the size the browser is displaying the canvas.
        var displayWidth = canvas.clientWidth;
        var displayHeight = canvas.clientHeight;

        // Check if the canvas is not the same size.
        if (canvas.width !== displayWidth ||
            canvas.height !== displayHeight) {

            // Make the canvas the same size
            canvas.width = displayWidth;
            canvas.height = displayHeight;
        }

    }


    createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }

        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }
}