import { Request, Response } from "express";
import { tutorService } from "./tutor.service";

const createTutor = async (req: Request, res: Response) => {
    try {
        const result = await tutorService.createTutor(req.body);
        console.log(result);

        res.status(201).json({
            success: true,
            message: "tutor created successfully",
            data: result,
        });
    } catch (err) {
        res.json({
            success: false,
            message: "tutor creation failed",
            data: null,
        });
        console.log(err);
    }
};

export const tutorController = {
    createTutor,
};
