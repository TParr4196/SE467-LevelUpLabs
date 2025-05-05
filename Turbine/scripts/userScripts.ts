import { User } from "@/types/user";
import { Game } from "@/types/game";
import { getGames, getUsers } from "@/utils/api";


export const fetchUserGames = async (userId: string): Promise<Game[]> => {
    return await fetchUser(userId)
        .then((user: User) => {
            // Fetch the games owned by the user
            return getGames(user.gamesOwned);
        })
        .then((gameList: any[]) => {
            // Map the games to the Game type
            const gameObjs: Game[] = gameList.map((game: any) => ({
                gameId: game.gameId,
                imageUrl: game.imageUrl,
                name: game.name,
                rating: game.rating,
                recommendedPlayers: game.recommendedPlayers,
                averagePlaytime: game.averagePlaytime,
                genres: game.genres,
            }));
            return gameObjs;
        })
        .catch((error) => {
            console.error('Error in fetchUserGamesLong:', error);
            throw error;
        });
};


export const fetchUser = async (userId: string): Promise<User> => {
    return await getUsers([userId])
        .then((response) => {
            const data = response[0];

            // Map the response data to the User type
            const user: User = {
                userId: data.userId,
                imageUrl: data.imageUrl,
                name: data.name,
                gamesOwned: data.gamesOwned,
            };

            return user;
        })
        .catch((error) => {
            console.error('Error fetching user:', error);
            throw error;
        });
};