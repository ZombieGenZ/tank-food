import { JSX } from "react";
import { Card } from 'antd';

const { Meta } = Card;

interface Product {
    category_name_translate_1: string;
    category_name_translate_2: string
    description_translate_1: string;
    description_translate_2: string;
    preview: string;
    price: number;
    tag_translate_1: string;
    tag_translate_2: string;
    title_translate_1: string;
    title_translate_2: string;
    language: string;
}

const CardProduct: React.FC<Product> = ({ category_name_translate_1, category_name_translate_2, description_translate_1, description_translate_2, preview, price, tag_translate_1, tag_translate_2, title_translate_1, title_translate_2, language }): JSX.Element => {
    return (
            <Card
                hoverable
                style={{
                    width: 350,
                    border: '2px solid #FF6B35', // Đổi màu viền
                    borderRadius: '10px', // Bo góc
                    backgroundColor: '#FFF5E1', // Màu nền
                }}
                cover={<img alt="Ảnh bị lỗi" src={preview}/>}
            >
                <Meta title={language == "Tiếng Việt" ? title_translate_1 : title_translate_2} description={language == "Tiếng Việt" ? description_translate_1 : description_translate_2} />
                <p>{language == "Tiếng Việt" ? "Giá Tiền: " : "Price:"} {price.toLocaleString("vi-VN")}</p>
                <p>{language == "Tiếng Việt" ? "Tên tag: " : "Tag:"} {language == "Tiếng Việt" ? tag_translate_1 : tag_translate_2}</p>
                <p>{language == "Tiếng Việt" ? "Loại: " : "Category:"} {language == "Tiếng Việt" ? category_name_translate_1 : category_name_translate_2}</p>
            </Card>
    )
}

export default CardProduct