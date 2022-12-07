import {
  MenuItemsType,
  SwapIcon,
  SwapFillIcon,
  DropdownMenuItems,
} from '@pancakeswap/uikit'
import { ContextApi } from '@pancakeswap/localization'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean; image?: string } & {
  items?: ConfigMenuDropDownItemsType[]
}

const addMenuItemSupported = (item, chainId) => {
  if (!chainId || !item.supportChainIds) {
    return item
  }
  if (item.supportChainIds?.includes(chainId)) {
    return item
  }
  return {
    ...item,
    disabled: true,
  }
}

const config: (
  t: ContextApi['t'],
  isDark: boolean,
  languageCode?: string,
  chainId?: number,
) => ConfigMenuItemsType[] = (t, isDark, languageCode, chainId) =>
  [
    {
      label: t('Home'),
      icon: SwapIcon,
      fillIcon: SwapFillIcon,
      href: '/',
      showItemsOnMobile: false,
      items: [
        
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
