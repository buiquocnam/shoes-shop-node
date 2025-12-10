// import { Request, Response, NextFunction } from 'express';
// // import sizeService from '../services/sizeService';
// // import { SizeDTO } from '../types/product.types';

// // export const createSize = async (
// //     req: Request,
// //     res: Response,
// //     next: NextFunction
// // ) => {
// //     try {
// //         const sizeData: SizeDTO = req.body;
// //         const result = await sizeService.createSize(sizeData);
// //         res.status(201).json(result);
// //     } catch (err) {
// //         next(err);
// //     }
// // };

// export const getSizes = async ( 
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         const result = await sizeService.getSizes();
//         res.json(result);
//     } catch (err) {
//         next(err);
//     }
// };

// export const getSizeById = async (
//     req: Request,
//     res: Response,  
//     next: NextFunction
// ) => {
//     try {
//         const sizeId = req.params.id;
//         const result = await sizeService.getSizeById(sizeId);
//         res.json(result);
//     } catch (err) {
//         next(err);
//     }
// };

// export const deleteSize = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         const sizeId = req.params.id;
//         const result = await sizeService.deleteSize(sizeId);
//         res.json(result);
//     }
//     catch (err) {
//         next(err);
//     }
// };


