import express, { request } from "express";
import cors from "cors";
import mongoose from "mongoose";
import fs from "fs";
import admin from "firebase-admin";
import { stringToHash } from "bcrypt-inzi";

//firebase.google.com/docs/storage/admin/start
  https: var serviceAccount = {
  type: "service_account",
  project_id: "productcrudapp",
  private_key_id: "3d8bfb1bc1b42217c4bff649e90cf2d8f55f4354",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCOHQnpfxU6HwIY\nH5DEjQwHZSxJm03DdgFTLD0Ns6wF7XOdpTv3UFuLc//LgToANg6zSgk44Ha3URxz\nXPrZA6/qVaA5nbgK6/LTiaQq5gZu60H9YsRaMqQutt/O5vvHn12cFhWog6V7EFIB\nNG+64b3kwEO/1aghgRYfGV103tzyjncnxJTUkCePcetvK9qjpWsY+tybRuNX0WkO\nzdxrCakdL80HwL73mj73c0AC9CH5zDq6mzrV+DlN8TN6m/CJegky1z8RLsXg0te0\nKw+/JElKAjpur+2HjRzKxtj2K2v23ewRkZ9QtDV5xwJBg2dMR/ycljCl6WLn+E+Z\nC1Ghotf/AgMBAAECggEAA46th1dDiENrcYAkxw7CzNKXA7asAScMjHDwjE3Bkhpq\nCPmwYRX1XK3IKudutL+lqY5CYdaYkikpHagnrVP+zM5c5uRQTZGvb+Ujo2FDqvYf\nnkChKqLW4kZ4nrzAc7RFCxmwbBnzg/uaGeaen150OuwnJf+qqEALdjbT1I+Zl0a5\nHTpKYm1IXzQkGW9B3aXylnGmR6cKWoIlmceGXG6DFDDzXgQqJCxsNQLftkT0Nq+V\nYw4ucP0oqJrkzOKsk5IZwWOeAkzC21v/Jux+nZ0w3FgyDFAIQsN/oPf0u4xAIuRH\nHWmyaZ27gh7fQK9aRso8Golyiz1zqzDTJf5Zwxk0FQKBgQDGsqc1KeejOX1zoi4E\nsKszlHJggGeJefwqt70NvMb+TkTxDJs/wNQ/92bnBwagQkdf93ObErucZWNlAZnt\n3CrPwAOQvO9POsfpBj4dnl7uLYAw67bULV4RmZMpUAPO8pU3IsnGt/L6sZ/0PHAn\nhQwGRfi+LiBNZ4YBiuOQcsgU1QKBgQC3GOdw4FA5WxpDRzN4VXlcXMgKTCJfofzc\n+fZVv64HKHxJ7GUQDbjoEjcmAuyStFoB6MCNtljVv1k7ghAPl0de+uweYsviTeW2\nb4+LMjNgBXtYAOSRJwlz1C7RMv4TR8n+PxkE8a5ACE7KDRhnoHQ8INkLrgN1/xUD\nGgPmuJLzgwKBgA+xXHNec+T4TWgsjuXf7iWMu9vTSFobQEc/a7cCCdVb6SYAkOJg\nIGNM7tugOm29zlVN/dtph1e6yjbYAYg/s0HlMGLmCSCAy/kjfRRpxaWaAl3av/3R\n93P8ZRsGLsbRceeA397J+G7ESJXJkDIO1/xG2nZqvjJe0r6ccYyfBB5hAoGALUu+\n7eDAWAAetigmJo3WsS/O2SVOl6QGX1CDTWFXFzQ/0zXlJpyOcvMWq5OrnPt7DN/c\nyvIidfaZh6w8du7w3CFtSnMch0bIHmLo+wGXThjtE69c3D/xCbOjRWO9EV4ALaLE\neMGlXvfvLfMhZ3l9Z+aka0xIVOee9h54epqM2CsCgYBmIQT5hGBZ+eVIBVi/vsO5\nU22Zy/uCEyuO6NuBJy0KEJxURSUj4/lQOvRdL9k5CLvrtuwqQfX8yovjmd5NtfWY\n7YHef9QEVYimYzMdKyQgcPGNhQRC+UjkpsWTb+tIqdQW/64fwH+RibbvnlWeB87Z\nqLLfU8CkrhWuci73R9n30A==\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-gd5op@productcrudapp.iam.gserviceaccount.com",
  client_id: "115516108563404963842",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-gd5op%40productcrudapp.iam.gserviceaccount.com",
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://productcrudapp.firebaseio.com",
});
const bucket = admin.storage().bucket("gs://productcrudapp.appspot.com");

