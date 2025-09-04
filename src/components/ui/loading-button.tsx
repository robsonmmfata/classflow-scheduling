import { Button, ButtonProps } from './button';
import { LoadingSpinner } from './loading-spinner';
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

export const LoadingButton = ({ 
  loading = false, 
  loadingText, 
  children, 
  disabled, 
  className,
  ...props 
}: LoadingButtonProps) => {
  return (
    <Button 
      disabled={loading || disabled} 
      className={cn(className)}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          {loadingText || children}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingButton;