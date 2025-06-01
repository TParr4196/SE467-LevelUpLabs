// run with `npx ts-node tests/sessions/testDeleteSession.ts`
import { deleteSession } from '../../utils/api';

const TEST_SESSION_ID = '16ae9710-8c48-4371-a9d4-cd59a9a59f5c'; // Replace with a real sessionId

(async () => {
  try {
    const status = await deleteSession(TEST_SESSION_ID);
    console.log(`Delete session status: ${status}`);
  } catch (error: any) {
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data);
    } else {
      console.error('Test failed:', error.message);
    }
  }
})();