//==============================================
import multer from "multer";
const storageConfig = multer.diskStorage({
  // https://www.npmjs.com/package/multer#diskstorage
  destination: "./uploads/",
  filename: function (req, file, cb) {
    console.log("mul-file: ", file);
    cb(null, `${new Date().getTime()}-${file.originalname}`);
  },
});
var upload = multer({ storage: storageConfig });

//==============================================

const app = express();
const port = process.env.PORT || 5001;
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "*",
    ],
    credentials: true,
  })
);

let productSchema = new mongoose.Schema({
  dessertName: { type: String },
  flavor: { type: String },
  price: { type: Number },
  dessertImage: { type: String, required: true },
});

let productModel = mongoose.model("product", productSchema);

app.post("/product", upload.any(), async (req, res) => {
  console.log("product received", req.body);

  console.log("files", req.files[0]);

  bucket.upload(
    req.files[0].path,
    {
      destination: `dessertPhotos/${req.files[0].filename}`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
    },
    function (err, file, apiResponse) {
      if (!err) {
        // console.log("api resp: ", apiResponse);

        // https://googleapis.dev/nodejs/storage/latest/Bucket.html#getSignedUrl
        file
          .getSignedUrl({
            action: "read",
            expires: "03-09-2491",
          })
          .then(async (urlData, err) => {
            if (!err) {
              console.log("public downloadable url: ", urlData[0]); // this is public downloadable url

              // delete file from folder before sending response back to client (optional but recommended)
              // optional because it is gonna delete automatically sooner or later
              // recommended because you may run out of space if you dont do so, and if your files are sensitive it is simply not safe in server folder
              try {
                fs.unlinkSync(req.files[0].path);
                //file removed
              } catch (err) {
                console.error(err);
              }

              let newProduct = new productModel({
                dessertName: req.body.dessertName,
                flavor: req.body.flavor,
                price: req.body.price,
                dessertImage: urlData[0],
              });
              try {
                let response = await newProduct.save();
                console.log("dessert added", response);
                prompt("dessert added", response);

                console.log(urlData[0]);
                res.send({
                 
                  message: "dessert added",
                  data: {
                    dessertName: req.body.dessertName,
                    flavor: req.body.flavor,
                    price: req.body.price,
                    dessertImage: urlData[0],
                  },
        
                });
              } catch (error) {
                console.log("failed to add dessert", error);
                prompt("failed to add dessert", error);
                res.status(500).send({
                  message: "failed to add dessert",
                });
              }
            }
          });
      } else {
        console.log("err: ", err);
        res.status(500).send();
      }
    }
  );
});

app.get("/products", async (req, res) => {
  try {
 let products= await productModel.find({}).exec()
 console.log("all products", products)
 res.send({
  message:"all desserts",
  data: products
 })
 }
 catch{
  res.send({
    message:"error in getting all desserts"
  })
 }
})

app.delete("/product/:id",async(req,res) => {
  try {
  let deleted = await productModel.deleteOne({_id: req.params.id}).exec()
  prompt("product deleted")
  res.send({
    message: "product deleted",
    data: deleted
  })
}
catch {
  res.send({
    message:"error in deleting the product"
  })
}

})

app.put("/product/:id",async (req,res) => {
  console.log("dessert to be edit",req.body)
  let update = {}
  if (req.body.dessertName) update.dessertName = req.body.dessertName
  if (req.body.flavor) update.flavor = req.body.flavor
  if (req.body.price) update.price = req.body.price
  try{
    let edit = await productModel.findOneAndUpdate({_id:req.params.id},update,{new:true}).exec()
    console.log("updated product",edit)
    prompt("updated product",edit)
    res.send({
      message:"dessert updated successfully",
      data: edit
    })
  }
  catch{
    res.send({
      message:"error in updating dessert"
    })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const dbURI =
  process.env.MONGODBURI ||
  "mongodb+srv://abc:abc@cluster0.iunhwh0.mongodb.net/dessertShop?retryWrites=true&w=majority";
mongoose.connect(dbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on("connected", function () {
  //connected
  console.log("Mongoose is connected");
});

mongoose.connection.on("disconnected", function () {
  //disconnected
  console.log("Mongoose is disconnected");
  process.exit(1);
});

mongoose.connection.on("error", function (err) {
  //any error
  console.log("Mongoose connection error: ", err);
  process.exit(1);
});

process.on("SIGINT", function () {
  /////this function will run jst before app is closing
  console.log("app is terminating");
  mongoose.connection.close(function () {
    console.log("Mongoose default connection closed");
    process.exit(0);
  });
});