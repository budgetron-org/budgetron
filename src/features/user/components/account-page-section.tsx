import { cva } from 'class-variance-authority'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'

interface AccountPageSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  footerText?: string
  variant?: 'default' | 'danger'
}

const cardVariants = cva('overflow-clip shadow-none max-w-[1600px]', {
  variants: {
    variant: {
      default: '',
      danger: 'border-destructive',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})
const cardFooterVariants = cva(
  'flex flex-col items-center gap-2 border-t px-6 py-3 md:flex-row',
  {
    variants: {
      variant: {
        default: 'bg-muted',
        danger: 'bg-destructive/20 border-t-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function AccountPageSection({
  title,
  description,
  children,
  footer,
  footerText,
  variant,
}: AccountPageSectionProps) {
  return (
    <Card className={cardVariants({ variant })}>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && (
        <CardFooter className={cardFooterVariants({ variant })}>
          <div className="text-muted-foreground flex-1">{footerText}</div>
          <div>{footer}</div>
        </CardFooter>
      )}
    </Card>
  )
}

export { AccountPageSection }
