
import * as THREE from 'three'
import React, { useRef, useState, useMemo, Suspense } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { Image, Environment, ScrollControls, useScroll, useTexture } from '@react-three/drei'
import { easing } from 'maath'

// Custom Geometry & Material Classes
class BentPlaneGeometry extends THREE.PlaneGeometry {
  constructor(radius, ...args) {
    super(...args)
    let p = this.parameters
    let hw = p.width * 0.5
    let a = new THREE.Vector2(-hw, 0)
    let b = new THREE.Vector2(0, radius)
    let c = new THREE.Vector2(hw, 0)
    let ab = new THREE.Vector2().subVectors(a, b)
    let bc = new THREE.Vector2().subVectors(b, c)
    let ac = new THREE.Vector2().subVectors(a, c)
    let r = (ab.length() * bc.length() * ac.length()) / (2 * Math.abs(ab.cross(ac)))
    let center = new THREE.Vector2(0, radius - r)
    let baseV = new THREE.Vector2().subVectors(a, center)
    let baseAngle = baseV.angle() - Math.PI * 0.5
    let arc = baseAngle * 2
    let uv = this.attributes.uv
    let pos = this.attributes.position
    let mainV = new THREE.Vector2()
    for (let i = 0; i < uv.count; i++) {
      let uvRatio = 1 - uv.getX(i)
      let y = pos.getY(i)
      mainV.copy(c).rotateAround(center, arc * uvRatio)
      pos.setXYZ(i, mainV.x, y, -mainV.y)
    }
    pos.needsUpdate = true
  }
}

class MeshSineMaterial extends THREE.MeshBasicMaterial {
  constructor(parameters = {}) {
    super(parameters)
    this.setValues(parameters)
    this._time = { value: 0 }
  }
  get time() {
    return this._time
  }
  set time(v) {
    this._time = v
  }
  onBeforeCompile(shader) {
    shader.uniforms.time = this._time
    shader.vertexShader = `
      uniform float time;
      ${shader.vertexShader}
    `
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `vec3 transformed = vec3(position.x, position.y + sin(time + uv.x * PI * 4.0) / 4.0, position.z);`
    )
  }
}

// Register custom elements
extend({ MeshSineMaterial, BentPlaneGeometry })

function Rig(props) {
  const ref = useRef()
  const scroll = useScroll()
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y = -scroll.offset * (Math.PI * 2)
    }
    state.events.update()
    easing.damp3(state.camera.position, [-state.pointer.x * 2, state.pointer.y + 1.5, 10], 0.3, delta)
    state.camera.lookAt(0, 0, 0)
  })
  return <group ref={ref} {...props} />
}

function Carousel({ radius = 2.5, count = 12, images = [] }) {
  return Array.from({ length: count }, (_, i) => {
    const url = images[i % images.length] || `/cart page/img${(i % 16) + 1}.png`
    return (
      <Card
        key={i}
        url={url}
        position={[Math.sin((i / count) * Math.PI * 2) * radius, 0, Math.cos((i / count) * Math.PI * 2) * radius]}
        rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
      />
    )
  })
}

function Card({ url, ...props }) {
  const ref = useRef()
  const [hovered, hover] = useState(false)

  useFrame((state, delta) => {
    if (ref.current) {
      easing.damp3(ref.current.scale, hovered ? 1.2 : 1, 0.1, delta)
      if (ref.current.material) {
        easing.damp(ref.current.material, 'radius', hovered ? 0.25 : 0.1, 0.2, delta)
        easing.damp(ref.current.material, 'zoom', hovered ? 1 : 1.2, 0.2, delta)
      }
    }
  })

  return (
    <Image
      ref={ref}
      url={url}
      transparent
      side={THREE.DoubleSide}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
      {...props}
    >
      <bentPlaneGeometry args={[0.1, 1, 1.4, 20, 20]} />
    </Image>
  )
}

function Banner(props) {
  const ref = useRef()
  const texture = useTexture('/logo.png')
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  const scroll = useScroll()

  useFrame((state, delta) => {
    if (ref.current && ref.current.material && ref.current.material.time) {
      ref.current.material.time.value += Math.abs(scroll.delta) * 4
      ref.current.material.map.offset.x += delta / 4
    }
  })

  return (
    <mesh ref={ref} {...props}>
      <cylinderGeometry args={[2.5, 2.5, 0.2, 128, 16, true]} />
      <meshSineMaterial
        map={texture}
        map-anisotropy={16}
        map-repeat={[20, 1]}
        side={THREE.DoubleSide}
        toneMapped={false}
        transparent
        opacity={0.5}
      />
    </mesh>
  )
}

export const ThreeScene = ({ images = [] }) => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 100], fov: 15 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <fog attach="fog" args={['#000', 5, 15]} />
          <ScrollControls pages={4}>
            <Rig rotation={[0, 0, 0.1]}>
              <Carousel images={images} radius={3.5} count={16} />
            </Rig>
            <Banner position={[0, -0.6, 0]} />
          </ScrollControls>
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  )
}
