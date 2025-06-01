// run with `npx ts-node tests/sessions/testAddSessionMembers.ts`
import { addSessionMembers } from '../../utils/api';

const TEST_SESSION_ID = '624fd4a5-c124-4468-b533-554dadf00906'; // Replace with a real sessionId
const TEST_USER_IDS = ['e6c90de2-983f-4e61-9485-4024fc3d8f87', 'b1c9038e-9f0a-49a6-a34d-62c44505ec47']; // Replace with real userIds

(async () => {
  try {
    const status = await addSessionMembers(TEST_SESSION_ID, TEST_USER_IDS);
    console.log(`Add session members status: ${status}`);
  } catch (error: any) {
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data);
    } else {
      console.error('Test failed:', error.message);
    }
  }
})();