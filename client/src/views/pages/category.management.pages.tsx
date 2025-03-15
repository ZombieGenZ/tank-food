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
    const [product, setProduct] = useState<CategoryItem[]>([])
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

            setProduct(productData || []); // Nếu dữ liệu null thì gán []
            setCategory(categoryData.categories || []);
        }

        fetchData()
    }, [])

    useEffect(() => {
        console.log("Product đã cập nhật:", product);
        console.log("Category đã cập nhật:", category);
    }, [product, category]); // Chạy lại khi state thay đổi
    
    
    return(
        <div>
           <h1 className="text-3xl font-bold text-center mt-4">Danh Mục</h1>

        </div>
    )
}

export default Category