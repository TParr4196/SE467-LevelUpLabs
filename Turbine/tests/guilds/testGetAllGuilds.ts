// run with `npx ts-node tests/guilds/testGetAllGuilds.ts`
import { getAllGuilds } from '../../utils/api';

(async () => {
  try {
    const guilds = await getAllGuilds();
    console.log('Guilds:', guilds);
  } catch (error) {
    console.error('Test failed:', error);
  }
})();