import Image from "next/image";
import Link from "next/link";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode } from "react";

const fetchLeague: any = async (params: any) => {
  const url = `https://api-football-v1.p.rapidapi.com/v3/teams?league=${params}&season=2023`;
  const options = {
      method: 'GET',
      headers: {
          'X-RapidAPI-Key': 'cfd5812b6amsh90b6b90fa19242dp1b3342jsn56fae60f75b5',
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
      }
  };
  try {
	const response = await fetch(url, options);
	const result = await response.text();
  console.log(result)
    console.log('Obtenemos los datos de la premier....')
    console.log(params)
    // console.log(JSON.parse(result).response.map(item => item.team))
	return JSON.parse(result).response;
} catch (error) {
	console.error(error);
}
}


export default async function Page (params:any) {

    console.log('Miramos los datos de la liga...')
    console.log(params.params.id)
    const league = await fetchLeague(params.params?.id);
    console.log(league)
    const teams = league.map((item: { team: any; }) => item.team)
    



  return (
    <div>
      <h1 className="text-2xl">Equipos de la liga</h1>
      {teams.map((team: {
          logo: string ;
          country: ReactNode;
          founded: ReactNode; 
          id: number; 
          name: string ; 
}) => (
  <div
  className="flex flex-col rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] md:max-w-xl md:flex-row">
  
  <Image src={team.logo} className="h-9 w-full rounded-t-lg object-cover md:h-auto md:!rounded-none md:!rounded-l-lg" alt={team.name} width={50} height={50}/><img
 />
  <div className="flex flex-col justify-start p-6">
    <h5
      className="mb-2 text-xl font-medium text-neutral-800">
      {team.name}
    </h5>
    <p className="mb-4 text-base text-neutral-600 ">
      {team.country}
    </p>
    <p className="text-xs text-neutral-500 ">
      {team.founded}
    </p>
    <Link href={`${params.params?.id}/${team.id}`}>Ver equipo</Link>
  </div>
</div>

  
              //   <div className="max-w-md mx-auto bg-gray-800 shadow-md rounded-md overflow-hidden" key={team.id}>
              //       <Image src={team.logo} className="w-full h-40 object-cover" alt={team.name} width={100} height={100}/>
              //   {/* <img className="w-full h-40 object-cover" src="URL_DEL_LOGO_DEL_EQUIPO" alt="Logo del equipo"> */}
              //   <div className="p-4 text-white">
              //     <h2 className="text-lg font-semibold mb-2">{team.name}</h2>
              //     <p className="text-gray-300">País: {team.country}</p>
              //     <p className="text-gray-300">Fundado en:{team.founded}</p>
              //     <div className="mt-4">
              //       <a href="URL_DEL_EQUIPO" className="text-blue-500 hover:underline">Ver más</a>
              //     </div>
              //   </div>
              // </div>
            ))}

    </div>
  );
}
