"use client";

import "./Earth.module.css";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Planet from "./planets";

const Earth = () => {
    const mountRef = useRef(null);
    const cameraRef = useRef(null);
    const scrollRef = useRef(0);
    const planetRef = useRef(null);
    const planet1Ref = useRef(null);
    const planet2Ref = useRef(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });

        camera.position.z = 5;
        cameraRef.current = camera;
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        const textureLoader = new THREE.TextureLoader();
        const earthTexture = textureLoader.load('/mars.jpg');
        const spaceTexture = textureLoader.load('/space_back.png');
        const planeGeometry = new THREE.PlaneGeometry(1920, 1080, 1, 1);
        const planeMaterial = new THREE.MeshBasicMaterial({ map: spaceTexture, side: THREE.DoubleSide });
        const backgroundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
        
        spaceTexture.magFilter = THREE.NearestFilter;
        scene.background = spaceTexture;

        const earthGeometry = new THREE.SphereGeometry(1, 500, 500);
        earthGeometry.magFilter = THREE.NearestFilter;
        const earthMaterial = new THREE.MeshPhongMaterial({ 
            map: earthTexture,
        });
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        scene.add(earth);
        planetRef.current = earth;

        const ambientLight = new THREE.AmbientLight(0x404040, 10);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 100, 100);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        const planet1Texture = textureLoader.load('/mer.jpg');
        const planet2Texture = textureLoader.load('/ear.jpg');

        const planet1Geometry = new THREE.SphereGeometry(1, 32, 32);
        const planet1Material = new THREE.MeshPhongMaterial({ map: planet1Texture });
        const planet1 = new THREE.Mesh(planet1Geometry, planet1Material);
        planet1.position.set(-5, -5, 0);
        planet1Ref.current = planet1;
        scene.add(planet1);

        const planet2Geometry = new THREE.SphereGeometry(0.7, 250, 250);
        const planet2Material = new THREE.MeshPhongMaterial({ map: planet2Texture });
        const planet2 = new THREE.Mesh(planet2Geometry, planet2Material);
        planet2.position.set(-10, -10, 0); 
        planet2Ref.current = planet2; 
        scene.add(planet2);

        const asteroidPositionsEarth = [
            { distance: 1.5, angle: 0, yOffset: 0 },
            { distance: 1.7, angle: Math.PI / 4, yOffset: 0.5 },
            { distance: 1.2, angle: Math.PI / 2, yOffset: -0.5 },
        ];

        const asteroidPositionsPlanet1 = [
            { distance: 0.8, angle: 0, yOffset: 0 },
            { distance: 1.0, angle: Math.PI / 4, yOffset: 0.3 },
            { distance: 1.2, angle: Math.PI / 2, yOffset: -0.2 },
        ];

        const asteroidPositionsPlanet2 = [
            { distance: 0.5, angle: 0, yOffset: 0 },
            { distance: 0.7, angle: Math.PI / 4, yOffset: 0.2 },
            { distance: 0.9, angle: Math.PI / 2, yOffset: -0.3 },
        ];

        const createAsteroids = (positions, type) => {
            return positions.map(pos => {
                const asteroidGeometry = new THREE.SphereGeometry(0.08, 16, 16);
                const asteroidTex = textureLoader.load('/mars.jpg');
                const asteroidMaterial = new THREE.MeshPhongMaterial({ map: asteroidTex }); 
                const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

                asteroid.position.x = pos.distance;
                if (type === 'e') {
                    asteroid.position.y = pos.yOffset; 
                } else if (type === 'p1') {
                    asteroid.position.y = -5 + pos.yOffset;
                } else {
                    asteroid.position.y = -10 + pos.yOffset;
                }
                asteroid.position.z = 0;

                return { mesh: asteroid, distance: pos.distance, angle: pos.angle, yOffset: pos.yOffset };
            });
        };

        const earthAsteroids = createAsteroids(asteroidPositionsEarth, 'e');
        const planet1Asteroids = createAsteroids(asteroidPositionsPlanet1, 'p1');
        const planet2Asteroids = createAsteroids(asteroidPositionsPlanet2, 'p2');

        earthAsteroids.forEach(asteroid => scene.add(asteroid.mesh));
        planet1Asteroids.forEach(asteroid => scene.add(asteroid.mesh));
        planet2Asteroids.forEach(asteroid => scene.add(asteroid.mesh));

        const animate = () => {
            requestAnimationFrame(animate);
            earth.rotation.y += 0.001; 
            planet1.rotation.y += 0.001;
            planet2.rotation.y += 0.001;

            earthAsteroids.forEach(asteroid => {
                asteroid.angle += 0.001;
                asteroid.mesh.position.x = earth.position.x + Math.cos(asteroid.angle) * asteroid.distance;
                asteroid.mesh.position.z = earth.position.z + Math.sin(asteroid.angle) * asteroid.distance;
                asteroid.mesh.position.y = earth.position.y + asteroid.yOffset + Math.sin(asteroid.angle) * 0.1;
            });

            planet1Asteroids.forEach(asteroid => {
                asteroid.angle += 0.001;
                asteroid.mesh.position.x = planet1.position.x + Math.cos(asteroid.angle) * asteroid.distance;
                asteroid.mesh.position.z = planet1.position.z + Math.sin(asteroid.angle) * asteroid.distance;
                asteroid.mesh.position.y = planet1.position.y + asteroid.yOffset + Math.sin(asteroid.angle) * 0.1;
            });

            planet2Asteroids.forEach(asteroid => {
                asteroid.angle += 0.001;
                asteroid.mesh.position.x = planet2.position.x + Math.cos(asteroid.angle) * asteroid.distance;
                asteroid.mesh.position.z = planet2.position.z + Math.sin(asteroid.angle) * asteroid.distance;
                asteroid.mesh.position.y = planet2.position.y + asteroid.yOffset + Math.sin(asteroid.angle) * 0.1;
            });

            renderer.render(scene, camera);
        };

        animate();

        const handleWheel = (event) => {
            const delta = event.deltaY * 0.01;
            if (planetRef.current) {
                const planet = planetRef.current;
                planet.position.x += delta;
                planet.position.y += delta;
            }

            if (planet1Ref.current) {
                planet1Ref.current.position.y += delta;
                planet1Ref.current.position.x += delta;
            }
            if (planet2Ref.current) {
                planet2Ref.current.position.y += delta;
                planet2Ref.current.position.x += delta;
            }
        }

        window.addEventListener('wheel', handleWheel);
        
        return () => {
            window.removeEventListener('wheel', handleWheel);
            mountRef.current.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} />;
};

export default Earth;
