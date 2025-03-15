import { JSX, useState, useEffect } from "react";

interface CategoryItem {
    category_name_translate_1: string;
    category_name_translate_2: string;
    created_at: string;
    index: number;
    translate_1_language: string;
    translate_2_language: string;
    updated_at: string;
    id: string;
  }

const Category = (): JSX.Element => {
    const [product, setProduct] = useState([])
    const [category, setCategory] = useState<CategoryItem[]>([])

    useEffect(() => {
        const body = {
            language: null,
        }
        fetch('http://localhost:3000/api/products/get-product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(body)
        }).then((response) => {
            return response.json()
        }).then(data => {
            setProduct(data)
        })

        fetch('http://localhost:3000/api/categories/get-category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(body)
        }).then((response) => {
            return response.json()
        }).then(data => {
            setCategory(data.categories)
        })
    }, [])
    return(
        <div>
            {product ? <div>Có hàng</div> : <div>không có hàng</div>}
            <ul>
                {category.map((item, index) => {
                    return <li key={index}>{item.category_name_translate_1}</li>
                })}
            </ul>
            {category ? <div>Có danh mục</div> : <div>không có danh mục</div>}
        </div>
    )
}

export default Category