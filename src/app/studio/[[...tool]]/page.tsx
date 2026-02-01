import Studio from './Studio'

export { metadata, viewport } from 'next-sanity/studio'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return [{ tool: [] }]
}

export default function StudioPage() {
  return <Studio />
}
