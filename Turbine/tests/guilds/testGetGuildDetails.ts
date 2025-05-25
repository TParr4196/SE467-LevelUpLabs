// run with `npx ts-node tests/guilds/testGetGuildDetails.ts`
import { getGuildDetails } from '../../utils/api';

(async () => {
  try {
    const guildId = "6f2cbe0d-7e98-4b6f-91cd-8b8de9459dc9"
    const guild = await getGuildDetails(guildId);
    console.log('Guild:', guild);
  } catch (error) {
    console.error('Test failed:', error);
  }
})();