import type { AccentColor, MaskStyle } from './product';

export interface CartLine {
  readonly productId: string;
  readonly slug: string;
  readonly title: string;
  readonly priceMXN: number;
  readonly quantity: number;
  /** Estilo y paleta de la máscara; alimentan la miniatura `MaskArt` del carrito. */
  readonly maskStyle: MaskStyle;
  readonly accentColor: AccentColor;
}

export type CartState = Readonly<{
  lines: ReadonlyArray<CartLine>;
  count: number;
  subtotalMXN: number;
  /** `false` hasta que el carrito se leyó de `localStorage` en el cliente. */
  isHydrated: boolean;
}>;

export type CartAction =
  | { readonly type: 'HYDRATE'; readonly lines: ReadonlyArray<CartLine> }
  | { readonly type: 'ADD_ITEM'; readonly line: Omit<CartLine, 'quantity'> }
  | { readonly type: 'SET_QUANTITY'; readonly productId: string; readonly quantity: number }
  | { readonly type: 'REMOVE_ITEM'; readonly productId: string }
  | { readonly type: 'CLEAR' };

export interface CartContextValue {
  readonly state: CartState;
  readonly isDrawerOpen: boolean;
  readonly addItem: (line: Omit<CartLine, 'quantity'>) => void;
  readonly setQuantity: (productId: string, quantity: number) => void;
  readonly removeItem: (productId: string) => void;
  readonly clear: () => void;
  readonly openCart: () => void;
  readonly closeCart: () => void;
}
