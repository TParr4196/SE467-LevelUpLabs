// run with `npx ts-node tests/sessions/testVoteForGame.ts`
import { voteForGame } from '../../utils/api';

const TEST_SESSION_ID = '624fd4a5-c124-4468-b533-554dadf00906'; // Replace with a real sessionId
const TEST_GAME_ID = '53e5f7ec-df8b-499a-89b2-187438b40b23';       // Replace with a real gameId in that session

(async () => {
  try {
    const status = await voteForGame(TEST_SESSION_ID, TEST_GAME_ID);
    console.log(`Vote status: ${status}`);
  } catch (error: any) {
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data);
    } else {
      console.error('Test failed:', error.message);
    }
  }
})();