/**
 * MOTOR 3D - NOSSO UNIVERSO
 */

const phases = [
    { text: "O primeiro olhar que mudou a minha história.", img: "1000353452.jpg" },
    { text: "Aquele frio na barriga antes da nossa conversa.", img: "1000353451.jpg" },
    { text: "O seu sorriso que desmonta qualquer defesa minha.", img: "1000353445.jpg" },
    { text: "Onde o tempo para e só existe você.", img: "1000353444.jpg" },
    { text: "Cada detalhe seu é um verso de amor.", img: "1000353441.jpg" },
    { text: "A paz que eu só encontro no seu abraço.", img: "1000353440.jpg" },
    { text: "Nosso amor escrito nas estrelas.", img: "1000353437.jpg" },
    { text: "Você é a minha gatinha mais perfeita.", img: "1000353436.jpg" },
    { text: "Obrigado por ser meu porto seguro.", img: "1000353435.jpg" },
    { text: "Feliz 15 anos, meu amor. O universo é seu.", img: "1000353434.jpg" }
];

let currentStep = 0;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#webgl'), antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Estrelas de Fundo (Poeira Estelar)
const starGeo = new THREE.BufferGeometry();
const starCount = 6000;
const posArray = new Float32Array(starCount * 3);
for(let i=0; i<starCount*3; i++) posArray[i] = (Math.random() - 0.5) * 400;
starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const starMat = new THREE.PointsMaterial({ size: 0.15, color: 0xffffff, transparent: true });
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// Carregador de Texturas
const loaderManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loaderManager);

loaderManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    document.getElementById('progress').style.width = (itemsLoaded / itemsTotal * 100) + '%';
};

loaderManager.onLoad = () => {
    gsap.to('#loader', { opacity: 0, duration: 1.5, onComplete: () => {
        document.getElementById('loader').style.display = 'none';
        initExperience();
    }});
};

const photoPlanes = [];
const photoGroup = new THREE.Group();

phases.forEach((p, i) => {
    const geometry = new THREE.PlaneGeometry(12, 18);
    const texture = textureLoader.load(p.img);
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true, opacity: 0 });
    
    const plane = new THREE.Mesh(geometry, material);
    
    // Posicionamento em "S" no espaço
    plane.position.set(
        Math.sin(i) * 15, 
        Math.cos(i) * 5, 
        -i * 60 // Profundidade
    );
    plane.rotation.y = Math.sin(i) * 0.5;
    
    photoPlanes.push(plane);
    photoGroup.add(plane);
});
scene.add(photoGroup);

camera.position.z = 20;

function initExperience() {
    gsap.to('.top-bar', { opacity: 1, duration: 1 });
    gsap.to('.bottom-bar', { opacity: 1, duration: 1 });
    updateStep();
}

function updateStep() {
    const p = phases[currentStep];
    const targetPlane = photoPlanes[currentStep];

    // 1. Fade no texto
    gsap.fromTo('#main-text', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 });
    document.getElementById('main-text').innerText = p.text;
    document.getElementById('phase-num').innerText = `FASE ${currentStep + 1 < 10 ? '0'+(currentStep+1) : currentStep+1}`;

    // 2. Viagem da Câmera (Hiperespaço)
    gsap.to(camera.position, {
        x: targetPlane.position.x,
        y: targetPlane.position.y,
        z: targetPlane.position.z + 25,
        duration: 2.5,
        ease: "power2.inOut"
    });

    // 3. Revelar a foto
    gsap.to(targetPlane.material, { opacity: 1, duration: 2 });
}

document.getElementById('next-btn').addEventListener('click', () => {
    document.getElementById('bg-music').play();
    if(currentStep < phases.length - 1) {
        currentStep++;
        updateStep();
    } else {
        // Final: Explosão de estrelas ou redirecionamento
        gsap.to(camera.position, { z: camera.position.z - 200, duration: 5, ease: "power4.in" });
        document.getElementById('main-text').innerText = "Para sempre nós dois no nosso infinito.";
    }
});

// Loop de Animação
function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    // Flutuação suave das fotos
    photoPlanes.forEach((mesh, i) => {
        mesh.position.y += Math.sin(time + i) * 0.005;
        mesh.rotation.z = Math.sin(time * 0.5 + i) * 0.05;
    });

    stars.rotation.y += 0.0005;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});