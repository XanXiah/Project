import { atom , selector } from "recoil"

export const moviesListState = atom({
    key: "movieListState",
    default:[] as any,
});

export const isLeftState = atom({
    key: "isLeft",
    default: true,
});

export const userUID = atom({
    key: "userUID",
    default: '',
});

export const userToken = atom({
    key: "userToken",
    default: '',
})

export const searchKeywordState = atom({
    key: "searchKeywordState",
    default: '',
});
// export { moviesListState , cinemalist} ;