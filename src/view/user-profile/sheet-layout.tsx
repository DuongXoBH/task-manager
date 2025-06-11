import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ChevronRight, X } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user-info'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface ISheetContentLayoutProps {
  title: string
  content: React.ReactNode
  isEdit: boolean
  setIsEdit: (open: boolean) => void
  className?: string
}

export default function SheetContentLayout({
  title,
  content,
  className,
  isEdit,
  setIsEdit,
}: ISheetContentLayoutProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { clearUserInfo } = useUserStore()
  const { clearAccessToken } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAccessToken()
    clearUserInfo()
    navigate({
      to: '/login',
    })
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) setIsEdit(false)
      }}
    >
      <SheetTrigger asChild>
        <Button
          onClick={() => {
            setIsOpen(true)
            setIsEdit(false)
          }}
          variant='ghost'
          size='icon'
          className='border-gray h-8 w-8 rounded-full border p-0 text-gray-400 hover:bg-white'
        >
          <ChevronRight size={16} />
        </Button>
      </SheetTrigger>
      <SheetContent
        isHidden
        className='w-full overflow-auto rounded-l-2xl border-0 sm:max-w-[508px]'
      >
        <SheetHeader className='h-[70px] w-full flex-row justify-between !border-black bg-black'>
          <SheetTitle className='flex items-center pl-6 text-[18px] text-white capitalize'>
            {title}
          </SheetTitle>
          <Button
            className='bg-accent-foreground p-[9px] hover:bg-gray-600'
            onClick={() => setIsOpen(false)}
          >
            <X size={22} className='text-white'></X>
          </Button>
        </SheetHeader>
        <div className={cn('w-full py-[15px]', className)}>{content}</div>
        {!isEdit && (
          <SheetFooter>
            <Button onClick={handleLogout} className='h-12 w-full'>
              Logout
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
