import { useEffect, useRef, useState } from "react";
import Form from "@/components/form";
import { Link } from "react-router-dom";

function Register() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const programRef = useRef(null);
  const uniformsRef = useRef({});
  const imageRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(performance.now());
  
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Shader parameters
  const shaderParams = {
    blueish: 0.6,
    scale: 7,
    illumination: 0.15,
    surfaceDistortion: 0.07,
    waterDistortion: 0.03,
  };

  const registerContext = {
    title: "Crear una cuenta",
    inputs: [
      {
        tag: 'input',
        type: 'text',
        id: 'nombre',
        name: 'nombre',
        placeholder: 'Nombre completo',
        required: true
      },
      {
        tag: 'input',
        type: 'email',
        id: 'email',
        name: 'email',
        placeholder: 'Correo electrónico',
        required: true
      },
      {
        tag: 'input',
        type: 'tel',
        id: 'telefono',
        name: 'telefono',
        placeholder: 'Número de teléfono',
        required: true
      },
      {
        tag: 'input',
        type: 'password',
        id: 'password',
        name: 'password',
        placeholder: 'Contraseña',
        required: true
      },
      {
        tag: 'input',
        type: 'password',
        id: 'confirmPassword',
        name: 'confirmPassword',
        placeholder: 'Confirmar contraseña',
        required: true
      }
    ],
    service: 'registerForm',
    style: { maxWidth: '450px', margin: '0 auto' },
    className: 'shadow p-4',
    messages: {
      success: {
        show: true,
        text: "¡Registro exitoso! Ahora puedes iniciar sesión."
      },
      error: {
        show: true,
        text: "Error al registrarse. Por favor, inténtelo nuevamente."
      }
    },
    setData: {
      save: true,
      key: 'userData'
    },
    redirectPath: '/'
  };

  // Vertex Shader
  const vertexShaderSource = `
    precision mediump float;
    varying vec2 vUv;
    attribute vec2 a_position;

    void main() {
        vUv = .5 * (a_position + 1.);
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  // Fragment Shader
  const fragmentShaderSource = `
    precision mediump float;

    varying vec2 vUv;
    uniform sampler2D u_image_texture;
    uniform float u_time;
    uniform float u_ratio;
    uniform float u_img_ratio;
    uniform float u_blueish;
    uniform float u_scale;
    uniform float u_illumination;
    uniform float u_surface_distortion;
    uniform float u_water_distortion;

    #define TWO_PI 6.28318530718
    #define PI 3.14159265358979323846

    vec3 mod289(vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
    vec2 mod289(vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
    vec3 permute(vec3 x) { return mod289(((x*34.)+1.)*x); }
    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1., 0.) : vec2(0., 1.);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0., i1.y, 1.)) + i.x + vec3(0., i1.x, 1.));
        vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.);
        m = m*m;
        m = m*m;
        vec3 x = 2. * fract(p * C.www) - 1.;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130. * dot(m, g);
    }

    mat2 rotate2D(float r) {
        return mat2(cos(r), sin(r), -sin(r), cos(r));
    }

    float surface_noise(vec2 uv, float t, float scale) {
        vec2 n = vec2(.1);
        vec2 N = vec2(.1);
        mat2 m = rotate2D(.5);
        for (int j = 0; j < 10; j++) {
            uv *= m;
            n *= m;
            vec2 q = uv * scale + float(j) + n + (.5 + .5 * float(j)) * (mod(float(j), 2.) - 1.) * t;
            n += sin(q);
            N += cos(q) / scale;
            scale *= 1.2;
        }
        return (N.x + N.y + .1);
    }

    void main() {
        vec2 uv = vUv;
        uv.y = 1. - uv.y;
        uv.x *= u_ratio;

        float t = 0.001 * u_time;
        vec3 color = vec3(0.);
        float opacity = 0.;

        float outer_noise = snoise((.3 + .1 * sin(t)) * uv + vec2(0., .2 * t));
        vec2 surface_noise_uv = 2. * uv + (outer_noise * .2);

        float surface_noise = surface_noise(surface_noise_uv, t, u_scale);
        surface_noise *= pow(uv.y, .3);
        surface_noise = pow(surface_noise, 2.);

        vec2 img_uv = vUv;
        img_uv -= 0.5;

        float screenRatio = u_ratio;
        float imageRatio = u_img_ratio;

        if (screenRatio > imageRatio) {
          img_uv *= vec2(screenRatio / imageRatio, 1.0);  // scale X
        } else {
          img_uv *= vec2(1.0, imageRatio / screenRatio);  // scale Y
        }

        float zoom = 0.7; // Leve zoom in

        img_uv *= zoom;
        img_uv += 0.5;

        img_uv.y = 1.0 - img_uv.y;


        img_uv += (u_water_distortion * outer_noise);
        img_uv += (u_surface_distortion * surface_noise);

        vec4 img = texture2D(u_image_texture, img_uv);
        img *= (1. + u_illumination * surface_noise);

        color += img.rgb;
        color += u_illumination * vec3(1. - u_blueish, 1., 1.) * surface_noise;
        opacity += img.a;

        float edge_width = .02;
        float edge_alpha = smoothstep(0., edge_width, img_uv.x) * smoothstep(1., 1. - edge_width, img_uv.x);
        edge_alpha *= smoothstep(0., edge_width, img_uv.y) * smoothstep(1., 1. - edge_width, img_uv.y);
        color *= edge_alpha;
        opacity *= edge_alpha;

        gl_FragColor = vec4(color, opacity);
    }
  `;

  // Function to handle WebGL shader compilation
  const createShader = (gl, source, type) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  // Function to create shader program
  const createShaderProgram = (gl, vertexShader, fragmentShader) => {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      return null;
    }

    return program;
  };

  // Function to get shader uniform locations
  const getUniforms = (gl, program) => {
    const uniforms = {};
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    
    for (let i = 0; i < uniformCount; i++) {
      const uniformName = gl.getActiveUniform(program, i).name;
      uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
    }
    
    return uniforms;
  };

  // Function to load the background image
  const loadImage = (gl, src) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = src;
    
    image.onload = () => {
      imageRef.current = image;
      
      const imageTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, imageTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.uniform1i(uniformsRef.current.u_image_texture, 0);
      
      updateCanvasSize();
    };
  };

  // Function to render the animation frame
  const render = () => {
    const gl = contextRef.current;
    if (!gl) return;
    
    const currentTime = performance.now() - startTimeRef.current;
    gl.uniform1f(uniformsRef.current.u_time, currentTime);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    animationRef.current = requestAnimationFrame(render);
  };

  // Function to update canvas size and related uniforms
  const updateCanvasSize = () => {
    const canvas = canvasRef.current;
    const gl = contextRef.current;
    const image = imageRef.current;
    
    if (!canvas || !gl || !image) return;
    
    const devicePixelRatio = Math.min(window.devicePixelRatio, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    
    gl.viewport(0, 0, canvas.width, canvas.height);
    
    const imgRatio = image.naturalWidth / image.naturalHeight;
    gl.uniform1f(uniformsRef.current.u_ratio, canvas.width / canvas.height);
    gl.uniform1f(uniformsRef.current.u_img_ratio, imgRatio);
    
    setCanvasSize({ width, height });
  };

  // Initialize WebGL context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Get WebGL context
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    
    contextRef.current = gl;
    
    // Create shaders
    const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    
    // Create shader program
    const program = createShaderProgram(gl, vertexShader, fragmentShader);
    if (!program) return;
    
    programRef.current = program;
    gl.useProgram(program);
    
    // Get uniforms
    uniformsRef.current = getUniforms(gl, program);
    
    // Create geometry (a quad that fills the screen)
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    // Set vertex attributes
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    
    // Set uniform values
    gl.uniform1f(uniformsRef.current.u_blueish, shaderParams.blueish);
    gl.uniform1f(uniformsRef.current.u_scale, shaderParams.scale);
    gl.uniform1f(uniformsRef.current.u_illumination, shaderParams.illumination);
    gl.uniform1f(uniformsRef.current.u_surface_distortion, shaderParams.surfaceDistortion);
    gl.uniform1f(uniformsRef.current.u_water_distortion, shaderParams.waterDistortion);
    
    // Load background image - use a calming blue gradient as default
    // Replace with your own image URL if needed
    loadImage(gl, "https://i.ytimg.com/vi/kDRI_E-619k/maxresdefault.jpg");
    
    // Start animation
    startTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(render);
    
    // Handle window resize
    window.addEventListener('resize', updateCanvasSize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      <canvas 
        ref={canvasRef} 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1
        }}
      />
      <div className="container mt-5 pt-5" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="text-center mb-4">
              <h2 className="fw-bold" style={{ color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.5)' }}>Únete a Sentirse Bien Spa</h2>
              <p style={{ color: '#fff', textShadow: '0 0 8px rgba(0,0,0,0.5)' }}>Regístrate para acceder a reservas y ofertas exclusivas</p>
            </div>

            <div className="form-container" style={{ 
              backgroundColor: 'transparent',
              borderRadius: '10px',
              padding: '20px',
            }}>

              <Form context={registerContext} />
            </div>

            <div className="text-center mt-3">
              <p style={{ color: '#fff', textShadow: '0 0 8px rgba(0,0,0,0.5)' }}>
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" style={{ color: '#fff', fontWeight: 'bold', textDecoration: 'underline' }}>
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;