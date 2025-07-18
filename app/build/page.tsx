import { UserCurationProfileCreationWizard } from '@/components/user-curation-profile-creation-wizard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import styles from './page.module.css';

// Force this page to be dynamic since it uses auth()
export const dynamic = 'force-dynamic';

export default async function BuildCurationPage() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.header}>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className={styles.backButton}>
                <ArrowLeft size={16} />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <UserCurationProfileCreationWizard />
        </div>
      </main>
    </div>
  );
}
