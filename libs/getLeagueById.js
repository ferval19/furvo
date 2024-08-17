export default async function getLeagueById(id) {
    const url = `https://api-football-v1.p.rapidapi.com/v3/teams?league=${id}&season=2024`;
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
        console.log(result);
        return result;
    } catch (error) {
        console.error(error);
    }
}