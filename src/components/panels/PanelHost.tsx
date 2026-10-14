import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useUiStore, type Panel } from '../../store/uiStore'
import { Drawer } from '../ui'
import { CartPanel } from './CartPanel'
import { FavoritesPanel } from './FavoritesPanel'
import { MenuPanel } from './MenuPanel'
import { OrdersPanel } from './OrdersPanel'
import { SearchPanel } from './SearchPanel'

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
      return <SearchPanel />
    case 'favorites':
      return <FavoritesPanel />
    case 'orders':
      return <OrdersPanel />
  }
}

/** Renders whichever overlay the UI store has open; closes on navigation. */
export function PanelHost() {
  const { panel, close, closeQuickView } = useUiStore()
  const { pathname } = useLocation()
  useEffect(() => {
    close()
    closeQuickView()
  }, [pathname, close, closeQuickView])

  // Keep the last panel's content mounted while the drawer animates out.
  const [shown, setShown] = useState<Panel | null>(panel)
  if (panel && panel !== shown) setShown(panel)

  return (
    <Drawer open={panel !== null} onClose={close} title={shown ? titles[shown] : ''} contentKey={shown}>
      {shown && <PanelBody panel={shown} />}
    </Drawer>
  )
}
