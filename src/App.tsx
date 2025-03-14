import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Layout from './components/Layout';
import Loading from './components/Loading';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="fixed inset-0 -z-10">
          <Canvas>
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <mesh position={[0, 0, -5]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial color="#3b82f6" wireframe />
              </mesh>
              <OrbitControls enableZoom={false} autoRotate />
            </Suspense>
          </Canvas>
        </div>
        
        <Suspense fallback={<Loading />}>
          <Layout />
        </Suspense>
      </div>
    </Router>
  );
}

export default App;