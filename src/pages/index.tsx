import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const planets = [
  {id: 1, title: 'Jupiter'},
  {id: 2, title: 'Saturn'},
  {id: 3, title: 'Uranus'},
  {id: 4, title: 'Neptune'}
] as const;

export const moons = [
  {id: 1, planetId: 1, title: 'Ganymede'},
  {id: 2, planetId: 1, title: 'Callisto'},
  {id: 3, planetId: 1, title: 'Io'},
  {id: 4, planetId: 1, title: 'Europa'},
  {id: 5, planetId: 2, title: 'Titan'},
  {id: 6, planetId: 2, title: 'Rhea'},
  {id: 7, planetId: 2, title: 'Iapetus'},
  {id: 8, planetId: 2, title: 'Dione'},
  {id: 9, planetId: 3, title: 'Titania'},
  {id: 10, planetId: 3, title: 'Oberon'},
  {id: 11, planetId: 3, title: 'Umbriel'},
  {id: 12, planetId: 3, title: 'Ariel'},
  {id: 13, planetId: 3, title: 'Miranda'},
  {id: 14, planetId: 4, title: 'Triton'},
  {id: 15, planetId: 4, title: 'Proteus'},
  {id: 16, planetId: 4, title: 'Nereid'}
] as const;

type Moon = { id: number; planetId: number; title: string };

const moonsByPlanet = new Map<Moon['planetId'], Moon[]>();

moons.forEach((moon) => {
  if (!moonsByPlanet.has(moon.planetId)) moonsByPlanet.set(moon.planetId, []);
  moonsByPlanet.get(moon.planetId)?.push(moon);
});

export default function Home() {
  const [selectedPlanetMoons, setSelectedPlanetMoons] = useState<Map<Moon['planetId'], Set<Moon['id']>>>(new Map());

  const handleMoonClick = (planetId: Moon['planetId'], moonId: Moon['id']) => {
    setSelectedPlanetMoons(prev => {
      const newSelection = new Map(prev);
      const moonsSet = new Set<Moon['id']>(newSelection.get(planetId) || []);

      if (moonsSet.has(moonId)) moonsSet.delete(moonId);
      else moonsSet.add(moonId);

      newSelection.set(planetId, moonsSet);
      if (!moonsSet.size) newSelection.delete(planetId);

      return newSelection;
    });
  }

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen p-20 font-[family-name:var(--font-geist-sans)]`}>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {
          planets.map((planet) => {
            const selectedMoons = selectedPlanetMoons.get(planet.id) || new Set<Moon['id']>();
            return (
              <div className="flex items-center" key={planet.id}>
                <div className="planet">
                  <p className="w-full flex items-center justify-center text-center font-bold">
                    <span>{planet.title}</span>
                    <span className={`ml-1.5 text-(--selected)`}>{selectedMoons.size}</span>
                  </p>
                  {
                    selectedMoons
                      .keys()
                      .map((moonId, i) => (
                        <div key={moonId} className={`planet-moon-circle`} />
                      ))
                  }
                </div>
                {
                  moonsByPlanet.get(planet.id)?.map((moon) => (
                    <div
                      key={moon.id}
                      className={selectedMoons.has(moon.id) ? `moon !bg-(--selected)` : `moon`}
                      onClick={() => handleMoonClick(planet.id, moon.id)}
                    >
                      <span className="font-mono">{moon.title}</span>
                    </div>
                  ))
                }
              </div>
            );
          })
        }
      </main>
    </div>
  );
}
