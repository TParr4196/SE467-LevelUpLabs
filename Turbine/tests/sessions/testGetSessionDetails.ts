// run with `npx ts-node tests/sessions/testGetSessionDetails.ts`
import { getSessionDetails } from '../../utils/api';

const TEST_SESSION_ID = '1ffbdf5c-7dad-4415-9b6a-0e9126331f58';

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