export interface CartLine {
  readonly productId: string;
  readonly slug: string;
  readonly title: string;
  readonly priceMXN: number;
  readonly quantity: number;
}

export type CartState = Readonly<{
  lines: ReadonlyArray<CartLine>;
  count: number;
  subtotalMXN: number;
}>;

export type CartAction =
  | { readonly type: 'ADD_ITEM'; readonly line: Omit<CartLine, 'quantity'> }
  | { readonly type: 'REMOVE_ITEM'; readonly productId: string }
  | { readonly type: 'CLEAR' };

export interface CartContextValue {
  readonly state: CartState;
  readonly addItem: (line: Omit<CartLine, 'quantity'>) => void;
  readonly removeItem: (productId: string) => void;
  readonly clear: () => void;
}
