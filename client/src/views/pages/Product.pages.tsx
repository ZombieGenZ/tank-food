import { JSX, useEffect, useState } from "react";
import { Table, Input, Button, Modal } from 'antd';
import type { TableProps, GetProps } from 'antd';

interface DataType {
  key: string;
  title: string;
  category: string;
  description: string;
  price: string;
  tags?: string;
  note: string[];
}

interface Product {
  _id: string;
  availability: boolean;
  categories?: {
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

function ProductManagement(): JSX.Element {
  const [product, setProduct] = useState<Product[]>([]);
  const [data, setData] = useState<DataType[]>([]);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const language = (): string => {
    const Language = localStorage.getItem('language')
    return Language ? JSON.parse(Language) : "Tiếng Việt"
  }

  const showcreate = () => { 
    setShowCreateModal(true)
  }

  const CreateProduct = () => {

  }

  useEffect(() => {
      const body = {
        language: null,
      } 
      fetch(`${import.meta.env.VITE_API_URL}/api/products/get-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }).then((response) => {
        return response.json()
      }).then((data) => {
        console.log(data)
        setProduct(data.products)
      })
    }, [])

    useEffect(() => {
      const newData: DataType[] = product.map((product, index) => ({
        key: String(index + 1),
        title: language() == "Tiếng Việt" ? product.title_translate_1 : product.title_translate_2,
        category: product.categories == null ? "không có danh mục" : (language() == "Tiếng Việt" ? product.categories.category_name_translate_1 : product.categories.category_name_translate_2),
        description: language() == "Tiếng Việt" ? product.description_translate_1 : product.description_translate_2,
        price: product.price.toLocaleString('vi-VN') + " VNĐ", // Đảm bảo kiểu number
        tags: product.tag_translate_1 && product.tag_translate_1.trim() !== "" 
            ? (language() == "Tiếng Việt" ? product.tag_translate_1 : product.tag_translate_2)
            : "Không có tags",
        note: ["Chỉnh sửa", "Xoá"]
      }))

      setData(newData)
    }, [product])
      
    const columns: TableProps<DataType>['columns'] = [
        {
          title: 'Tên sản phẩm',
          dataIndex: 'title',
          key: 'title',
          width: 350,
          render: (text) => <p className="font-bold">{text}</p>,
        },
        {
          title: 'Danh mục',
          dataIndex: 'category',
          width: 350,
          key: 'category',
        },
        {
          title: 'Mô tả',
          dataIndex: 'description',
          width: 450,
          key: 'description',
        },
        {
          title: 'Giá tiền (VNĐ)',
          key: 'price',
          dataIndex: 'price',
          width: 350,
        },
        {
          title: 'Tags',
          key: 'tags',
          dataIndex: 'tags',
          width: 350,
        },
        {
          title: '',
          key: 'note',
          width: 350,
          render: (_text, record) => {
          return (
            <div className="flex gap-2">
              <Button style={{ background:"blue", color:"white" }}>{language() == "Tiếng Việt" ? "Chỉnh sửa" : "Edit"}</Button>
              <Button style={{ background:"red", color:"white" }}>{language() == "Tiếng Việt" ? "Xoá" : "Delete"}</Button>
            </div>
          )
      },
        },
      ];

    const App: React.FC = () => <Table<DataType> className="w-full" columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />;
    type SearchProps = GetProps<typeof Input.Search>;
    
    const { Search } = Input;
    
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);
    return(
        <div className="p-10">
            <div className="w-full flex justify-center flex-col gap-10 items-center">
                <div className="w-full flex justify-center flex-col items-cente gap-5">
                    <div className="w-full flex justify-between items-end">
                        <p className="font-bold text-[#FF7846]">{language() == "Tiếng Việt" ? "Danh sách sản phẩm" : "Product list"}</p>
                        <div className="w-[30%] flex gap-2">
                            <Button onClick={showcreate}>{language() == "Tiếng Việt" ? "Tạo" : "Create"}</Button>
                            <Search placeholder={language() == "Tiếng Việt" ? "Tìm kiếm sản phẩm theo tên" : "Search category by name"} onSearch={onSearch} enterButton />
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <App />
                    </div>
                </div>
            </div>
            <Modal title={language() == "Tiếng Việt" ? "Tạo sản phẩm" : "Create product"} open={showCreateModal} onOk={() => CreateProduct()} onCancel={() => setShowCreateModal(false)}>
                <p>Content</p>
            </Modal>
        </div>
    )
}

export default ProductManagement