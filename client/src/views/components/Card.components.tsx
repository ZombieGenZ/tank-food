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
}

const CardProduct: React.FC<Product> = ({ category_name_translate_1, category_name_translate_2, description_translate_1, description_translate_2, preview, price, tag_translate_1, tag_translate_2, title_translate_1, title_translate_2 }): JSX.Element => {
    return (
        <div>
            <Card
                hoverable
                style={{ width: 240 }}
                cover={<img alt="example" src={preview}/>}
            >
                <Meta title={title_translate_1} description={description_translate_1} />
            </Card>
        </div>
    )
}

export default CardProduct