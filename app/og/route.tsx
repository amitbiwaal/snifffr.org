import { renderOgImage } from '@/lib/og'
import { site } from '@/lib/site'

export const dynamic = 'force-static'

/** Default social-share image for every page that does not have its own. */
export async function GET() {
  return renderOgImage({ title: site.defaultTitle })
}
