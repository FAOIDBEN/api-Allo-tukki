import { useNavigate } from 'react-router-dom'
import { path } from '../../../app/screens'
import { AppHeader, ProfileButton, SosIconButton, SosPill } from '../../../design'

/** En-tête standard de l'app client avec boutons SOS et profil. */
export function ClientHeader({
  title,
  back,
  brand,
  subtitle,
  eyebrow,
  sos = 'pill',
}: {
  title: string
  back?: boolean | string
  brand?: boolean
  subtitle?: string
  eyebrow?: string
  sos?: 'pill' | 'icone' | 'aucun'
}) {
  const navigate = useNavigate()
  return (
    <AppHeader
      back={back}
      brand={brand}
      title={title}
      subtitle={subtitle}
      eyebrow={eyebrow}
      eyebrowTone="vert"
      right={
        <>
          {sos === 'pill' && <SosPill onClick={() => navigate(path('C18'))} />}
          {sos === 'icone' && <SosIconButton onClick={() => navigate(path('C18'))} />}
          <ProfileButton onClick={() => navigate(path('C19'))} />
        </>
      }
    />
  )
}
