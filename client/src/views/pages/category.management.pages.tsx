import { JSX, useState, useEffect } from "react";
import CardProduct from "../components/Card.components";
import { Anchor } from "antd";

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

  interface Section {
    key: string;   // Khóa định danh
    href: string;  // Đường dẫn liên kết
    title: string; // Tiêu đề hiển thị
  }
  

const Category = (): JSX.Element => {
    const language = (): string => {
        const SaveedLanguage = localStorage.getItem('language')
        return SaveedLanguage ? JSON.parse(SaveedLanguage) : "Tiếng Việt"
    }
    const [product, setProduct] = useState<Product[]>([])
    const [category, setCategory] = useState<CategoryItem[]>([])
    const [categoryView, setCategoryView] = useState<Section[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const body = { language: null };

            const productRes = await fetch(`${import.meta.env.VITE_API_URL}/api/products/get-product`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const productData = await productRes.json();

            const categoryRes = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/get-category`, {
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
        console.log("Category menu đã cập nhật:", categoryView);
    }, [product, category, categoryView]); // Chạy lại khi state thay đổi
    
    useEffect(() => {
        if (product.length > 0) {
            const newCategoryView = product.map((item, index) => ({
                key: `part-${index + 1}`,  // Dùng ID duy nhất thay vì index
                href: `part-${index + 1}`,
                title: language() === "Tiếng Việt"
                    ? item.categories?.category_name_translate_1
                    : item.categories?.category_name_translate_2,
            }));
    
            console.log("Số lượng danh mục sau khi map:", newCategoryView.length);
            setCategoryView(newCategoryView);
        }
    }, [product]);
    
    return(
        <div className="flex flex-col gap-5 justify-between items-center">
            <div className="flex gap-2 justify-center items-center">
                <Anchor
                    direction="horizontal"
                    items={categoryView}
                />
                </div>
            <div className="relative flex flex-col gap-5">
                <h1 className="mx-6 px-6 py-3 border-l-6 text-3xl border-[#FF6B35] font-bold">Ẩm thực chậm</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center px-6 gap-5">
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
        </div>
    )
}

export default Category