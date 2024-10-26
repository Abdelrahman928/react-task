import React, {useState, useEffect} from "react";
import axios from 'axios';
import Button from "../components/Button";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

function HomePage(){
    const [products, setProducts] =useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProductIds, setSelectedProductIds] = useState([]);
    const navigate = useNavigate();
  
    const handleCheckboxChange = (id) => {
      if (selectedProductIds.includes(id)) {
        setSelectedProductIds(selectedProductIds.filter(productId => productId !== id));
      } else {
        setSelectedProductIds([...selectedProductIds, id]);
      }
    };
  
    const sendDeleteRequest = () => {
      axios.delete('https://task-api.ignorelist.com/products', { data: { ids: selectedProductIds } })
      .then(response => {
        console.log('Response:', response.data);
        reloadPage();
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  
    const reloadPage = () => {
      window.location.reload();
    }
  
    const redirect = () => {
      navigate('/add-product')
    }
  
    useEffect(() => {
      axios.get('https://task-api.ignorelist.com/')
        .then(response => {
          if (response.status === 200) {
            if (Array.isArray(response.data.products) && response.data.products.length > 0) {
                setProducts(response.data.products);
            } else if (response.data.message) {
                setError(response.data.message); 
            } else {
                setProducts([]); 
            }
          } else {
              setError("Unexpected error occurred.");
          }
        setLoading(false);
        })
        .catch(error => {
          setError(error.message);
          setLoading(false);
        });
    }, []);
  
    const getAttributeUnit = (type) => {
      switch(type) {
        case 'dvd':
          return 'MB';
        case 'book':
          return 'kg';
        case 'furniture':
          return 'cm'
      }
    };
  
    const formatFurnitureDimensions = (attributes) => {
      const { height, width, length } = attributes;
      return `${height} x ${width} x ${length}`;
    };
  
    return (
      <>
      <div className= "flex justify-between">
        <Header className="m-4 text-4xl" text='Product List'/>
        <div>
          <Button onClick={redirect} className= "bg-white border-2 border-blue-700 text-center font-bold text-blue-700 my-4 mx-2 rounded-md p-2 shadow-sm shadow-black hover:bg-blue-700 hover:text-white active:scale-95" text='ADD'/>
          <Button id="delete-product-btn" onClick={sendDeleteRequest} className= {`border-2 text-center font-bold my-4 mx-2 p-2 rounded-md shadow-sm shadow-black ${selectedProductIds.length > 0 ? "bg-white border-red-600 text-red-700 hover:bg-red-600 hover:text-white active:scale-95" : "bg-white text-gray-400 border-gray-400 cursor-not-allowed"}`} text='MASS DELETE'/>
        </div>
      </div>
      <hr className="border-t-2 border-black"/>
      <main className="flex-1 m-5">
      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-700">{error}</p>}
      <div className="grid grid-cols-6 gap-4 p-2">
        {products.map(product =>(
          <div key= {product.id} className= "basis-1/6 relative flex flex-col items-center justify-center p-8 border-2 border-blue-700 rounded-lg shadow-lg">
            <input type="checkbox" onClick= {() => handleCheckboxChange(product.id)} id={`product-${product.id}`} className="appearance-none bg-white border-2 rounded-full border-white outline-red-600 checked:bg-blue-700 w-5 h-5 absolute top-2 left-2 cursor-pointer"/>
            <p>{product.sku}</p>
            <p>{product.name}</p>
            <p>{product.price}$</p>
            {product.specificAttributes && Object.entries(product.specificAttributes).map(([key, value]) => {
                if (product.type !== 'furniture' || (key !== 'height' && key !== 'width' && key !== 'length')) {
                  return (
                    <p key={`${product.id}-${key}`}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}: {value} {getAttributeUnit(product.type)}
                    </p>
                  )
                }
                return null;
              })
            }
            {product.type === 'furniture' && product.specificAttributes && 
              <p key= {`${product.id}-${product.type}`}>
                ({formatFurnitureDimensions(product.specificAttributes)}) {getAttributeUnit(product.type)}
              </p>
            }
          </div>
          )
        )}
      </div>
      </main>
      <hr className="border-t-2 border-black"/>
      <Footer/>
      </>
    );
}

export default HomePage;