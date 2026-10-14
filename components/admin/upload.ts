export type UploadedImage = { url: string; width: number; height: number }

export async function uploadImage(file: File): Promise<UploadedImage> {
  const body = new FormData()
  body.append('file', file)
  const res = await fetch('/api/admin/upload', { method: 'POST', body })
  const json = (await res.json().catch(() => ({}))) as Partial<UploadedImage> & { error?: string }
  if (!res.ok || !json.url) throw new Error(json.error || `Upload failed (${res.status})`)
  return json as UploadedImage
}
