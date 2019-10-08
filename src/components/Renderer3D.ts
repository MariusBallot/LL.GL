//@ts-ignore
import vertSourceShader from '../shaders/3D/shader.vert'
//@ts-ignore
import fragSourceShader from '../shaders/3D/shader.frag'

import m4 from '../utils/m4'
import cube from '../utils/cube'
//@ts-ignore
import createProgram from '../utils/createProgram'

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

    m4: any
    cube: any

    constructor(public canvas: HTMLCanvasElement) {
        this.texFlag = false
        this.m4 = m4
        this.cube = cube
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

        this.program = createProgram(this.gl, vertSourceShader, fragSourceShader)

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
        var radius = 600;

        var projectionMatrix = this.m4.perspective(Math.PI / 3, this.gl.canvas.width / this.gl.canvas.height, 1, 10000)

        var fPosition = [radius, 0, 0];
        var up = [0, 1, 0];

        var cameraMatrix = this.m4.yRotation(Date.now() * 0.001);
        cameraMatrix = this.m4.translate(cameraMatrix, 0, 200, -1200);
        var cameraPosition = [
            cameraMatrix[12],
            cameraMatrix[13],
            cameraMatrix[14],
        ];

        // Compute a matrix for the camera
        // var cameraMatrix = this.m4.yRotation(Date.now() * 0.001);
        // cameraMatrix = this.maths.translate(cameraMatrix, 0, 0, 1200);

        var cameraMatrix = this.m4.lookAt(cameraPosition, fPosition, up);

        var viewMatrix = this.m4.inverse(cameraMatrix);
        var viewProjectionMatrix = this.m4.multiply(projectionMatrix, viewMatrix);

        let cubeCount = 30;
        for (let i = 0; i < cubeCount; i++) {

            let x = Math.cos(Math.PI * 2 / cubeCount * i) * 600
            let y = Math.sin(Math.PI * 2 / cubeCount * i) * 600

            var matrix = this.m4.translate(viewProjectionMatrix, x, 0, y);
            matrix = this.m4.scale(matrix, 1, Math.cos(Math.PI * 2 / cubeCount * i + Date.now() * 0.01) * 10, 1)

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
}