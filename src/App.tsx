import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, SoftShadows, MeshWobbleMaterial } from '@react-three/drei'
import {useSpring, a} from '@react-spring/three'
import * as THREE from 'three'
import './App.css'



type spinProps = {
  position: [number, number, number],
  color: string,
  speed: number,
  args: ConstructorParameters<typeof THREE.BoxGeometry>
}
const SpinningMesh = ({position, color, speed, args}: spinProps) => {
  // ref to the mesh
  const meshRef = useRef<THREE.Mesh>(null!)
  const [expand, setExpand] = useState(false)
  const props = useSpring({
    scale: expand ? 1.5 : 1,
  })

  useFrame(() => {
    meshRef.current.rotation.x = meshRef.current.rotation.y += 0.01
  })

  return (
    <a.mesh
      ref={meshRef}
      position={position}
      onClick={() => setExpand(!expand)}
      scale={props.scale}
      castShadow
    >
      <boxGeometry args={args} />
      <meshStandardMaterial color="hotpink" />
      <MeshWobbleMaterial
        color={color}
        speed={speed}
        factor={0.6}
      />
    </a.mesh>
  )
}

function App() {

  return (
    <div className='App'>
      <div className='three_Canvas'>
        <Canvas
          shadows
          camera={{ position: [-5, 2, 10], fov: 60 }}
        >
          {/* Enable soft shadows in the scene */}
          <SoftShadows />

          {/* this light makes things to look pretty */}
          <ambientLight intensity={0.3} />

          {/* our main source of light, also casting the shadows */}
          <directionalLight
            castShadow
            position={[0, 10, 0]} 
            intensity={1.5}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-radius={10}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />

          {/* both pointLights will help to illuminate the spinning boxes */}
          <pointLight position={[-10, 0, -20]} intensity={0.5} />
          <pointLight position={[0, -10, 0]} intensity={1.5} />

          <group>
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -3, 0]}
              receiveShadow
            >
              <planeGeometry args={[100, 100]} />
              <shadowMaterial attach="material" opacity={0.3} />
            </mesh>

            <SpinningMesh position={[0, 0, 0]} color="hotpink" speed={2} args={[2, 3, 2]} />
            <SpinningMesh position={[-5, 0, -1]} color="yellowgreen" speed={2} args={[2, 3, 2]} />
            <SpinningMesh position={[5, 0, 3]} color="purple" speed={2} args={[2, 4, 2]} />
          </group>

          <OrbitControls />
        </Canvas>
      </div>
    </div>
  )
}

export default App
