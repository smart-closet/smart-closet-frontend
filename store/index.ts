import { Item } from "@/hooks/useItems"; 
import { MyImage } from "@/hooks/useMyImages";
import { legacy_createStore as createStore } from "redux";

export type Outfit = {
    id: number;
    name: string;
    items: Item[];
};

export type RootState = {
    items: Item[];
    myImages: MyImage[];
    outfits: Outfit[];
}

type Actions =
  | { type: 'SET_ITEMS'; payload: Item[] }
  | { type: 'ADD_ITEM'; payload: Item[] }
  | { type: 'UPDATE_ITEM'; payload: Item }
  | { type: 'DELETE_ITEM'; payload: number }
  | { type: "SET_MY_IMAGES"; payload: MyImage[] }
  | { type: "ADD_MY_IMAGE"; payload: MyImage }
  | { type: 'SET_OUTFITS'; payload: Outfit[] } // 新增 SET_OUTFITS
  | { type: 'ADD_OUTFIT'; payload: Outfit }; // 新增 ADD_OUTFIT

const initialState: RootState = {
  items: [],
  myImages: [],
  outfits: [],
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
    case 'SET_MY_IMAGES':
      return { ...state, myImages: action.payload };
    case 'ADD_MY_IMAGE':
      return { ...state, myImages: [...state.myImages, action.payload] };
    case 'SET_OUTFITS':
      return { ...state, outfits: action.payload };
    case 'ADD_OUTFIT':
      return { ...state, outfits: [...state.outfits, action.payload] };

    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;