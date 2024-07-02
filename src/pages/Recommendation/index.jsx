import React, { useEffect, useState } from 'react'
import MainLayout from '@layouts/MainLayout'
import CardProduct from '@components/CardProduct'
import { getAllProducts } from '@utils/services/productServices.js'
import { useDebounce } from 'use-debounce'
const RecommendationPage = () => {
    const [products, setProducts] = useState([])
    const [size, setSize] = useState(8)
    const [totalPage, setTotalPage] = useState()
    const [totalProduct, setTotalProduct] = useState()
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [searchValue] = useDebounce(search, 1000)

    const fetchProduct = async () => {
        try {
            const response = await getAllProducts(page, size, searchValue)
            setProducts(response.products)
            setTotalProduct(response.total_product)
            setPage(response.paging.current_page)
            setTotalPage(response.paging.total_page)
        } catch (error) {
            console.error('Failed to fetch products:', error)
        }
    }
    useEffect(() => {
        fetchProduct()
    }, [page, size, searchValue])

    const handlePrev = () => {
        if (page > 1) {
            setPage(page - 1)
        }
    }
    const handleNext = () => {
        if (page < totalPage) {
            setPage(page + 1)
        }
    }

    return (
        <MainLayout>
            <div className='flex flex-col max-w-full min-h-screen mx-auto mt-10'>
                <div className='mx-auto mt-10 '>
                    <p className='text-3xl font-bold text-primary'>
                        Recommendation Menu
                    </p>
                </div>
                <div className='container py-10 mx-auto'>
                    <div className='flex flex-wrap mx-auto'>
                        <div className='flex flex-col w-1/4'>
                            <label
                                htmlFor='preferensi_rasa'
                                className='text-xl'>
                                Preferensi Rasa
                            </label>
                            <select
                                name='preferensi_rasa'
                                id='preferensi_rasa'
                                className='px-2 py-2 border rounded-lg '>
                                <option value=''>Manis</option>
                                <option value=''>Asam</option>
                                <option value=''>Asin</option>
                                <option value=''>Pedas</option>
                                <option value=''>Pahit</option>
                            </select>
                        </div>
                        <div className='flex flex-col w-1/4 mx-auto'>
                            <label
                                htmlFor='preferensi_rasa'
                                className='text-xl'>
                                Jenis Makanan
                            </label>
                            <select
                                name='preferensi_rasa'
                                id='preferensi_rasa'
                                className='px-2 py-2 border rounded-lg '>
                                <option value=''>Makanan Cepat Saji</option>
                                <option value=''>Makanan Rumahan</option>
                                <option value=''>Makanan Restoran</option>
                            </select>
                        </div>
                        <div className='flex flex-col w-1/4 mx-auto'>
                            <label
                                htmlFor='preferensi_rasa'
                                className='text-xl'>
                                Kebutuhan Diet
                            </label>
                            <select
                                name='preferensi_rasa'
                                id='preferensi_rasa'
                                className='px-2 py-2 border rounded-lg '>
                                <option value=''>Tidak Ada</option>
                                <option value=''>Vegan</option>
                                <option value=''>Vegetarian</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className='mx-10 mt-10 '>
                    <p className='text-xl font-bold text-primary'>
                        Hasil Rekomendasi :
                    </p>
                </div>
                {totalProduct === 0 ? (
                    <>
                        <div className='mx-10 my-10 md:grid-cols-4'>
                            <h5 className='text-4xl text-center text-slate-400'>
                                No Data Product
                            </h5>
                        </div>
                    </>
                ) : (
                    <>
                        <div className='grid grid-cols-2 my-10 mx-36 md:grid-cols-4'>
                            {products.map((product, index) => (
                                <CardProduct
                                    key={index}
                                    id={product.id}
                                    name={product.nama}
                                    productCategory={product.Category.nama}
                                    description={product.deskripsi}
                                    price={product.harga}
                                    imgSrc={product.image_url}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
            {totalPage > 1 && (
                <>
                    <div className='mb-20 space-x-5 text-center'>
                        <button
                            className='px-3 py-2 font-semibold text-white rounded-md bg-primary hover:bg-secondary disabled:bg-orange-700'
                            onClick={() => handlePrev()}
                            disabled={page === 1}>
                            Prev
                        </button>

                        <span>{page}</span>

                        <button
                            className={`bg-primary mb-2 text-white font-semibold px-3 py-2 hover:bg-secondary rounded-md  disabled:bg-orange-700`}
                            onClick={() => handleNext()}
                            disabled={page === totalPage || page > totalPage}>
                            Next
                        </button>
                    </div>
                </>
            )}
        </MainLayout>
    )
}

export default RecommendationPage
