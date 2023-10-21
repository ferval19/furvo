import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import NextGame from "./NextGame";

interface Fixture {
  fixture: {
    id: number;
    referee: string;
    date: string;
  };
  teams: {
    home: {
      name: string;
      logo: string;
    };
    away: {
      name: string;
      logo: string;
    };
  };
}

const fetchFixture: any = async (params: any) => {
  const fechaActual = new Date();
  const año = fechaActual.getFullYear();
  const mes = String(fechaActual.getMonth() + 1).padStart(2, "0");
  const dia = String(fechaActual.getDate()).padStart(2, "0");
  const fechaEnFormatoAñoMesDia = `${año}-${mes}-${dia}`;

  const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${fechaEnFormatoAñoMesDia}&league=${params}&season=2023`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "cfd5812b6amsh90b6b90fa19242dp1b3342jsn56fae60f75b5",
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
    next: { revalidate: 43200 },
  };
  try {
    const response = await fetch(url, options);
    const result = await response.text();
    return JSON.parse(result).response;
  } catch (error) {
    console.error(error);
  }
};

export default async function FixturesHome() {
  // Obtén los partidos para todas las ligas en paralelo
  const [fixtures39, fixtures140, fixtures135, fixtures61, fixtures78] =
    await Promise.all([
      fetchFixture(39),
      fetchFixture(140),
      fetchFixture(135),
      fetchFixture(61),
      fetchFixture(78),
    ]);

  // Organiza los datos en un array de objetos
  const games = [
    { leagueName: "Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿 - Premier League", fixtures: fixtures39 },
    { leagueName: "España 🇪🇦 - La Liga", fixtures: fixtures140 },
    { leagueName: "Italia 🇮🇹 - Serie A", fixtures: fixtures135 },
    { leagueName: "Francia 🇫🇷 - Liegue 1", fixtures: fixtures61 },
    { leagueName: "Alemania 🇩🇪 - Bundesliga", fixtures: fixtures78 },
  ];

  // Verifica si todos los juegos están vacíos
  const allGamesEmpty = games.every(({ fixtures }) => fixtures.length === 0);

  return (
    <div className="col-span-4 p-4 mt-4 bg-gray-900 rounded-xl w-full">
      <h1 className="text-2xl font-bold mb-6">Hoy tenemos...</h1>

      {/* Mapea los juegos de todas las ligas */}
      {games.map(({ leagueName, fixtures }) => (
        <div key={leagueName}>
          <h2 className="text-normal my-4">{leagueName}</h2>
          {fixtures.map(
            (
              fixture: {
                fixture: any;
                id: number;
                referee: string;
                date: any;
                teams: any;
              },
              index: any
            ) => (
              <div
                key={fixture.fixture.id}
                className="flex flex-col rounded-xl bg-gray-800 px-8 md:flex-row mb-4 w-full"
              >
                <div className="flex flex-col justify-start p-6 w-full items-center">
                  <div className="flex flex-row justify-center items-center">
                    <div className="flex">
                                          <p className="font-bold md:text-xl">
                      {fixture.teams.home.name}
                    </p>
                    <Image
                      src={fixture.teams.home.logo}
                      width={40}
                      height={40}
                      alt={fixture.teams.home.name}
                      className="mx-2"
                    />
                    </div>
                    <p className="m-4 text-lime-400 font-bold">{fixture.fixture.date.slice(11, 16)}</p>
                    <div className="flex">
                                          <Image
                      src={fixture.teams.away.logo}
                      width={40}
                      height={40}
                      alt={fixture.teams.away.name}
                      className="mx-2"
                    /><p className="font-bold md:text-xl">
                      {fixture.teams.away.name}
                    </p>
                    </div>

                  </div>
                </div>
              </div>
            )
          )}
        </div>
      ))}
      {/* Si todos los juegos están vacíos, muestra los componentes NextGame para todas las ligas */}
      {allGamesEmpty && (
        <div className="col-span-3 px-4">
          {[39, 140, 135, 61, 78].map((leagueId) => (
            <NextGame key={leagueId} leagueId={leagueId} />
          ))}
        </div>
      )}
    </div>
  );
}
