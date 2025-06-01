// run with `npx ts-node tests/users/testGetUsers.ts`
import { getUsers } from '../../utils/api';

const TEST_USER_IDS = ['a07aef8e-8bd5-4b91-bfcd-36570e2b15f9']; // Replace with real userIds

(async () => {
  try {
    const users = await getUsers(TEST_USER_IDS);
    console.log('Fetched users:', users);
  } catch (error: any) {
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data);
    } else {
      console.error('Test failed:', error.message);
    }
  }
})();