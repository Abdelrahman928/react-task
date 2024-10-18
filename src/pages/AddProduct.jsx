import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";

function AddProduct(){
    const navigate = useNavigate();
    const [productType, setProductType] = useState('');
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        sku: "",
        name: "",
        price: "",
        productType: "",
        size: "",
        weight: "",
        height: "",
        width: "",
        length: ""
    });
    
    const validate = (e) => {
        const validKeys = ['Backspace', 'Tab', '.', 'ArrowLeft', 'ArrowRight', 'Delete'];
    
        if (!validKeys.includes(e.key) && (e.key < '0' || e.key > '9')) {
          e.preventDefault();
        }
    }

    const handleChange = (e) => {
        const { id, value } = e.target;
        
        setErrors((prevErrors) => ({
            ...prevErrors,
            [id]: []
        }));

        setFormData({
            ...formData,
            [id]: value,
        });
    }

    const handleProductTypeChange = (e) => {
        const selectedType = e.target.value;
        
        setProductType(selectedType);
    
        setFormData({
          ...formData,
          productType: selectedType,
        });

        const updatedErrors = {...errors};

        updatedErrors.specificAttributes = [];
        updatedErrors.type = [];

        setErrors(updatedErrors);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const specificAttributes = (() => {
            switch (formData.productType) {
                case "dvd":
                    return { size: formData.size };
                case "book":
                    return { weight: formData.weight };
                case "furniture":
                    return {
                        height: formData.height,
                        width: formData.width,
                        length: formData.length,
                    };
            }
        })();

        const productAttributes = {
            sku: formData.sku,
            name: formData.name,
            price: parseFloat(formData.price),
            type: formData.productType,
            ...specificAttributes
        };

        axios.post('https://task-api.ignorelist.com/add-product', productAttributes)
        .then(response => {
            console.log('Response:', response.data);
            navigate('/');
            setErrors({});
          })
          .catch(error => {
            if (error.response && error.response.data.message) {
                setErrors(error.response.data.message);
            } else {
                console.error('Error:', error);
                setErrors({});
            }
          });
    }

    const redirect = () => {
        navigate('/')
    }

    return(
        <>
        <div className= "flex justify-between">
            <Header className="m-4 text-4xl" text='Product Add'/>
            <div>
            <Button onClick={handleSubmit} className= "bg-white border-2 border-blue-700 text-center font-bold text-blue-700 my-4 mx-2 rounded-md p-2 shadow-sm shadow-black hover:bg-blue-700 hover:text-white active:scale-95" text='Save'/>
            <Button id="delete-product-btn" onClick={redirect} className= "bg-white border-2 border-red-700 text-center text-red-700 font-bold my-4 mx-2 p-2 rounded-md  shadow-sm shadow-black hover:bg-red-700 hover:text-white active:scale-95" text='Cancel'/>
            </div>
        </div>
        <hr className="border-t-2 border-black"/>
        <main className="flex-1 flex flex-col m-5">
            <form id= "product_form" onSubmit={handleSubmit} className= "bg-white flex-grow flex flex-col p-4">
                <div>
                    <label htmlFor= "sku">SKU</label>
                    <input type= "text" onChange={handleChange} id= "sku" className="mt-1 block p-2 border border-gray-300 rounded-md shadow-sm" required></input>
                    {errors.sku && <p className="text-red-700 font-bold text-sm">{errors.sku}</p>}
                </div>
                <div className="mt-4">
                    <label htmlFor="name">Name</label>
                    <input type="text" onChange={handleChange} id="name" className="block mt-1 p-2 border border-gray-300 rounded-md shadow-sm" required></input>
                    {errors.name && <p className="text-red-700 font-bold text-sm">{errors.name}</p>}
                </div>
                <div className= "mt-4">
                    <label htmlFor="price">Price (USD)</label>
                    <input type="number" onKeyDown={validate} onChange={handleChange} id="price" className="block mt-1 p-2 border border-gray-300 rounded-md shadow-sm" required></input>
                    {errors.price && <p className="text-red-700 font-bold text-sm">{errors.price}</p>}
                </div>
                <div className= "mt-4">
                    <label htmlFor="productType">Product type</label>
                    <select id="productType" value={productType} onChange={handleProductTypeChange} className="mt-1 block p-2 border border-gray-300 rounded-md shadow-sm" required>
                        <option value="" disabled>Select product type</option>
                        <option value="dvd">DVD</option>
                        <option value="book">Book</option>
                        <option value="furniture">Furniture</option>
                    </select>
                    {errors.type && <p className="text-red-700 font-bold text-sm">{errors.type}</p>}
                </div>
                
                {productType === 'dvd' && (
                    <>
                    <p className="font-bold mt-4">please provide DVD size</p>
                    <div className="mt-4">
                        <label htmlFor="size">Size (MB)</label>
                        <input type="number" onKeyDown={validate} onChange={handleChange} id="size" className="block mt-1 p-2 border border-gray-300 rounded-md shadow-sm" required></input>
                        {errors.specificAttributes && <p className="text-red-700 font-bold text-sm">{errors.specificAttributes}</p>}
                    </div>
                    </>
                )}
                {productType === 'book' && (
                    <>
                    <p className="font-bold mt-4">please provide book weight</p>
                    <div className="mt-4">
                        <label htmlFor="weight">Weight (kg)</label>
                        <input type="number" onKeyDown={validate} onChange={handleChange} id="weight" className="block mt-1 p-2 border border-gray-300 rounded-md shadow-sm" required></input>
                        {errors.specificAttributes && <p className="text-red-700 font-bold text-sm">{errors.specificAttributes}</p>}
                    </div>
                    </>
                )}
                {productType === 'furniture' && (
                    <>
                    <p className="font-bold mt-4">please provide dimentions</p>
                    <div className="mt-4">
                        <label htmlFor="height">Height (cm)</label>
                        <input type="number" onKeyDown={validate} onChange={handleChange} id="height" className="block mt-1 p-2 border border-gray-300 rounded-md shadow-sm" required></input>
                        {errors.specificAttributes && <p className="text-red-700 font-bold text-sm">{errors.specificAttributes}</p>}
                    </div>
                    <div className="mt-4">
                        <label htmlFor="width">Width (cm)</label>
                        <input type="number" onKeyDown={validate} onChange={handleChange} id="width" className="block mt-1 p-2 border border-gray-300 rounded-md shadow-sm" required></input>
                        {errors.specificAttributes && <p className="text-red-700 font-bold text-sm">{errors.specificAttributes}</p>}
                    </div>
                    <div className="mt-4">
                        <label htmlFor="length">Length (cm)</label>
                        <input type="number" onKeyDown={validate} onChange={handleChange} id="length" className="block mt-1 p-2 border border-gray-300 rounded-md shadow-sm" required></input>
                        {errors.specificAttributes && <p className="text-red-700 font-bold text-sm">{errors.specificAttributes}</p>}
                    </div>
                    </>
                )}
            </form>
        </main>
        <hr className="border-t-2 border-black"/>
        <Footer/>
        </>
    );
}
export default AddProduct


