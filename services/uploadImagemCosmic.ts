import multer from "multer";
import { createBucketClient } from "@cosmicjs/sdk";

const {
    BUCKET_SLUG,
    READ_KEY,
    WRITE_KEY 
} = process.env;

const bucketDevagram = createBucketClient({
  bucketSlug: BUCKET_SLUG as string,
  readKey: READ_KEY as string,
  writeKey: WRITE_KEY as string,
});

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const uploadImagemCosmic = async(req: any) =>{
    if(req?.file?.originalname){
        const media_object = {
            originalname: req.file.originalname,
            buffer : req.file.buffer
        };

        if (req.url && req.url.includes("publicacao")) {
            return await bucketDevagram.media.insertOne({
              media: media_object,
              folder: "publicacao",
            });
          } else {
            return await bucketDevagram.media.insertOne({
              media: media_object,
              folder: "avatar",
            });
          }
    }
};

export {upload, uploadImagemCosmic};