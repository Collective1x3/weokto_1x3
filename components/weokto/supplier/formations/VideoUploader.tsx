'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import * as Icons from 'phosphor-react'
import { UploadProgressBar } from './UploadProgressBar'

const lessonSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères').max(100),
  description: z.string().max(500).optional(),
  isFree: z.boolean(),
})

type LessonFormData = z.infer<typeof lessonSchema>

interface VideoUploaderProps {
  slug: string
  moduleId: string
  onSuccess: () => void
  onCancel: () => void
}

interface VideoData {
  bunnyVideoId: string
  bunnyLibraryId: string
  thumbnailUrl: string | null
  videoStatus: string
  title: string
}

export function VideoUploader({ slug, moduleId, onSuccess, onCancel }: VideoUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [videoData, setVideoData] = useState<VideoData | null>(null)
  const [transcodeStatus, setTranscodeStatus] = useState<string | null>(null)
  const [isPolling, setIsPolling] = useState(false)
  const [isCreatingLesson, setIsCreatingLesson] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LessonFormData>({
    defaultValues: {
      title: '',
      description: '',
      isFree: false,
    },
  })

  const isFree = watch('isFree')

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [])

  const validateFile = (file: File): string | null => {
    const maxSize = 2 * 1024 * 1024 * 1024 // 2GB
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime']

    if (file.size > maxSize) {
      return 'Le fichier ne doit pas dépasser 2GB'
    }

    if (!allowedTypes.includes(file.type)) {
      return 'Format non supporté. Utilisez MP4, WebM ou MOV'
    }

    return null
  }

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setSelectedFile(file)
    setError(null)
    // Set default title from filename
    const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, '')
    setValue('title', nameWithoutExtension)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const uploadVideo = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('title', watch('title') || selectedFile.name)

      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100)
          setUploadProgress(progress)
        }
      })

      xhr.addEventListener('load', async () => {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText)
          setVideoData(result)
          setTranscodeStatus(result.videoStatus)

          // Start polling if not ready
          if (result.videoStatus !== 'ready') {
            startPolling(result.bunnyVideoId)
          }
        } else {
          const error = JSON.parse(xhr.responseText)
          throw new Error(error.error || 'Échec de l\'upload')
        }
        setIsUploading(false)
      })

      xhr.addEventListener('error', () => {
        setError('Erreur réseau lors de l\'upload')
        setIsUploading(false)
      })

      xhr.open('POST', `/api/supplier/guilds/${slug}/formations/upload`)
      xhr.send(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload')
      setIsUploading(false)
    }
  }

  const startPolling = (videoId: string) => {
    setIsPolling(true)

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/supplier/guilds/${slug}/formations/upload?videoId=${videoId}`
        )
        const data = await res.json()

        setTranscodeStatus(data.videoStatus)

        if (data.videoStatus === 'ready' || data.videoStatus === 'error') {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
          }
          setIsPolling(false)
        }
      } catch (err) {
        console.error('Polling error:', err)
      }
    }, 5000) // Poll every 5 seconds
  }

  const onSubmit = async (data: LessonFormData) => {
    if (!videoData) return

    setIsCreatingLesson(true)
    setError(null)

    try {
      const res = await fetch(`/api/supplier/guilds/${slug}/formations/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId,
          title: data.title,
          description: data.description || null,
          bunnyVideoId: videoData.bunnyVideoId,
          bunnyLibraryId: videoData.bunnyLibraryId,
          thumbnailUrl: videoData.thumbnailUrl,
          videoStatus: transcodeStatus || videoData.videoStatus,
          isFree: data.isFree,
          videoDuration: 0, // Will be updated when video is processed
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Échec de la création de la leçon')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de la leçon')
    } finally {
      setIsCreatingLesson(false)
    }
  }

  const canCreateLesson = videoData && (transcodeStatus === 'ready' || videoData.videoStatus === 'ready')

  return (
    <div className="border-2 border-[#B794F4] bg-black/90 p-6 font-mono">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Icons.Upload size={24} className="text-[#FFB000]" />
          <h3 className="text-lg font-bold text-white">UPLOAD VIDÉO</h3>
        </div>
      </div>

      {error && (
        <div className="mb-6 border-2 border-[#EF4444] bg-[#EF4444]/10 p-4">
          <div className="flex gap-3">
            <Icons.Warning size={20} className="text-[#EF4444] flex-shrink-0" />
            <p className="text-sm text-[#EF4444]">{error}</p>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {!selectedFile && !videoData && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed p-12 text-center transition-colors ${
            isDragging
              ? 'border-[#FFB000] bg-[#FFB000]/5'
              : 'border-[#B794F4]/30 bg-[#B794F4]/5'
          }`}
        >
          <Icons.CloudArrowUp
            size={64}
            className={`mx-auto mb-4 ${isDragging ? 'text-[#FFB000]' : 'text-[#B794F4]'}`}
          />
          <p className="text-white font-bold mb-2">Glissez votre vidéo ici</p>
          <p className="text-[#B794F4]/60 text-sm mb-4">ou cliquez pour parcourir</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2 bg-[#B794F4] text-white font-bold hover:bg-[#FFB000] transition-colors"
          >
            [SÉLECTIONNER UN FICHIER]
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <p className="text-xs text-[#B794F4]/40 mt-4">
            Formats: MP4, WebM, MOV • Maximum: 2GB
          </p>
        </div>
      )}

      {/* Selected File Preview */}
      {selectedFile && !videoData && (
        <div className="space-y-4">
          <div className="border border-[#B794F4]/30 p-4">
            <div className="flex items-center gap-3 mb-4">
              <Icons.VideoCamera size={32} className="text-[#FFB000]" />
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold truncate">{selectedFile.name}</p>
                <p className="text-[#B794F4]/60 text-xs">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              {!isUploading && (
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-[#EF4444] hover:text-[#EF4444]/80"
                >
                  <Icons.X size={20} />
                </button>
              )}
            </div>

            {isUploading && <UploadProgressBar progress={uploadProgress} />}
          </div>

          {!isUploading && (
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-3 border-2 border-[#B794F4] text-[#B794F4] hover:bg-[#B794F4]/10 transition-colors font-bold"
              >
                ANNULER
              </button>
              <button
                onClick={uploadVideo}
                className="flex-1 px-4 py-3 bg-[#B794F4] text-white hover:bg-[#FFB000] transition-colors font-bold"
              >
                <Icons.CloudArrowUp size={20} className="inline mr-2" />
                UPLOADER
              </button>
            </div>
          )}
        </div>
      )}

      {/* Video Processing & Form */}
      {videoData && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Video Status */}
          <div className="border border-[#B794F4]/30 p-4">
            <div className="flex items-center gap-3 mb-3">
              {videoData.thumbnailUrl ? (
                <img
                  src={videoData.thumbnailUrl}
                  alt="Thumbnail"
                  className="w-24 h-16 object-cover border border-[#B794F4]"
                />
              ) : (
                <div className="w-24 h-16 border border-[#B794F4] bg-[#B794F4]/10 flex items-center justify-center">
                  <Icons.VideoCamera size={24} className="text-[#B794F4]" />
                </div>
              )}
              <div className="flex-1">
                <p className="text-white font-bold text-sm mb-1">Vidéo uploadée</p>
                {transcodeStatus === 'processing' || isPolling ? (
                  <div className="flex items-center gap-2 text-[#FFB000] text-xs">
                    <Icons.CircleNotch size={14} className="animate-spin" />
                    <span>Traitement en cours...</span>
                  </div>
                ) : transcodeStatus === 'ready' ? (
                  <div className="flex items-center gap-2 text-[#10B981] text-xs">
                    <Icons.CheckCircle size={14} weight="fill" />
                    <span>Prête à l'emploi</span>
                  </div>
                ) : transcodeStatus === 'error' ? (
                  <div className="flex items-center gap-2 text-[#EF4444] text-xs">
                    <Icons.XCircle size={14} weight="fill" />
                    <span>Erreur de traitement</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[#B794F4] text-xs">
                    <Icons.Clock size={14} />
                    <span>En attente...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lesson Form */}
          <div>
            <label htmlFor="title" className="block text-sm font-bold text-white mb-2">
              TITRE DE LA LEÇON *
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              disabled={isCreatingLesson}
              className="w-full px-4 py-3 bg-black border-2 border-[#B794F4] text-white focus:border-[#FFB000] focus:outline-none transition-colors disabled:opacity-50"
              placeholder="Ex: Introduction au module"
            />
            {errors.title && (
              <p className="mt-2 text-xs text-[#EF4444] flex items-center gap-1">
                <Icons.Warning size={12} />
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-bold text-white mb-2">
              DESCRIPTION
            </label>
            <textarea
              id="description"
              {...register('description')}
              disabled={isCreatingLesson}
              rows={3}
              className="w-full px-4 py-3 bg-black border-2 border-[#B794F4] text-white focus:border-[#FFB000] focus:outline-none transition-colors resize-none disabled:opacity-50"
              placeholder="Décrivez le contenu de cette leçon..."
            />
            {errors.description && (
              <p className="mt-2 text-xs text-[#EF4444]">{errors.description.message}</p>
            )}
          </div>

          {/* Free Toggle */}
          <div className="border border-[#B794F4]/30 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icons.Gift size={20} className="text-[#FFB000]" />
              <div>
                <p className="text-sm font-bold text-white">Leçon gratuite</p>
                <p className="text-xs text-[#B794F4]/60">
                  Accessible sans abonnement
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setValue('isFree', !isFree)}
              disabled={isCreatingLesson}
              className={`relative w-12 h-6 rounded-full transition-all disabled:opacity-50 ${
                isFree ? 'bg-[#10B981]' : 'bg-[#B794F4]/30'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
                  isFree ? 'left-6' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isCreatingLesson}
              className="flex-1 px-4 py-3 border-2 border-[#B794F4] text-[#B794F4] hover:bg-[#B794F4]/10 transition-colors font-bold disabled:opacity-50"
            >
              ANNULER
            </button>
            <button
              type="submit"
              disabled={!canCreateLesson || isCreatingLesson}
              className="flex-1 px-4 py-3 bg-[#B794F4] text-white hover:bg-[#FFB000] transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCreatingLesson ? (
                <>
                  <Icons.CircleNotch size={20} className="animate-spin" />
                  CRÉATION...
                </>
              ) : (
                <>
                  <Icons.Plus size={20} />
                  CRÉER LA LEÇON
                </>
              )}
            </button>
          </div>

          {!canCreateLesson && transcodeStatus !== 'error' && (
            <p className="text-xs text-[#FFB000] text-center">
              Veuillez attendre que le traitement de la vidéo soit terminé
            </p>
          )}
        </form>
      )}
    </div>
  )
}