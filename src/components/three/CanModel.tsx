"use client";

import { useMemo } from "react";
import * as THREE from "three";

/** Can is modelled 1 unit tall, centred on the origin. */
export const CAN_RADIUS = 0.19;
const BODY_BOTTOM = -0.42;
const BODY_TOP = 0.4;
const R = CAN_RADIUS;

function lathe(points: [number, number][], segments = 72) {
  return new THREE.LatheGeometry(
    points.map(([x, y]) => new THREE.Vector2(x, y)),
    segments,
  );
}

function useCanGeometry() {
  return useMemo(() => {
    // thetaStart = π puts the centre of the label texture facing +Z (the camera).
    const body = new THREE.CylinderGeometry(R, R, BODY_TOP - BODY_BOTTOM, 96, 1, true, Math.PI, Math.PI * 2);
    body.translate(0, (BODY_TOP + BODY_BOTTOM) / 2, 0);

    const shoulder = lathe([
      [R, BODY_TOP],
      [R * 0.99, 0.418],
      [R * 0.95, 0.44],
      [R * 0.88, 0.462],
      [R * 0.84, 0.474],
    ]);

    const rim = lathe([
      [R * 0.84, 0.474],
      [R * 0.85, 0.486],
      [R * 0.848, 0.497],
      [R * 0.825, 0.502],
      [R * 0.8, 0.497],
      [R * 0.79, 0.484],
      [R * 0.77, 0.481],
      [0.0001, 0.481],
    ]);

    const bottom = lathe([
      [0.0001, -0.468],
      [R * 0.5, -0.478],
      [R * 0.72, -0.494],
      [R * 0.8, -0.5],
      [R * 0.87, -0.493],
      [R * 0.95, -0.465],
      [R, BODY_BOTTOM],
    ]);

    const tab = new THREE.CapsuleGeometry(0.022, 0.07, 4, 12);
    tab.rotateZ(Math.PI / 2);
    tab.scale(1, 0.25, 1);

    return { body, shoulder, rim, bottom, tab };
  }, []);
}

function useCanMaterials(label: THREE.Texture) {
  const shared = useMemo(
    () => ({
      paint: new THREE.MeshPhysicalMaterial({
        color: "#0c0c0c",
        metalness: 0.7,
        roughness: 0.28,
        clearcoat: 1,
        clearcoatRoughness: 0.2,
        side: THREE.DoubleSide,
      }),
      metal: new THREE.MeshStandardMaterial({
        color: "#d4d4d4",
        metalness: 1,
        roughness: 0.22,
        side: THREE.DoubleSide,
      }),
    }),
    [],
  );

  const labelMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: label,
        emissiveMap: label,
        emissive: new THREE.Color("#ffffff"),
        emissiveIntensity: 0.28,
        metalness: 0.45,
        roughness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
      }),
    [label],
  );

  return { ...shared, label: labelMaterial };
}

export function CanModel({ label }: { label: THREE.Texture }) {
  const g = useCanGeometry();
  const m = useCanMaterials(label);

  return (
    <group>
      <mesh geometry={g.body} material={m.label} />
      <mesh geometry={g.shoulder} material={m.paint} />
      <mesh geometry={g.rim} material={m.metal} />
      <mesh geometry={g.bottom} material={m.metal} />
      <mesh geometry={g.tab} material={m.metal} position={[0, 0.486, 0.035]} />
    </group>
  );
}
