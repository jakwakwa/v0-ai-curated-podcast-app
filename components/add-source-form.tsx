'use client';

import { useFormStatus } from 'react-dom';
import { addPodcastSource } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useActionState, useEffect, useRef } from 'react';

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={disabled || pending}>
      {pending ? 'Adding...' : 'Add Show'}
    </Button>
  );
}

export function AddSourceForm({ disabled }: { disabled: boolean }) {
  const [state, formAction] = useActionState(addPodcastSource, null);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.success === true) {
      toast({
        title: 'Success',
        description: state.message,
      });
      formRef.current?.reset();
    } else if (state?.success === false) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={formAction} className="flex items-center gap-2">
      <div className="relative flex-grow">
        <PlusCircle className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="url"
          name="url"
          placeholder="Enter Youtube show URL..."
          className="pl-8"
          disabled={disabled}
          required
        />
      </div>
      <SubmitButton disabled={disabled} />
    </form>
  );
}
