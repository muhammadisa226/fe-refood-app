import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProductById } from '@utils/services/productServices.js'
import { useCart } from '@context/CartContext.jsx'
import { addCart } from '@utils/services/customerServices.js'
import MainLayout from '@layouts/MainLayout'
import { useUser } from '@context/userContext.jsx'

const DetailProductPage = () => {
    const { refreshCart } = useCart()
    const { role } = useUser()
    const token = localStorage.getItem('access_token')
    const { id } = useParams()
    const [product, setProduct] = useState([])
    const [totalProduct, setTotalProduct] = useState(1)
    const [productNotFound, setProductNotFound] = useState(false)
    const decrease = () => {
        if (totalProduct === 1) {
            return
        }
        {
            setTotalProduct((prev) => prev - 1)
        }
    }
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProductById(id)
                setProduct(response)
            } catch (error) {
                if (error.status_code === 404) {
                    setProductNotFound(true)
                }
            }
        }
        fetchProduct()
    }, [id])

    const handleAddToCart = async () => {
        const data = {
            total_produk: totalProduct,
            total_harga: product.harga * totalProduct,
            product_id: product.id,
        }
        try {
            await addCart(data)
            refreshCart()
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <MainLayout>
            {productNotFound ? (
                <div className='flex items-center justify-center max-w-full min-h-screen'>
                    <div>
                        <h5 className='text-4xl text-center text-slate-400'>
                            Data Product Not Found
                        </h5>
                    </div>
                </div>
            ) : (
                <div className='flex flex-col mt-4 md:flex-row md:px-52 md:py-24'>
                    <div className='md:basis-1/2 md:flex md:flex-col md:justify-between'>
                        <div className='hidden md:block '>
                            <img
                                className='object-cover cursor-pointer rounded-xl w-[400px] h-[400px]'
                                src={product.image_url}
                                alt='product-image'
                            />
                        </div>
                        <div className='md:hidden'>
                            <img
                                className='w-[100%] h-[300px] object-cover mt-10 rounded-2xl mx-2 my-5'
                                src={product.image_url}
                                alt='product-image'
                            />
                        </div>
                    </div>
                    <div className='p-6 description md:basis-1/2 md:py-10'>
                        <p className='mb-6 text-base font-semibold tracking-widest uppercase text-primary'>
                            {product.Category?.nama}
                        </p>
                        <h1 className='text-3xl font-semibold capitalize md:text-4xl'>
                            {product.nama}
                        </h1>
                        <p className='hidden my-10 leading-7 text-black md:block'>
                            {product.deskripsi}
                        </p>
                        <p className='my-6 leading-7 text-black md:hidden'>
                            {product.deskripsi}
                        </p>

                        <div className='flex items-center price'>
                            <span className='text-3xl font-[700] mr-4'>
                                Rp. {product.harga}
                            </span>
                        </div>
                        {token && role === 'Customer' && (
                            <>
                                <div className='flex flex-col mt-8 md:flex-row'>
                                    <div className=' w-[100%] flex justify-around md:justify-center items-center space-x-10 rounded-lg p-3 md:p-2 md:mr-4 md:w-[150px]'>
                                        <button
                                            onClick={decrease}
                                            className='px-2 text-2xl font-semibold transition-all border md:text-xl text-primary hover:opacity-50'>
                                            -
                                        </button>
                                        <p className='md:text-[14px] font-bold'>
                                            {totalProduct}
                                        </p>
                                        <button
                                            onClick={() =>
                                                setTotalProduct(
                                                    (prev) => prev + 1
                                                )
                                            }
                                            className=' text-[24px] md:text-[20px] font-semibold text-primary border px-2 transition-all hover:opacity-50'>
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className='flex flex-wrap justify-between mt-4'>
                                    <div className='px-4 md:px-0'>
                                        <button
                                            onClick={handleAddToCart}
                                            className='px-12 py-3 mt-4 font-semibold text-white rounded-lg shadow-xl bg-primary md:mt-0 md:py-3 md:text-base hover:bg-secondary hover:text-primary'>
                                            Add to cart
                                        </button>
                                    </div>
                                    <div className='px-4'>
                                        <button
                                            onClick={handleAddToCart}
                                            className='px-12 py-3 mt-4 font-semibold border-none rounded-lg shadow-xl bg-secondary text-primary md:mt-0 md:py-3 md:text-base hover:bg-primary hover:text-white'>
                                            Order
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </MainLayout>
    )
}

export default DetailProductPage
