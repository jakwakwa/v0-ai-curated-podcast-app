import { CurationBuilder } from '@/components/curation-builder';
import { getUserCurationProfile } from '@/lib/data';
import type { UserCurationProfileWithRelations } from '@/lib/types';
import styles from './page.module.css';

// Force this page to be dynamic since it uses auth()
export const dynamic = 'force-dynamic';

export default async function BuildCurationPage() {
  let collections: UserCurationProfileWithRelations[] = [];
  try {
    collections = await getUserCurationProfile();
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('Error calling getUserCurationProfile:', message);
    collections = [];
  }
  const draftCollection = collections.find((c: UserCurationProfileWithRelations) => c.status === 'Draft');

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.content}>
          <CurationBuilder userCurationProfile={draftCollection} />
        </div>
      </main>
    </div>
  );
}
