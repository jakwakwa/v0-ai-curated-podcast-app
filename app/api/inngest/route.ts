import { serve } from 'inngest/next';
import { inngest } from '../../../inngest/client';
import { generatePodcast } from '../../../inngest/functions';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [generatePodcast],
});
