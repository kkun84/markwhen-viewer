export type ViewerState = {
  readonly source: string
  readonly viewMode: string
}

const toBase64Url = (bytes: Uint8Array): string => {
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('')
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

const fromBase64Url = (value: string): Uint8Array => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4)
  const binary = atob(base64)
  return Uint8Array.from(binary, (char) => char.charCodeAt(0))
}

export const encodeViewerState = (state: ViewerState): string =>
  toBase64Url(new TextEncoder().encode(JSON.stringify(state)))

export const decodeViewerState = (token: string): ViewerState | undefined => {
  try {
    const decoded = new TextDecoder().decode(fromBase64Url(token))
    const parsed = JSON.parse(decoded) as Partial<ViewerState>
    if (typeof parsed.source !== 'string' || typeof parsed.viewMode !== 'string') {
      return undefined
    }
    return { source: parsed.source, viewMode: parsed.viewMode }
  } catch {
    return undefined
  }
}

export const toShareSearch = (state: ViewerState): string => {
  const search = new URLSearchParams()
  search.set('s', encodeViewerState(state))
  return `?${search.toString()}`
}

export const toShareUrl = (state: ViewerState, origin: string, path: string): string => {
  const url = new URL(path, origin)
  url.search = toShareSearch(state)
  return url.toString()
}
