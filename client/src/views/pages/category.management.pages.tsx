import { JSX, useState, useEffect } from "react";
import CardProduct from "../components/Card.components";

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

interface Product {
    _id: string;
    availability: boolean;
    categories: {
        _id: string;
        category_name_translate_1: string;
        category_name_translate_2: string;
        created_at: string;
        updated_at: string;
        index: number;
        translate_1_language: string;
        translate_2_language: string;
    };
    created_at: string;
    created_by: string;
    description_translate_1: string;
    description_translate_1_language: string;
    description_translate_2: string;
    description_translate_2_language: string;
    preview: {
        path: string;
        size: number;
        type: string;
        url: string;
    };
    price: number;
    tag_translate_1: string;
    tag_translate_1_language: string;
    tag_translate_2: string;
    tag_translate_2_language: string;
    title_translate_1: string;
    title_translate_1_language: string;
    title_translate_2: string;
    title_translate_2_language: string;
    updated_at: string;
    updated_by: string;
  }
  

const Category = (): JSX.Element => {
    const language = (): string => {
        const SaveedLanguage = localStorage.getItem('language')
        return SaveedLanguage ? JSON.parse(SaveedLanguage) : "Tiếng Việt"
    }
    const [product, setProduct] = useState<Product[]>([])
    const [category, setCategory] = useState<CategoryItem[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const body = { language: null };

            const productRes = await fetch("http://localhost:3000/api/products/get-product", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                 body: JSON.stringify(body),
            });
            const productData = await productRes.json();

            const categoryRes = await fetch("http://localhost:3000/api/categories/get-category", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const categoryData = await categoryRes.json();

            setProduct(productData.products || []); // Nếu dữ liệu null thì gán []
            setCategory(categoryData.categories || []);
        }

        fetchData()
    }, [])

    useEffect(() => {
        console.log("Product đã cập nhật:", product);
        console.log("Category đã cập nhật:", category);
    }, [product, category]); // Chạy lại khi state thay đổi
    
    
    return(
        <div className="flex">
            <div className="w-1/4 border-r">

            </div>
            <div className="w-3/4 grid grid-cols-3 place-items-center px-6 gap-5">
                {
                    product.map((item, index) => {
                        return <CardProduct key={index} 
                                            category_name_translate_1={item.categories.category_name_translate_1}
                                            category_name_translate_2={item.categories.category_name_translate_2}
                                            description_translate_1={item.description_translate_1}
                                            description_translate_2={item.description_translate_2}
                                            price={item.price}
                                            preview={item.preview.url}
                                            title_translate_1={item.title_translate_1}
                                            title_translate_2={item.title_translate_2}
                                            tag_translate_1={item.tag_translate_1}
                                            tag_translate_2={item.tag_translate_2}
                                            language={language()}/>
                    })
                }
            </div>
        </div>
    )
}

export default Category