import { Item } from "@/hooks/useItems"; 
import { legacy_createStore as createStore } from "redux";

export type RootState = {
    items: Item[];
}

type Actions =
  | { type: 'SET_ITEMS'; payload: Item[] }
  | { type: 'ADD_ITEM'; payload: Item[] }
  | { type: 'UPDATE_ITEM'; payload: Item }
  | { type: 'DELETE_ITEM'; payload: number };

const initialState: RootState = {
  items: [],
};

const reducer = (state = initialState, action: Actions) => {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, ...action.payload] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(image =>
          image.id === action.payload.id ? action.payload : image
        ),
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter(image => image.id !== action.payload),
      };
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;