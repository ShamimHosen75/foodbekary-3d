import { useUiStore } from '../../store/uiStore'
import { Button, IconButton } from '../ui'
import { CartButton } from './CartButton'

export function HeaderActions({ showMenu }: { showMenu: boolean }) {
  const open = useUiStore((s) => s.open)
  return (
    <div className="flex items-center gap-2">
      <div className="hidden items-center gap-2 sm:flex">
        <IconButton label="Search the menu" onClick={() => open('search')}>🔍</IconButton>
        <IconButton label="Saved favourites" onClick={() => open('favorites')}>❤️</IconButton>
        <IconButton label="My orders" onClick={() => open('orders')}>📦</IconButton>
      </div>
      <CartButton />
      <Button
        variant="outline"
        size="sm"
        className={showMenu ? 'h-9' : 'h-9 sm:hidden'}
        onClick={() => open('menu')}
        aria-haspopup="dialog"
      >
        Menu
      </Button>
    </div>
  )
}
