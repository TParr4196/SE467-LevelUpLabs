// run with `npx ts-node tests/sessions/testCreateSession.ts`
import { createSession } from '../../utils/api';

const TEST_GAME_IDS = [
  '53e5f7ec-df8b-499a-89b2-187438b40b23',
  'a6bcb274-3565-4b72-8b4d-42f8fa7e37e3',
  'e3c4cbe7-97a2-4de6-8a60-b1f5b0ea3e19'
];
const TEST_USER_IDS = [
  '3f9a9b0c-7db3-4f65-a2e3-c019d893f187',
  'a07aef8e-8bd5-4b91-bfcd-36570e2b15f9',
];

(async () => {
  try {
    const result = await createSession({
      gameIds: TEST_GAME_IDS,
      userIds: TEST_USER_IDS
    });
    console.log('Session created:', result);
  } catch (error) {
    console.error('Test failed:', error);
  }
})();