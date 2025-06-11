import { useFormContext } from 'react-hook-form'
import { Icons } from '@/assets'
import { cn } from '@/lib/utils'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import PhoneInputComponent from '../../../components/phone-input'
import { TUpdateForm } from '../types/edit-profile'

export default function PersonalInfoEdit() {
  const { watch, control } = useFormContext<TUpdateForm>()

  return (
    <div className='flex w-full flex-col'>
      <div className='mb-[17px] flex items-center'>
        <div className='bg-secondary mr-2 h-2 w-2 rounded-full'></div>
        <span className='text-[15px] font-semibold'>Personal Info</span>
      </div>
      <div className='flex w-full flex-col space-y-[25px] px-7'>
        <FormField
          control={control}
          name='name'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel className='text-sm leading-[18px] font-semibold text-black'>
                Full Name
              </FormLabel>
              <FormControl>
                <div
                  className={cn(
                    'relative flex h-[50px] w-full items-center rounded-xs',
                    watch('name') ? 'text-black' : 'text-[#697698]'
                  )}
                >
                  <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5'>
                    <Icons.user />
                  </div>
                  <Input
                    placeholder='Enter fullname'
                    className={cn(
                      'h-[50px] border-1 pl-15 text-sm font-medium placeholder:text-[#697698]',
                      watch('name') ? 'border-secondary' : 'border-[#D1D8EB]'
                    )}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='email'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel className='text-sm leading-[18px] font-semibold text-black'>
                Email Address
              </FormLabel>
              <FormControl>
                <div
                  className={cn(
                    'relative flex h-[50px] w-full items-center rounded-xs',
                    watch('email') ? 'text-black' : 'text-[#697698]'
                  )}
                >
                  <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5'>
                    <Icons.mail />
                  </div>
                  <Input
                    placeholder='Enter email address'
                    className={cn(
                      'h-[50px] border-1 pl-15 text-sm font-medium placeholder:text-[#697698]',
                      watch('email') ? 'border-secondary' : 'border-[#D1D8EB]'
                    )}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <PhoneInputComponent />
      </div>
    </div>
  )
}
