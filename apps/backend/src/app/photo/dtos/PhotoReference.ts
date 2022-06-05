import { Types } from 'mongoose';
import { Photo } from '../photo';
/**
 * Basic photoRef to be sent to the frontend
 */
export class PhotoReference implements Pick<Photo, "_id" | "ownerId" | "gridFsId" | "size" | "contentType" | "private">{
	_id: Types.ObjectId;
	ownerId: Types.ObjectId;
	gridFsId: Types.ObjectId;
	size: number;
	contentType: string;
	private: boolean; 

	fullSizeUri: string;
	thumbUri: string;
	previewUri: string;
	
	static fromPhoto(photo: Photo): PhotoReference {
		const photoRef = new PhotoReference();
		photoRef._id = photo._id;
		photoRef.ownerId = photo.ownerId;
		photoRef.gridFsId = photo.gridFsId;
		photoRef.size = photo.size;
		photoRef.contentType = photo.contentType;
		photoRef.private = photo.private;

		photoRef.fullSizeUri = `/photo/full/${photo._id}`;
		photoRef.thumbUri = `/photo/thumb/${photo._id}`;
		photoRef.previewUri = `/photo/preview/${photo._id}`;
		return photoRef;
	}
}