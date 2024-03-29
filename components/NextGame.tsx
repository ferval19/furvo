import Image from "next/image";
import Link from "next/link";
import {
  Key,
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  PromiseLikeOfReactNode,
} from "react";
import IconStadium from "./IconStadium";
import IconClock from "./IconClock";

const fetchFixture: any = async (params: any) => {
  // Obtén la fecha actual
  const fechaActual = new Date();

  // Obtiene el año, mes y día
  const año = fechaActual.getFullYear();
  // El mes se indexa desde 0, así que sumamos 1 para obtener el mes actual.
  const mes = String(fechaActual.getMonth() + 1).padStart(2, "0");
  const dia = String(fechaActual.getDate()).padStart(2, "0");

  // Crea la cadena en formato "año-mes-día"
  const fechaEnFormatoAñoMesDia = `${año}-${mes}-${dia}`;
  console.log(fechaEnFormatoAñoMesDia);
  console.log("paramns ->" + params);
  const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?next=1&league=${params}&season=2023`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "cfd5812b6amsh90b6b90fa19242dp1b3342jsn56fae60f75b5",
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    }
  };
  try {
    const response = await fetch(url, options);
    const result = await response.text();
    return JSON.parse(result).response;
  } catch (error) {
    console.error(error);
  }
};

export default async function NextGame({ leagueId }: any) {
  console.log("Miramos los datos los partidos...");
  const fixtures = await fetchFixture(leagueId);
  const game = fixtures.map((item: { fixture: any }) => item).slice(0, 3);
  const teams = game.map((item: { teams: any }) => item.teams);
  console.log(game.length);

  if (game.length === 0)
    return (
      <div className="col-span-2 px-4">
        <h1 className="text-2xl font-bold mb-6">
          No hay partidos buenos para hoy...
        </h1>
      </div>
    );

  return (
    <>
      {game.map(
        (
          fixture: {
            fixture: any;
            id: number;
            referee: string;
            date: any;
            teams: any;
            score: any;
          },
          index: any
        ) => (
          <div
            key={fixture.fixture.id}
            className={`flex flex-col rounded-xl bg-gradient-to-r from-indigo-800 to-indigo-600 md:flex-row mt-4 w-full`}
          >
            <div className="flex flex-wrap justify-between p-6 w-full">
              <div className="flex flex-col">
              <div className="flex flex-row items-center">
                  <p className="font-bold md:text-3xl">
                    {fixture.teams.home.name}
                  </p>
                  <span className="mx-1 text-lime-400">VS</span>
                  <p className="font-bold md:text-3xl">
                    {fixture.teams.away.name}
                  </p>
                </div>
                <div className="flex flex-col">
                <div className="flex flex-wrap">
                    <IconClock />
                    <p className="ml-2 text-xs">{fixture.fixture.date.slice(0, 10)}, {fixture.fixture.date.slice(11, 16)}</p>
                  </div>
                  
                  <div className="flex flex-wrap">
                    <IconStadium />
                    <p className="ml-2 font-bold">{fixture.fixture.venue.name}</p>
                  </div>
                  
                </div>
                
              </div>

              <div className="flex flex-wrap justify-end items-end">
                <Image
                  src={fixture.teams.home.logo}
                  width={100}
                  height={100}
                  alt={fixture.teams.home.name}
                  className="mr-2"
                />
                <Image
                  src={fixture.teams.away.logo}
                  width={100}
                  height={100}
                  alt={fixture.teams.away.name}
                  className="ml-2"
                />
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
}
