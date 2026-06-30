import { supabase } from '@/config/supabase'

function authenticatedUser() {
  const user = supabase.auth.getUser()
  return user
}

export const useUpload = () => {
  // authenticated user can upload files to their own folder in the storage bucket
  if (!authenticatedUser()) {
    throw new Error('User not authenticated')
  }
  const upload = async (file: File, userGuid: string) => {
    const ext = file.name.split('.').pop()
    const path = `${userGuid}/${crypto.randomUUID()}.${ext}` // organized by user

    const { data, error } = await supabase.storage.from('task_management').upload(path, file, {
      contentType: file.type,
      upsert: false,
    })

    if (error) throw new Error(error.message)

    return data.path // store this path in your DB
  }

  // get signed URL to display the file
  const getUrl = async (path: string) => {
    const { data } = await supabase.storage.from('task_management').createSignedUrl(path, 3600) // expires in 1 hour

    return data?.signedUrl
  }

  return { upload, getUrl }
}
