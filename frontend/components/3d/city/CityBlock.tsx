"use client";

import Buildings from "./Buildings";
import FactoriaBuilding from "./FactoriaBuilding";
import Trees from "./Trees";
import Sidewalks from "./Sidewalks";

type CityBlockProps = {
  position: [number, number, number];
  isCentral?: boolean;
};

export default function CityBlock({
  position,
  isCentral = false,
}: CityBlockProps) {
  return (
    <group position={position}>
      <Sidewalks />

      {/* Las parcelas normales tienen edificios normales */}
      {!isCentral && <Buildings />}

      {/* La parcela central es exclusivamente Factoría F5 */}
      {isCentral && (
        <FactoriaBuilding position={[0, 0, 0]} />
      )}

      <Trees />
    </group>
  );
}
