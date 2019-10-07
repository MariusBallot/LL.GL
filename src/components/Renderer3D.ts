//@ts-ignore
import vertSourceShader from '../shaders/3D/shader.vert'
//@ts-ignore
import fragSourceShader from '../shaders/3D/shader.frag'

import Maths from '../utils/Maths.class'


export default class Renderer3D {

    texFlag: boolean

    gl: WebGLRenderingContext
    vertexShader: WebGLShader
    fragmentShader: WebGLShader
    program: WebGLProgram

    positionAttributeLocation: number
    resolutionUniformLocation: WebGLUniformLocation
    colorUniformLocation: WebGLUniformLocation
    matrixUniformLocation: WebGLUniformLocation

    texture: WebGLTexture

    positionBuffer: WebGLBuffer

    image: HTMLImageElement
    maths: any

    constructor(public canvas: HTMLCanvasElement) {
        this.texFlag = false
        this.maths = new Maths();
        this.bind()
        this.init()
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

        this.positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position")
        this.matrixUniformLocation = this.gl.getUniformLocation(this.program, "u_matrix");
        this.colorUniformLocation = this.gl.getUniformLocation(this.program, "u_color")

        this.positionBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.cube(20)), this.gl.STATIC_DRAW);

        this.gl.enable(this.gl.CULL_FACE)
        this.gl.enable(this.gl.DEPTH_TEST)

        this.draw()

    }

    draw() {
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
        this.gl.clearColor(0, 0, 0, 0)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)

        this.gl.useProgram(this.program)
        this.gl.enableVertexAttribArray(this.positionAttributeLocation)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

        this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0)

        this.gl.uniform2f(this.resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height)

        var numFs = 5;
        var radius = 200;

        var projectionMatrix = this.maths.m4.perspective(100, this.gl.canvas.width / this.gl.canvas.height, 1, 10000)

        var numFs = 5;
        var radius = 200;

        // Compute a matrix for the camera
        var cameraMatrix = this.maths.m4.yRotation(Date.now() * 0.001);
        cameraMatrix = this.maths.translate(cameraMatrix, 0, 0, 1200);

        var viewMatrix = this.maths.m4.inverse(cameraMatrix);
        var viewProjectionMatrix = this.maths.m4.multiply(projectionMatrix, viewMatrix);
        for (let i = 0; i < 10; i++) {

            let x = Math.cos(Math.PI * 2 / 10 * i) * 600
            let y = Math.sin(Math.PI * 2 / 10 * i) * 600

            var matrix = this.maths.m4.translate(viewProjectionMatrix, x, 0, y);


            this.gl.uniformMatrix4fv(this.matrixUniformLocation, false, matrix)

            this.gl.uniform4f(this.colorUniformLocation, 1., 0.5, 0.5, 1)


            if (this.texFlag) {
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
                this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.image);
            }

            this.gl.drawArrays(this.gl.TRIANGLES, 0, 6 * 6);
        }

    }

    bind() {
        this.createShader = this.createShader.bind(this)
        this.createProgram = this.createProgram.bind(this)
    }

    cube(width) {
        var positions = [
            width, 0, 0,
            0, 0, 0,
            0, width, 0,
            width, width, 0,
            width, 0, 0,
            0, width, 0,
            //___________________________
            0, width, 0,
            0, width, width,
            width, width, 0,
            width, width, width,
            width, width, 0,
            0, width, width,
            //___________________________
            0, 0, 0,
            0, width, width,
            0, width, 0,
            0, 0, width,
            0, width, width,
            0, 0, 0,
            //___________________________
            0, 0, 0,
            width, 0, 0,
            0, 0, width,
            0, 0, width,
            width, 0, 0,
            width, 0, width,
            //___________________________
            0, 0, width,
            width, 0, width,
            0, width, width,
            0, width, width,
            width, 0, width,
            width, width, width,
            //___________________________
            width, 0, width,
            width, 0, 0,
            width, width, 0,
            width, width, width,
            width, 0, width,
            width, width, 0,
        ];
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