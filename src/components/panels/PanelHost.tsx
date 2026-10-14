import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useUiStore, type Panel } from '../../store/uiStore'
import { Drawer } from '../ui'
import { CartPanel } from './CartPanel'
import { ComingSoonPanel } from './ComingSoonPanel'
import { MenuPanel } from './MenuPanel'

const titles: Record<Panel, string> = {
  menu: 'Menu',
  cart: 'Your Order',
  search: 'Search',
  favorites: 'Saved Favourites',
  orders: 'My Orders',
}

function PanelBody({ panel }: { panel: Panel }) {
  switch (panel) {
    case 'menu':
      return <MenuPanel />
    case 'cart':
      return <CartPanel />
    case 'search':
      return <ComingSoonPanel icon="🔍" text="Menu search arrives with the product catalogue (Phase 4)." />
    case 'favorites':
      return <ComingSoonPanel icon="❤️" text="Saved favourites arrive with the product catalogue (Phase 4)." />
    case 'orders':
      return <ComingSoonPanel icon="📦" text="Your order receipts will appear here after checkout (Phase 5)." />
  }
}

/** Renders whichever overlay the UI store has open; closes on navigation. */
export function PanelHost() {
  const { panel, close } = useUiStore()
  const { pathname } = useLocation()
  useEffect(() => close(), [pathname, close])

  // Keep the last panel's content mounted while the drawer animates out.
  const [shown, setShown] = useState<Panel | null>(panel)
  if (panel && panel !== shown) setShown(panel)

  return (
    <Drawer open={panel !== null} onClose={close} title={shown ? titles[shown] : ''} contentKey={shown}>
      {shown && <PanelBody panel={shown} />}
    </Drawer>
  )
}
