import { redirect } from 'next/navigation'
import { GameLabShell } from '@/components/game-lab-shell'
import { AssetLibrary } from '@/components/assets/asset-library'
import { AssetImportForm } from '@/components/assets/asset-import-form'
import { getCurrentUser, getProfile } from '@/lib/data/game-lab'
import { listRegistryAssets } from '@/lib/data/asset-registry'

export default async function AssetsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/sign-in')
  const [profile, assets] = await Promise.all([getProfile(user.id).catch(() => null), listRegistryAssets({ publicOnly: false }).catch(() => [])])
  return <GameLabShell name={profile?.display_name ?? user.email?.split('@')[0] ?? 'Creator'}><div className="space-y-6"><AssetImportForm /><AssetLibrary assets={assets} /></div></GameLabShell>
}
