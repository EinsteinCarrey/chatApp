const initialState = [];


export default function loaderReducer(state = initialState, action){

    switch (action.type) {
        case "":
            return [];
        default:
            return state;
    }
}
