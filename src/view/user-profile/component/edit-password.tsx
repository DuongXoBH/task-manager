import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Icons } from '@/assets'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { TUpdateForm } from '../types/edit-profile'

export default function EditPassword() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { watch, control } = useFormContext<TUpdateForm>()

  return (
    <div className='flex w-full flex-col'>
      <div className='mb-[17px] flex items-center'>
        <div className='bg-secondary mr-2 h-2 w-2 rounded-full'></div>
        <span className='text-[15px] font-semibold'>Update Password</span>
      </div>
      <div className='flex w-full flex-col space-y-[25px] px-7'>
        <FormField
          control={control}
          name='password'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel className='text-sm leading-[18px] font-semibold text-black'>
                Password
                <span className='text-red-500'>*</span>
              </FormLabel>
              <FormControl>
                <div
                  className={cn(
                    'relative flex h-[50px] w-full items-center rounded-xs',
                    watch('password') ? 'text-black' : 'text-[#697698]'
                  )}
                >
                  <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5'>
                    <Icons.lock />
                  </div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter password'
                    className={cn(
                      'h-[50px] border-1 pl-15 text-sm font-medium placeholder:text-[#697698]',
                      watch('password')
                        ? 'border-secondary'
                        : 'border-[#D1D8EB]'
                    )}
                    {...field}
                  />
                  <Button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute inset-y-0 top-2 right-1 flex items-center rounded-md !bg-white pr-3'
                  >
                    {showPassword ? (
                      <EyeOff className='h-6 w-6 text-gray-400' />
                    ) : (
                      <Eye className='h-6 w-6 text-gray-400' />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='confirm'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel className='text-sm leading-[18px] font-semibold text-black'>
                Confirm Password
                <span className='text-red-500'>*</span>
              </FormLabel>
              <FormControl>
                <div
                  className={cn(
                    'relative flex h-[50px] w-full items-center rounded-xs',
                    watch('confirm') ? 'text-black' : 'text-[#697698]'
                  )}
                >
                  <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5'>
                    <Icons.lock />
                  </div>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='Enter confirm password'
                    className={cn(
                      'h-[50px] border-1 pl-15 text-sm font-medium placeholder:text-[#697698]',
                      watch('confirm') ? 'border-secondary' : 'border-[#D1D8EB]'
                    )}
                    {...field}
                  />
                  <Button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute inset-y-0 top-2 right-1 flex items-center rounded-md !bg-white pr-3'
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='h-6 w-6 text-gray-400' />
                    ) : (
                      <Eye className='h-6 w-6 text-gray-400' />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
