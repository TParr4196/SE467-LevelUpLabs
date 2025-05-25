// run with `npx ts-node tests/guilds/testAddGuildMember.ts`
import { addGuildMember } from '../../utils/api';

const TEST_GUILD_ID = 'b6e7c2e4-5f8a-4a2b-9d3f-2c1e8a7b4f6d';
const TEST_USER_ID = 'b1c9038e-9f0a-49a6-a34d-62c44505ec47';

(async () => {
  try {
    const status = await addGuildMember(TEST_GUILD_ID, { userId: TEST_USER_ID, role: 'TestAdd' });
    console.log(`Add member status: ${status}`);
  } catch (error) {
    console.error('Test failed:', error);
  }
})();