// components/Planet.js
"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Planet = ({ texturePath, position }) => {
    const mountRef = useRef(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        
        const width = mountRef.current.clientWidth;
        const height = window.innerHeight / 2; // Adjust height as needed
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        // Create texture
        const textureLoader = new THREE.TextureLoader();
        const planetTexture = textureLoader.load(texturePath);

        // Create planet geometry
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshPhongMaterial({ map: planetTexture });
        const planet = new THREE.Mesh(geometry, material);
        scene.add(planet);

        // Set camera position
        camera.position.z = 5;

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            planet.rotation.y += 0.01; // Rotate the planet
            renderer.render(scene, camera);
        };

        animate();

        // Clean up
        return () => {
            mountRef.current.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, [texturePath]);

    return <div ref={mountRef} style={{ position: 'relative', width: '100%', height: '100%' }} />;
};

export default Planet;
