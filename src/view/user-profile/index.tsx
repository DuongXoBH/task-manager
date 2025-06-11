import { useState } from 'react'
import EditProfile from './edit-profile'
import UserProfile from './profile'
import SheetContentLayout from './sheet-layout'

export default function UserSheet() {
  const [isEditPage, setIsEditPage] = useState(false)
  const content = !isEditPage ? (
    <UserProfile setIsEdit={setIsEditPage} />
  ) : (
    <EditProfile />
  )

  const title = !isEditPage ? 'user profile' : 'user profile edit'

  return (
    <SheetContentLayout
      title={title}
      content={content}
      isEdit={isEditPage}
      setIsEdit={setIsEditPage}
    />
  )
}
