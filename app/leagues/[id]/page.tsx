import Image from "next/image";
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
    const teams = league.map((item: { team: any; }) => item.team)
    


    console.log(teams);

  return (
    <div>
      <h1 className="text-white">Aqui mostramos los datos de la liga ...</h1>
      {teams.map((team: {
          logo: string ;
          country: ReactNode;
          founded: ReactNode; 
          id: number; 
          name: string ; 
}) => (
                <div className="max-w-md mx-auto bg-gray-800 shadow-md rounded-md overflow-hidden" key={team.id}>
                    <Image src={team.logo} className="w-full h-40 object-cover" alt={team.name} width={100} height={100}/>
                {/* <img className="w-full h-40 object-cover" src="URL_DEL_LOGO_DEL_EQUIPO" alt="Logo del equipo"> */}
                <div className="p-4 text-white">
                  <h2 className="text-lg font-semibold mb-2">{team.name}</h2>
                  <p className="text-gray-300">País: {team.country}</p>
                  <p className="text-gray-300">Fundado en:{team.founded}</p>
                  <div className="mt-4">
                    <a href="URL_DEL_EQUIPO" className="text-blue-500 hover:underline">Ver más</a>
                  </div>
                </div>
              </div>
            ))}

    </div>
  );
}
