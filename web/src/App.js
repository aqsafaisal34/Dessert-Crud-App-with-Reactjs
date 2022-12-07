import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
   const [dessertName,setDessertName]= useState ("");
   const [flavor,setFlavor]= useState ("");
   const [price,setPrice]= useState ("");
   const [editProduct, setEditProduct] = useState(null);
   const [products, setProducts] = useState([]);
   const [toggleRefresh, setToggleRefresh] = useState(true);
 
   useEffect(() => {
     let getAllProducts = async () => {
       let response = await axios.get(
         "https://dessert-crud-app-with-reactjs-production.up.railway.app/products"
       );
 
       setProducts(response.data.data);
     };
     getAllProducts();
   }, [toggleRefresh]);
 
   const producthandler = async (e) => {
     e.preventDefault();
 
     var dessertImage = document.getElementById("dessertImage");
     console.log("fileInput: ", dessertImage.files); // local url
 
     let formData = new FormData();
     // https://developer.mozilla.org/en-US/docs/Web/API/FormData/append#syntax
 
     formData.append("dessertName", dessertName); // this is how you add some text data along with file
     formData.append("flavor", flavor); // this is how you add some text data along with file
     formData.append("price", price); // this is how you add some text data along with file
     formData.append("dessertImage", dessertImage.files[0]); // file input is for browser only, use fs to read file in nodejs client
 
     axios({
       method: "post",
       url: "https://dessert-crud-app-with-reactjs-production.up.railway.app/product",
       data: formData,
       headers: { "Content-Type": "multipart/form-data" },
       withCredentials: true,
     })
       .then((res) => {
         console.log(`upload Success` + res.data);
         setToggleRefresh(!toggleRefresh);
       })
       .catch((err) => {
         console.log(err);
       });
   };

   let updateHandler = (e) => {
    e.preventDefault();
    axios.put(`https://dessert-crud-app-with-reactjs-production.up.railway.app/product/${editProduct?._id}`,
      {
        dessertName: editProduct.dessertName,
        price: editProduct.price,
        flavor: editProduct.flavor
      },
      {
        withCredentials: true
      })
      .then(function (response) {
        console.log("updated: ", response.data);

        setToggleRefresh(!toggleRefresh);
        setEditProduct(null);

      })


      .catch(function (e) {
        console.log("Error in api call: ", e);

      }


 ) }


 
   return (
     <div>
       <div className="form">
         <form onSubmit={producthandler}>
           <h1>Add your Favourite Dessert</h1>
           Dessert Name:{" "}
           <input
             name="dessertName"
             type="text"
             id="dessertName"
             onChange={(e) => {
               setDessertName(e.target.value);
             }}
           />
           <br />
           Flavor:{" "}
           <input
             name="flavor"
             type="text"
             id="flavor"
             onChange={(e) => {
               setFlavor(e.target.value);
             }}
           />
           <br />
           Price:{" "}
           <input
             name="price"
             type="Number"
             id="price"
             onChange={(e) => {
               setPrice(e.target.value);
             }}
           />
           <br />
           Dessert Image:{" "}
           <input
             type="file"
             id="dessertImage"
             accept="image/*"
             onChange={() => {
               ////// to display imager instantly on screen
               var dessertImage = document.getElementById("dessertImage");
               var url = URL.createObjectURL(dessertImage.files[0]);
               console.log("url: ", url);
               document.getElementById(
                 "img"
               ).innerHTML = `<img width="200px" src="${url}" alt="" id="img"> `;
             }}
           />
           <div id="img"></div>
           <br />
           <button type="submit">Add Dessert</button>
         </form>
       </div>
      
      {(editProduct !== null) ? (
        <div>
          <h1>updated form</h1>
          <form onSubmit={updateHandler}>
            dessertName : <input type="text" onChange={(e) => {
              setEditProduct({ ...editProduct, dessertName: e.target.value })
            }} value={editProduct?.dessertName} /> <br />

            Price : <input type="text" onChange={(e) => {
              setEditProduct({ ...editProduct, price: e.target.value })
            }} value={editProduct?.price} /> <br />

            Flavor: <input type="text" onChange={(e) => {
              setEditProduct({ ...editProduct, flavor: e.target.value })
            }} value={editProduct?.flavor} /> <br />

            <button>Submit</button>

          </form>

        </div>)
        : null}

     
 
       <h1>Desserts List: </h1>
 
       <div className="dessert-list">
         {products.map((eachProduct) => (
           <div key={eachProduct.id}>
             <div className="dessert">
               <img width="150px" src={eachProduct.dessertImage} alt="" />
               <h2 className="name">{eachProduct.dessertName}</h2>
               <p className="description">{eachProduct.flavor}</p>
               <p>
                 <span className="price">{eachProduct.price}</span>
                 <span>PKR</span>
               </p>
               <button onClick={() => {
              axios({
                url: `https://dessert-crud-app-with-reactjs-production.up.railway.app/product/${eachProduct._id}`,
                method: "delete",
                withCredentials: true
              })
                .then(function (response) {
                  console.log("deleted product", response.data)
                  setToggleRefresh(!toggleRefresh)
                })



                .catch(function (error) {
                  console.log("error in deleting product", error)
                })
            }}>Delete</button>
            <button onClick={()=>{
              setEditProduct({
                _id :eachProduct?._id,
                dessertName: eachProduct?.dessertName,
                flavor:eachProduct?.flavor,
                price:eachProduct?.price
              })
            }} >Edit</button>
             </div>
           </div>
         ))}
       </div>
     </div>
   );
 }
 
 export default App;