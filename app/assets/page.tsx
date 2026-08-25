import { redirect } from 'next/navigation'
import { GameLabShell } from '@/components/game-lab-shell'
import { AssetLibrary } from '@/components/assets/asset-library'
import { getCurrentUser, getProfile } from '@/lib/data/game-lab'
import { listRegistryAssets } from '@/lib/data/asset-registry'

export default async function AssetsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/sign-in')
  const [profile, assets] = await Promise.all([getProfile(user.id).catch(() => null), listRegistryAssets({ publicOnly: false }).catch(() => [])])
  return <GameLabShell name={profile?.display_name ?? user.email?.split('@')[0] ?? 'Creator'}><AssetLibrary assets={assets} /></GameLabShell>
}
