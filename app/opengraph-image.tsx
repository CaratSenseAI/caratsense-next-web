import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'CaratSense AI — Turn your business chaos into operational clarity'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * next/og (satori) decodes PNG and JPEG only — not WebP.
 * A-06 supplies the background plate only — deliberately textless, so the copy
 * is composited here and stays editable without regenerating the image.
 */
export default async function OG() {
  const bg = await readFile(join(process.cwd(), 'public/render/A-06_og-base.jpg'))
  const bgSrc = `data:image/jpeg;base64,${bg.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          width: '100%',
          height: '100%',
          padding: 68,
          backgroundColor: '#050309',
          backgroundImage: `url(${bgSrc})`,
          backgroundSize: '1200px 630px',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 66,
            lineHeight: 1.06,
            letterSpacing: '-0.03em',
            color: '#f4f1fa',
            maxWidth: 900,
          }}
        >
          Turn your business chaos into operational clarity
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 26,
            fontSize: 21,
            letterSpacing: '0.1em',
            color: '#d4af37',
          }}
        >
          CARATSENSE AI — SEE BEYOND
        </div>
      </div>
    ),
    size,
  )
}
