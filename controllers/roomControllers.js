import Room from '../models/room';
import Booking from '../models/booking';

import ErrorHandler from "../utils/errorHandler";
import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import ApiFeatures from "../utils/apiFeatures";
import cloudinary from 'cloudinary';

// Get all room => /api/rooms
const allRooms = catchAsyncErrors(async (req, res) => {

    const resPerPage = 4;
    const roomsCount = await Room.countDocuments();

    const apiFeatures = new ApiFeatures(Room.find(), req.query)
        .search()
        .filter();

    let rooms = await apiFeatures.query;
    let filteredRoomsCount = rooms.length;

    apiFeatures.pagination(resPerPage);
    rooms = await apiFeatures.query;

    // try{
    //     const rooms = await Room.find();

        res.status(200).json({
            success: true,
            roomsCount,
            resPerPage,
            filteredRoomsCount,
            rooms
        });
    // }catch (error){
    //     res.status(400).json({
    //         success: false,
    //         error: error.message
    //     });
    // }
})

// Create new room => /api/rooms
const newRoom = catchAsyncErrors(async (req, res) => {

    const images = req.body.images;

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++){

        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'bookit/rooms'
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        });
    }

    req.body.images = imagesLinks;
    req.body.user = req.user._id;

    // try{
        const room = await Room.create(req.body);

        res.status(200).json({
            success: true,
            room
        });
    // }catch (error){
    //     res.status(400).json({
    //         success: false,
    //         error: error.message
    //     });
    // }
});

// Get room details => /api/rooms/:id
const getSingleRoom = catchAsyncErrors(async (req, res, next) => {

    // try{
        const room = await Room.findById(req.query.id);

        if (!room){
            // return res.status(404).json({
            //     success: false,
            //     error: 'Room not found with this ID'
            // });

            return next(new ErrorHandler('Room not found with this ID', 404));
        }

        res.status(200).json({
            success: true,
            room
        });
    // }catch (error){
    //     res.status(400).json({
    //         success: false,
    //         error: error.message
    //     });
    // }
});


// Update room details => /api/rooms/:id
const updateRoom = catchAsyncErrors(async (req, res, next) => {

    // try{
        let room = await Room.findById(req.query.id);

        if (!room){
            // return res.status(404).json({
            //     success: false,
            //     error: 'Room not found with this ID'
            // });

            return next(new ErrorHandler('Room not found with this ID', 404));
        }

        if (req.body.images){

            // Delete images associated with the room
            for(let i = 0; i < req.body.images.length; i++){
                await cloudinary.v2.uploader.destroy(room.images[i].public_id);
            }

            let imagesLinks = [];

            const images = req.body.images;

            for (let i = 0; i < images.length; i++){

                const result = await cloudinary.v2.uploader.upload(images[i], {
                    folder: 'bookit/rooms'
                });

                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url
                });
            }

            req.body.images = imagesLinks;

        }

        room = await Room.findByIdAndUpdate(req.query.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(200).json({
            success: true,
            room
        });
    // }catch (error){
    //     res.status(400).json({
    //         success: false,
    //         error: error.message
    //     });
    // }
});

// Delete room => /api/rooms/:id
const deleteRoom = catchAsyncErrors(async (req, res, next) => {

    // try{
        const room = await Room.findById(req.query.id);

        if (!room){
            // return res.status(404).json({
            //     success: false,
            //     error: 'Room not found with this ID'
            // });

            return next(new ErrorHandler('Room not found with this ID', 404));
        }

        await room.remove();

        res.status(200).json({
            success: true,
            message: 'Room is deleted.'
        });
    // }catch (error){
    //     res.status(400).json({
    //         success: false,
    //         error: error.message
    //     });
    // }
});

// Create a new review => /api/reviews
const createRoomReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, roomId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    };

    const room = await Room.findById(roomId);

    const isReviewed = room.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    );

    if (isReviewed){

        room.reviews.forEach((review) => {
            if (review.user.toString() === req.user._id.toString()){
                review.comment = comment;
                review.rating = rating;
            }
        });

    }else{
        room.reviews.push(review);
        room.numOfReviews = room.reviews.length;
    }

    room.ratings = room.reviews.reduce((acc, item) => item.rating + acc, 0) / room.reviews.length;

    await room.save({
        validateBeforeSave: false,
    });

    res.status(200).json({
        success: true
    });

});

// Check review availability => /api/reviews/check_review_availability
const checkReviewAvailability = catchAsyncErrors(async (req, res, next) => {

    const { roomId } = req.query;

    const bookings = await Booking.find({ user: req.user._id, room: roomId});

    let isReviewAvailable = false;

    if (bookings.length > 0) isReviewAvailable = true;

    res.status(200).json({
        success: true,
        isReviewAvailable
    });

});

// Get all rooms - ADMIN => /api/admin/rooms
const allAdminRooms = catchAsyncErrors(async (req, res, next) => {

    const rooms = await Room.find()

    res.status(200).json({
        success: true,
        rooms
    });

});

export {
    allRooms,
    newRoom,
    getSingleRoom,
    updateRoom,
    deleteRoom,
    createRoomReview,
    checkReviewAvailability,
    allAdminRooms
};