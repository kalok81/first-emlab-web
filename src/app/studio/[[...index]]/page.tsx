import Studio from './Studio'

export { metadata, viewport } from 'next-sanity/studio'

export const runtime = 'edge'

export default function StudioPage() {
  return <Studio />
}
