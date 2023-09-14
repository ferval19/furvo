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
    next: { revalidate: 43200 }
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
  console.log("Miramos los datos los partidos...");
  const fixtures = await fetchFixture(39);
  const game = fixtures.map((item: { fixture: any }) => item);
  const teams = game.map((item: { teams: any }) => item.teams);
  console.log(game.length);

  const fixturesSpain = await fetchFixture(140);
  const gameSpain = fixturesSpain.map((item: { fixture: any }) => item);

  const fixturesItaly = await fetchFixture(135);
  const gameItaly = fixturesItaly.map((item: { fixture: any }) => item);

  const fixturesFrance = await fetchFixture(61);
  const gameFrance = fixturesFrance.map((item: { fixture: any }) => item);

  const fixturesGermany = await fetchFixture(78);
  const gameGermany = fixturesGermany.map((item: { fixture: any }) => item);

  if (game.length === 0) return (
<div className="col-span-3 px-4">
        {[39, 140, 135, 61, 78].map((leagueId) => (
          <NextGame key={leagueId} leagueId={leagueId} />
        ))}
      </div>
  )

  return (
    <div className="col-span-3 px-4">
      <h1 className="text-2xl font-bold mb-6">Partidos del hoy</h1>
      {game.map(
        (fixture: {
          fixture: any;
          id: number;
          referee: string;
          date: any;
          teams: any;
        }) => (
          <div className="flex flex-col rounded-xl bg-white md:flex-row mb-4 w-full">
            <div className="flex flex-col justify-start p-6 w-full">
              <div className="flex flex-col justify-center items-center">
                <p className="text-xs">{fixture.fixture.date.slice(0, 10)}</p>
                <p className="text-xs font-bold">
                  {fixture.fixture.date.slice(11, 16)}
                </p>
              </div>
              <div className="flex flex-row justify-center items-center">
                <Image
                  src={fixture.teams.home.logo}
                  width={40}
                  height={40}
                  alt={fixture.teams.home.name}
                  className="mr-2"
                />
                <p className="font-bold md:text-xl">
                  {fixture.teams.home.name}
                </p>
                <p className="m-4 font-black">VS</p>
                <p className="font-bold md:text-xl">
                  {fixture.teams.away.name}
                </p>
                <Image
                  src={fixture.teams.away.logo}
                  width={40}
                  height={40}
                  alt={fixture.teams.away.name}
                  className="ml-2"
                />
              </div>
            </div>
          </div>
        )
      )}
      {/* {gameSpain.map(
        (fixture: {
          fixture: any;
          id: number;
          referee: string;
          date: any;
          teams: any;
        }) => (
          <div className="flex flex-col rounded-xl bg-white md:flex-row mb-4 w-full">
            <div className="flex flex-col justify-start p-6 w-full">
              <div className="flex flex-col justify-center items-center">
                <p className="text-xs">{fixture.fixture.date.slice(0, 10)}</p>
                <p className="text-xs font-bold">
                  {fixture.fixture.date.slice(11, 16)}
                </p>
              </div>
              <div className="flex flex-row justify-center items-center">
                <Image
                  src={fixture.teams.home.logo}
                  width={40}
                  height={40}
                  alt={fixture.teams.home.name}
                  className="mr-2"
                />
                <p className="font-bold md:text-xl">
                  {fixture.teams.home.name}
                </p>
                <p className="m-4 font-black">VS</p>
                <p className="font-bold md:text-xl">
                  {fixture.teams.away.name}
                </p>
                <Image
                  src={fixture.teams.away.logo}
                  width={40}
                  height={40}
                  alt={fixture.teams.away.name}
                  className="ml-2"
                />
              </div>
            </div>
          </div>
        )
      )}
      {gameItaly.map(
        (fixture: {
          fixture: any;
          id: number;
          referee: string;
          date: any;
          teams: any;
        }) => (
          <div className="flex flex-col rounded-xl bg-white md:flex-row mb-4 w-full">
            <div className="flex flex-col justify-start p-6 w-full">
              <div className="flex flex-col justify-center items-center">
                <p className="text-xs">{fixture.fixture.date.slice(0, 10)}</p>
                <p className="text-xs font-bold">
                  {fixture.fixture.date.slice(11, 16)}
                </p>
              </div>
              <div className="flex flex-row justify-center items-center">
                <Image
                  src={fixture.teams.home.logo}
                  width={40}
                  height={40}
                  alt={fixture.teams.home.name}
                  className="mr-2"
                />
                <p className="font-bold md:text-xl">
                  {fixture.teams.home.name}
                </p>
                <p className="m-4 font-black">VS</p>
                <p className="font-bold md:text-xl">
                  {fixture.teams.away.name}
                </p>
                <Image
                  src={fixture.teams.away.logo}
                  width={40}
                  height={40}
                  alt={fixture.teams.away.name}
                  className="ml-2"
                />
              </div>
            </div>
          </div>
        )
      )}
      {gameFrance.map(
        (fixture: {
          fixture: any;
          id: number;
          referee: string;
          date: any;
          teams: any;
        }) => (
          <div className="flex flex-col rounded-xl bg-white md:flex-row mb-4 w-full">
            <div className="flex flex-col justify-start p-6 w-full">
              <div className="flex flex-col justify-center items-center">
                <p className="text-xs">{fixture.fixture.date.slice(0, 10)}</p>
                <p className="text-xs font-bold">
                  {fixture.fixture.date.slice(11, 16)}
                </p>
              </div>
              <div className="flex flex-row justify-center items-center">
                <Image
                  src={fixture.teams.home.logo}
                  width={40}
                  height={40}
                  alt={fixture.teams.home.name}
                  className="mr-2"
                />
                <p className="font-bold md:text-xl">
                  {fixture.teams.home.name}
                </p>
                <p className="m-4 font-black">VS</p>
                <p className="font-bold md:text-xl">
                  {fixture.teams.away.name}
                </p>
                <Image
                  src={fixture.teams.away.logo}
                  width={40}
                  height={40}
                  alt={fixture.teams.away.name}
                  className="ml-2"
                />
              </div>
            </div>
          </div>
        )
      )}
      {gameGermany.map(
        (fixture: {
          fixture: any;
          id: number;
          referee: string;
          date: any;
          teams: any;
        }) => (
          <div className="flex flex-col rounded-xl bg-white md:flex-row mb-4 w-full">
            <div className="flex flex-col justify-start p-6 w-full">
              <div className="flex flex-col justify-center items-center">
                <p className="text-xs">{fixture.fixture.date.slice(0, 10)}</p>
                <p className="text-xs font-bold">
                  {fixture.fixture.date.slice(11, 16)}
                </p>
              </div>
              <div className="flex flex-row justify-center items-center">
                <Image
                  src={fixture.teams.home.logo}
                  width={40}
                  height={40}
                  alt={fixture.teams.home.name}
                  className="mr-2"
                />
                <p className="font-bold md:text-xl">
                  {fixture.teams.home.name}
                </p>
                <p className="m-4 font-black">VS</p>
                <p className="font-bold md:text-xl">
                  {fixture.teams.away.name}
                </p>
                <Image
                  src={fixture.teams.away.logo}
                  width={40}
                  height={40}
                  alt={fixture.teams.away.name}
                  className="ml-2"
                />
              </div>
            </div>
          </div>
        )
      )} */}
    </div>
  );
}
