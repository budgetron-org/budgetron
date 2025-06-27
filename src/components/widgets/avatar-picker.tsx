'use client'

import { IconTrash } from '@tabler/icons-react'
import { useCallback, useId, useState, type ChangeEventHandler } from 'react'
import { toast } from 'sonner'

import { Avatar, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import {
  cn,
  getGravatarUrl,
  getInitialsAvatarUrl,
  getPlaceHolderAvatarUrl,
} from '~/lib/utils'

async function hash(text: string) {
  const textUint8 = new TextEncoder().encode(text) // encode as (utf-8) Uint8Array
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', textUint8) // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
  return hashHex
}

interface AvatarPickerProps {
  className?: string
  currentImage?: string
  email: string
  maxFileSize?: number
  name?: string
  userDisplayName: string
  onImageChange?: (image: File | string | undefined) => void
}
function AvatarPicker({
  className,
  currentImage,
  email,
  maxFileSize = 5 * 1024 * 1024, // 5MB
  name,
  userDisplayName,
  onImageChange,
}: AvatarPickerProps) {
  const id = useId()
  const [preview, setPreview] = useState(currentImage)
  const handleFileChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      const file = e.target.files?.[0]
      if (!file) {
        return
      }

      // Validate file
      if (file.type.split('/')[0] !== 'image') {
        toast.error('Please select an image file')
        return
      }

      if (file.size > maxFileSize) {
        toast.error(`File size too big (max ${maxFileSize / 1024 / 1024}MB)`)
        return
      }

      onImageChange?.(file)
      setPreview(URL.createObjectURL(file))
    },
    [maxFileSize, onImageChange],
  )
  const clearFile = useCallback(() => {
    onImageChange?.(undefined)
    setPreview(undefined)
  }, [onImageChange])

  const setGravatarImage = useCallback(async () => {
    const emailHash = await hash(email)
    const gravatarUrl = getGravatarUrl(emailHash)
    onImageChange?.(gravatarUrl)
    setPreview(gravatarUrl)
  }, [email, onImageChange])

  const setInitialsImage = useCallback(async () => {
    const initialsUrl = getInitialsAvatarUrl(userDisplayName)
    onImageChange?.(initialsUrl)
    setPreview(initialsUrl)
  }, [userDisplayName, onImageChange])

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div className="relative h-max w-max">
        <Label htmlFor={id} className="cursor-pointer p-0">
          <Avatar className="size-[100px]">
            <AvatarImage src={preview ?? getPlaceHolderAvatarUrl()} />
          </Avatar>

          <input
            id={id}
            type="file"
            accept="image/*"
            name={name}
            className="sr-only"
            onChange={handleFileChange}
          />
        </Label>
        {preview && (
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute right-0 bottom-0 rounded-full"
            onClick={clearFile}>
            <IconTrash />
            <span className="sr-only">Remove Profile Picture</span>
          </Button>
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={setInitialsImage}>
        Use Initials
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={setGravatarImage}>
        Use Gravatar
      </Button>
    </div>
  )
}

export { AvatarPicker }
