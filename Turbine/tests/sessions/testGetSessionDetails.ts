// run with `npx ts-node tests/sessions/testGetSessionDetails.ts`
import { getSessionDetails } from '../../utils/api';

const TEST_SESSION_ID = '16ae9710-8c48-4371-a9d4-cd59a9a59f5c';

(async () => {
  try {
    const session = await getSessionDetails(TEST_SESSION_ID);
    console.log('Session details:', session);
  } catch (error: any) {
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data);
    } else {
      console.error('Test failed:', error.message);
    }
  }
})();