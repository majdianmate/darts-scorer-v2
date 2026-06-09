const PROFILE_MAX_DIMENSION = 512
const PROFILE_JPEG_QUALITY = 0.85
const PROFILE_DATA_URL_MAX_LENGTH = 900_000
const STORAGE_UPLOAD_TIMEOUT_MS = 15_000

function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message: string,
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(message)), ms)
    }),
  ])
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }
      reject(new Error('Failed to read image data.'))
    }
    reader.onerror = () => reject(new Error('Failed to read image data.'))
    reader.readAsDataURL(blob)
  })
}

export async function compressProfileImage(file: File): Promise<Blob> {
  if (typeof createImageBitmap !== 'function') {
    throw new Error('Image processing is not supported in this browser.')
  }

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(
    1,
    PROFILE_MAX_DIMENSION / Math.max(bitmap.width, bitmap.height),
  )
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) {
    bitmap.close()
    throw new Error('Failed to process image.')
  }

  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', PROFILE_JPEG_QUALITY)
  })

  if (!blob) {
    throw new Error('Failed to compress image.')
  }

  return blob
}

export async function prepareProfileImage(file: File) {
  const blob = await compressProfileImage(file)
  const dataUrl = await blobToDataUrl(blob)

  if (dataUrl.length > PROFILE_DATA_URL_MAX_LENGTH) {
    throw new Error('Image is still too large after compression.')
  }

  return { blob, dataUrl }
}

export function isRemoteProfileImageUrl(url: string) {
  return /^https?:\/\//i.test(url)
}

export { STORAGE_UPLOAD_TIMEOUT_MS, withTimeout }
