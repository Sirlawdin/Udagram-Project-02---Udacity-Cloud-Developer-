import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {
  
  // Init the Express application
  const app = express();
  
  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
  app.get("/filteredimage", async (req, res) => {
    const { image_url }: { image_url: string } = req.query;
    
    if (!image_url) {
      res.status(400).send({ message: "image_url cannot be empty" });
      return;
    }

 
    // validate the type of the image
    if (
      !image_url.toLowerCase().endsWith(".jpeg") &&
      !image_url.toLowerCase().endsWith(".jpg") &&
      !image_url.toLowerCase().endsWith(".png") &&
      !image_url.toLowerCase().endsWith(".bmp") &&
      !image_url.toLowerCase().endsWith(".tiff")
    ) {
      res.status(400).send({ message: "image not supported" });
      return;
    }

    const promiseImage: Promise<string> = filterImageFromURL(image_url);

    promiseImage
      .then((image) => {
        res.sendFile(image, () => {
          const imagesToBeDeleted: Array<string> = new Array(image);
          deleteLocalFiles(imagesToBeDeleted);
        });
      })
      .catch((error) => {
        res.status(404).send({ message: "image not found" });
        return;
      });
  });
  
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();