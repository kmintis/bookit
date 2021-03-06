import {
    ALL_ROOMS_SUCCESS,
    ALL_ROOMS_FAIL,
    ROOM_DETAILS_SUCCESS,
    ROOM_DETAILS_FAIL,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_FAIL,
    NEW_REVIEW_RESET,
    REVIEW_AVAILABILITY_REQUEST,
    REVIEW_AVAILABILITY_SUCCESS,
    REVIEW_AVAILABILITY_FAIL,
    ADMIN_ROOMS_SUCCESS,
    ADMIN_ROOMS_FAIL,
    ADMIN_ROOMS_REQUEST,
    NEW_ROOM_REQUEST,
    NEW_ROOM_SUCCESS,
    NEW_ROOM_FAIL,
    NEW_ROOM_RESET,
    UPDATE_ROOM_SUCCESS,
    UPDATE_ROOM_FAIL,
    UPDATE_ROOM_RESET,
    UPDATE_ROOM_REQUEST,

    CLEAR_ERRORS
} from "../constants/roomConstants";

// All rooms reducer
export const allRoomsReducer = (state={rooms: []}, action) => {
    switch (action.type) {
        case ADMIN_ROOMS_REQUEST:
            return {
                loading: true
            };
        case ALL_ROOMS_SUCCESS:
            return {
                roomsCount: action.payload.roomsCount,
                resPerPage: action.payload.resPerPage,
                filteredRoomsCount: action.payload.filteredRoomsCount,
                rooms: action.payload.rooms
            };
        case ADMIN_ROOMS_SUCCESS:
            return {
                loading: false,
                rooms: action.payload
            };
        case ALL_ROOMS_FAIL:
        case ADMIN_ROOMS_FAIL:
            return {
                error: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state;
    }
};

// Room details reducer
export const roomDetailsReducer = (state={room: {}}, action) => {
    switch (action.type) {
        case ROOM_DETAILS_SUCCESS:
            return {
                room: action.payload
            };
        case ROOM_DETAILS_FAIL:
            return {
                error: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state;
    }
};

// New room reducer
export const newRoomReducer = (state={room: {}}, action) => {
    switch (action.type) {
        case NEW_ROOM_REQUEST:
            return {
                loading: true,
            };
        case NEW_ROOM_SUCCESS:
            return {
                loading: false,
                success: action.payload.success,
                room: action.payload.room
            };
        case NEW_ROOM_RESET:
            return {
                success: false
            };
        case NEW_ROOM_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state;
    }
};

// Room reducer
export const roomReducer = (state={}, action) => {
    switch (action.type) {
        case UPDATE_ROOM_REQUEST:
            return {
                loading: true,
            };
        case UPDATE_ROOM_SUCCESS:
            return {
                loading: false,
                isUpdated: action.payload
            };
        case UPDATE_ROOM_RESET:
            return {
                isUpdated: false
            };
        case UPDATE_ROOM_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state;
    }
};

// New review reducer
export const newReviewReducer = (state={}, action) => {
    switch (action.type) {
        case NEW_REVIEW_REQUEST:
            return {
                loading: true,
            };
        case NEW_REVIEW_SUCCESS:
            return {
                loading: false,
                success: action.payload
            };
        case NEW_REVIEW_RESET:
            return {
                success: false
            };
        case NEW_REVIEW_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state;
    }
};

// Check review reducer
export const checkReviewReducer = (state={reviewAvailable: null}, action) => {
    switch (action.type) {
        case REVIEW_AVAILABILITY_REQUEST:
            return {
                loading: true,
            };
        case REVIEW_AVAILABILITY_SUCCESS:
            return {
                loading: false,
                reviewAvailable: action.payload
            };
        case REVIEW_AVAILABILITY_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state;
    }
};