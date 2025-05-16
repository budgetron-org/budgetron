'use client'

import { IconTrash } from '@tabler/icons-react'
import Image from 'next/image'
import { useCallback, useId, useState, type ChangeEventHandler } from 'react'
import { toast } from 'sonner'

import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { cn } from '~/lib/utils'

interface AvatarPickerProps {
  className?: string
  currentImage?: string
  maxFileSize?: number
  name?: string
  onFileChange?: (file: File | undefined) => void
}
function AvatarPicker({
  className,
  currentImage,
  maxFileSize = 5 * 1024 * 1024, // 5MB
  name,
  onFileChange,
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

      onFileChange?.(file)
      setPreview(URL.createObjectURL(file))
    },
    [maxFileSize, onFileChange],
  )
  const clearFile = useCallback(() => {
    onFileChange?.(undefined)
    setPreview(undefined)
  }, [onFileChange])

  return (
    <div className={cn('relative h-max w-max', className)}>
      <Label htmlFor={id} className="h-[100px] w-[100px] cursor-pointer p-0">
        {preview && (
          <Image
            alt="Profile Image"
            src={preview}
            width={100}
            height={100}
            className="aspect-square rounded-full"
          />
        )}
        {!preview && (
          <div className="bg-muted h-[100px] w-[100px] rounded-full" />
        )}
        <input
          id={id}
          type="file"
          accept="image/*"
          name={name}
          className="sr-only"
          onChange={handleFileChange}
        />
      </Label>
      <Button
        size="icon"
        variant="destructive"
        className="absolute right-0 bottom-0 rounded-full"
        onClick={clearFile}>
        <IconTrash />
        <span className="sr-only">Remove Profile Picture</span>
      </Button>
    </div>
  )
}

export { AvatarPicker }
