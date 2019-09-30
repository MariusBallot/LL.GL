//@ts-ignore
import vertSourceShader from '../shaders/shader.vert'
//@ts-ignore
import fragSourceShader from '../shaders/shader.frag'

export default class Renderer {

    gl: WebGLRenderingContext
    vertexShader: WebGLShader
    fragmentShader: WebGLShader
    program: WebGLProgram
    positionAttributeLocation: number
    positionBuffer: WebGLBuffer

    constructor (public canvas: HTMLCanvasElement) {
        this.bind()

        this.gl = this.canvas.getContext("webgl")
        if (!this.gl) {
            alert('WebGL not supported on this browser')
        }

        this.vertexShader = this.createShader(this.gl, this.gl.VERTEX_SHADER, vertSourceShader)
        this.fragmentShader = this.createShader(this.gl, this.gl.FRAGMENT_SHADER, fragSourceShader)
        this.program = this.createProgram(this.gl, this.vertexShader, this.fragmentShader)
        this.positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position")
        this.positionBuffer = this.gl.createBuffer()

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.triangle()), this.gl.STATIC_DRAW);

        this.resizeCanvas(this.gl.canvas);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.useProgram(this.program)
        this.gl.enableVertexAttribArray(this.positionAttributeLocation)

        var size = 2;          // 2 components per iteration
        var type = this.gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        this.gl.vertexAttribPointer(
            this.positionAttributeLocation, size, type, normalize, stride, offset)

        var primitiveType = this.gl.TRIANGLES;
        var offset = 0;
        var count = 3;
        this.gl.drawArrays(primitiveType, offset, count);
    }

    bind() {
        this.createShader = this.createShader.bind(this)
        this.createProgram = this.createProgram.bind(this)
    }

    triangle() {
        var positions = [
            0, 0,
            0, 0.5,
            0.7, 0,
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