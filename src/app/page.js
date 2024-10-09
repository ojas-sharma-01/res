// pages/index.js
import Earth from '@/components/threecompo';

export default function Home() {
    return (
        <div>
                <title>Three.js Earth with GLTF</title>
                <meta name="description" content="A 3D representation of Earth using a GLTF model in Three.js." />
            <Earth />
        </div>
    );
}
