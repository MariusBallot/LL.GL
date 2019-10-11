//@ts-ignore
import vertSourceShader from '../shaders/3D/shader.vert'
//@ts-ignore
import fragSourceShader from '../shaders/3D/shader.frag'

import m4 from '../utils/m4'
import cubeGeom from '../utils/cube'
import cubeNorm from '../utils/cube'
//@ts-ignore
import createProgram from '../utils/createProgram'

export default class Renderer3D {

    texFlag: boolean

    gl: WebGLRenderingContext
    vertexShader: WebGLShader
    fragmentShader: WebGLShader
    program: WebGLProgram

    positionLocation: number
    normalLocation: number

    resolutionUniformLocation: WebGLUniformLocation
    colorLocation: WebGLUniformLocation
    matrixLocation: WebGLUniformLocation

    texture: WebGLTexture

    positionBuffer: WebGLBuffer

    image: HTMLImageElement
    maths: any

    m4: any
    cubeGeom: any

    cubeSize: number

    constructor(public canvas: HTMLCanvasElement) {
        this.texFlag = false
        this.m4 = m4
        this.cubeGeom = cubeGeom
        this.cubeSize = 20


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

        this.positionLocation = this.gl.getAttribLocation(this.program, "a_position")
        this.normalLocation = this.gl.getAttribLocation(this.program, "a_normal")

        this.matrixLocation = this.gl.getUniformLocation(this.program, "u_matrix");
        this.colorLocation = this.gl.getUniformLocation(this.program, "u_color")

        this.positionBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.cubeGeom(this.cubeSize)), this.gl.STATIC_DRAW);

        this.gl.enable(this.gl.CULL_FACE)
        this.gl.enable(this.gl.DEPTH_TEST)

        this.draw()

        window.addEventListener('resize', this.resizeCanvas)
    }

    draw() {
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
        this.gl.clearColor(0, 0, 0, 0)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)

        this.gl.useProgram(this.program)
        this.gl.enableVertexAttribArray(this.positionLocation)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

        this.gl.vertexAttribPointer(this.positionLocation, 3, this.gl.FLOAT, false, 0, 0)

        this.gl.uniform2f(this.resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height)

        var numFs = 5;
        var radius = 600;

        var projectionMatrix = this.m4.perspective(Math.PI / 3, this.gl.canvas.width / this.gl.canvas.height, 1, 10000)

        var fPosition = [0, 0, 0];
        var up = [0, 1, 0];

        var cameraMatrix = this.m4.yRotation(Date.now() * 0.001);
        cameraMatrix = this.m4.translate(cameraMatrix, 0, 0, 1200);
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
        for (let x_ = 0; x_ < cubeCount; x_++) {
            for (let y_ = 0; y_ < cubeCount; y_++) {
                let x = x_ * this.cubeSize - cubeCount * this.cubeSize / 2
                let y = y_ * this.cubeSize - cubeCount * this.cubeSize / 2

                var matrix = this.m4.translate(viewProjectionMatrix, x, 0, y);
                matrix = this.m4.scale(matrix, 1, Math.sin(Date.now() * 0.001 + (x_ + y_) * 0.1) * 30, 1)

                this.gl.uniformMatrix4fv(this.matrixLocation, false, matrix)

                this.gl.uniform4f(this.colorLocation, 1., 0.5, 0.5, 1)


                this.gl.drawArrays(this.gl.TRIANGLES, 0, 6 * 6);
            }
        }

    }

    bind() {
        this.resizeCanvas = this.resizeCanvas.bind(this)
    }

    resizeCanvas() {
        this.gl.canvas.width = window.innerWidth;
        this.gl.canvas.height = window.innerHeight;

    }
}