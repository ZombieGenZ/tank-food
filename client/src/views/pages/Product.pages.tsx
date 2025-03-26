import { JSX, useEffect, useState } from "react";
import { Table, Input, Button, Modal, InputNumber, Select, message, Upload ,Image } from 'antd';
import type { TableProps, GetProps } from 'antd';
import type { UploadProps } from "antd/es/upload";
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

interface DropdownType {
  value: string;
  label: string;
}

interface Product {
  title: string;
  description: string;
  price: number;
  availability: boolean;
  category_id: string;
  tag?: string;
  previewImage: File;
}

interface DataType {
  key: string;
  title: string;
  category: string;
  category_id: string;
  description: string;
  price: string;
  tags?: string;
  note: string[];
  previewImage?: File;
}

interface UploadedImage {
  uid: string;
  lastModified: number;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

interface Category {
  category_name_translate_1: string;
  category_name_translate_2: string;
  created_at: string;  // ISO date string
  index: number;
  translate_1_language: string;
  translate_2_language: string;
  updated_at: string;  // ISO date string
  _id: string;
}

interface Product {
  _id: string;
  availability: boolean;
  categories?: Category;
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
  const [messageApi, contextHolder] = message.useMessage();
  const [Category, setCategory] = useState<Category[]>([]);
  const [categorymenu, setCategoryMenu] = useState<DropdownType[]>([]);
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const language = (): string => {
    const Language = localStorage.getItem('language')
    return Language ? JSON.parse(Language) : "Tiếng Việt"
  }

  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [price, setPrice] = useState<number>(0)
  const [availability, setAvailability] = useState<boolean>(false)
  const [category, setNewCategory] = useState<string>("Đồ ăn nhanh")
  const [tag, setTag] = useState<string>("")

  const handleChangePrice = (e: number|null) => {
    if(e == null) return;
    setPrice(e);
  }

  const props: UploadProps = {
    name: 'file',
    beforeUpload(file) {
      const isImage = file;
      if (!isImage) {
        message.error('You can only upload image files!');
        return Upload.LIST_IGNORE;
      }
  
      const isLt5M = file.size / 1024 / 1024 < 1;
      if (!isLt5M) {
        message.error('Image must be smaller than 10MB!');
        return Upload.LIST_IGNORE; 
      }
  
      return true;
    },
  };

  useEffect(() => {
    const newFormData = new FormData();
    if (image) {
      newFormData.append('uid', image.uid);
      newFormData.append('lastModified', String(image.lastModified));
      newFormData.append('name', image.name);
      newFormData.append('size', String(image.size));
      newFormData.append('type', image.type);
      newFormData.append('webkitRelativePath', image.webkitRelativePath);
    }
  }, [image])

  const handleChange = (info: any) => {
    if (info.fileList.length > 0) {
      const file = info.fileList[0].originFileObj;
      setImage({
        uid: file.uid,
        lastModified: file.lastModified,
        name: file.name,
        size: file.size,
        type: file.type,
        webkitRelativePath: file.webkitRelativePath,
      });

      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const showcreate = () => { 
    setShowCreateModal(true)
  }

  const CreateProduct = () => {
    
  }

  const showEditModalFunc = () => {
    setShowEditModal(true)
  }

  const showDeleteModalFunc = () => {
    setShowDeleteModal(true)
  }

  useEffect(() => {
    const newCategory: DropdownType[] = Category.map((category) => ({
      value: category._id,
      label: language() == "Tiếng Việt" ? category.category_name_translate_1 : category.category_name_translate_2
    }))
    setCategoryMenu(newCategory)
  }, [Category])

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
        setProduct(data.products)
      })

      fetch(`${import.meta.env.VITE_API_URL}/api/categories/get-category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }).then((response) => {
        return response.json()
      }).then((data) => {
        setCategory(data.categories)
      })
  }, [])

    useEffect(() => {
      const newData: DataType[] = product.map((product, index) => ({
        key: String(index + 1),
        title: language() == "Tiếng Việt" ? product.title_translate_1 : product.title_translate_2,
        category: product.categories == null ? "không có danh mục" : (language() == "Tiếng Việt" ? product.categories.category_name_translate_1 : product.categories.category_name_translate_2),
        category_id: product.categories == null ? "không có danh mục" : product.categories._id,
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

    const App: React.FC = () => <Table<DataType> className="w-full" columns={columns} dataSource={data} pagination={{ pageSize: 25 }} />;
    type SearchProps = GetProps<typeof Input.Search>;
    
    const { Search } = Input;
    
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);
    return(
        <div className="p-10">
            {contextHolder}
            <div className="w-full flex justify-center flex-col gap-10 items-center">
                <div className="w-full flex justify-center flex-col items-cente gap-5">
                    <div className="w-full flex justify-between items-end">
                        <p className="font-bold text-[#FF7846]">{language() == "Tiếng Việt" ? "Danh sách sản phẩm" : "Product list"}</p>
                        <div className="w-[30%] flex gap-2">
                            <Button onClick={showcreate}>{language() == "Tiếng Việt" ? "Nhập sản phẩm" : "Import product"}</Button>
                            <Search placeholder={language() == "Tiếng Việt" ? "Tìm kiếm sản phẩm theo tên" : "Search category by name"} onSearch={onSearch} enterButton />
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <App />
                    </div>
                </div>
            </div>
          <Modal title={language() == "Tiếng Việt" ? "Nhập sản phẩm" : "Create product"} open={showCreateModal} okText={language() == "Tiếng Việt" ? "Nhập sản phẩm" : "Import product"} onOk={() => CreateProduct()} onCancel={() => setShowCreateModal(false)}>
            <div className="w-full flex flex-col gap-3">
              <div className="flex gap-2 flex-col">
                  <p>{language() == "Tiếng Việt" ? "Tên sản phẩm:" : "Product name:"}</p>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)}/>
              </div>
              <div className="flex gap-2 flex-col">
                  <p>{language() == "Tiếng Việt" ? "Mô tả:" : "Description:"}</p>
                  <Input value={description} onChange={(e) => setDescription(e.target.value)}/>
              </div>
              <div className="flex gap-2">
                <div className=" flex gap-2 flex-col">
                    <p>{language() == "Tiếng Việt" ? "Giá tiền:" : "Price:"}</p>
                    <div>
                        <InputNumber placeholder="VNĐ" value={price} onChange={handleChangePrice}/>
                    </div>
                </div>
                <div className="w-full flex gap-2 flex-col">
                  <p>{language() == "Tiếng Việt" ? "Danh mục:" : "Category:"}</p>
                  <div>
                  <Select
                    className="custom-select w-full"
                    popupClassName="custom-dropdown"
                    placeholder="Chọn danh mục"
                    options={categorymenu}
                    value={category}
                    onChange={(value) => setNewCategory(value)}
                  />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 flex-col">
                <p>{language() == "Tiếng Việt" ? "Sản phẩm có sẵn:" : "product available"}</p>
                <Select
                    className="custom-select w-full"
                    popupClassName="custom-dropdown"
                    placeholder="Chọn trạng thái"
                    options={[
                      { value: true , label: "Có sẵn" },
                      { value: false , label: "Không có sẵn" },
                    ]}
                    value={availability}
                    onChange={(value) => setAvailability(value)}
                />
              </div>
              <div className="flex gap-2 flex-col">
                  <p>{language() == "Tiếng Việt" ? "Tags:" : "Tags:"}</p>
                  <Input value={tag} onChange={(e) => setTag(e.target.value)}/>
              </div>
              <div className="flex gap-2 flex-col">
                  <p>{language() == "Tiếng Việt" ? "ẢNh hiển thị sản phẩm:" : "Images:"}</p>
                  <Dragger {...props} listType="picture"
                                      maxCount={1} // Chỉ cho phép chọn 1 ảnh // Chỉ hiển thị 1 file
                                      onChange={handleChange}
                                      beforeUpload={() => false}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  </Dragger>
                  {imageUrl && <Image src={imageUrl} alt="Uploaded Image" />}
              </div>
            </div>
          </Modal>
          <Modal title={language() == "Tiếng Việt" ? "Nhập sản phẩm" : "Create product"} open={showEditModal} okText={language() == "Tiếng Việt" ? "Nhập sản phẩm" : "Import product"} onOk={() => CreateProduct()} onCancel={() => setShowCreateModal(false)}>
            <div className="w-full flex flex-col gap-3">
              <div className="flex gap-2 flex-col">
                  <p>{language() == "Tiếng Việt" ? "Tên sản phẩm:" : "Product name:"}</p>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)}/>
              </div>
              <div className="flex gap-2 flex-col">
                  <p>{language() == "Tiếng Việt" ? "Mô tả:" : "Description:"}</p>
                  <Input value={description} onChange={(e) => setDescription(e.target.value)}/>
              </div>
              <div className="flex gap-2">
                <div className=" flex gap-2 flex-col">
                    <p>{language() == "Tiếng Việt" ? "Giá tiền:" : "Price:"}</p>
                    <div>
                        <InputNumber placeholder="VNĐ" value={price} onChange={handleChangePrice}/>
                    </div>
                </div>
                <div className="w-full flex gap-2 flex-col">
                  <p>{language() == "Tiếng Việt" ? "Danh mục:" : "Category:"}</p>
                  <div>
                  <Select
                    className="custom-select w-full"
                    popupClassName="custom-dropdown"
                    placeholder="Chọn danh mục"
                    options={categorymenu}
                    value={category}
                    onChange={(value) => setNewCategory(value)}
                  />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 flex-col">
                <p>{language() == "Tiếng Việt" ? "Sản phẩm có sẵn:" : "product available"}</p>
                <Select
                    className="custom-select w-full"
                    popupClassName="custom-dropdown"
                    placeholder="Chọn trạng thái"
                    options={[
                      { value: true , label: "Có sẵn" },
                      { value: false , label: "Không có sẵn" },
                    ]}
                    value={availability}
                    onChange={(value) => setAvailability(value)}
                />
              </div>
              <div className="flex gap-2 flex-col">
                  <p>{language() == "Tiếng Việt" ? "Tags:" : "Tags:"}</p>
                  <Input value={tag} onChange={(e) => setTag(e.target.value)}/>
              </div>
              <div className="flex gap-2 flex-col">
                  <p>{language() == "Tiếng Việt" ? "ẢNh hiển thị sản phẩm:" : "Images:"}</p>
                  <Dragger {...props} listType="picture"
                                      maxCount={1} // Chỉ cho phép chọn 1 ảnh // Chỉ hiển thị 1 file
                                      onChange={handleChange}
                                      beforeUpload={() => false}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  </Dragger>
                  {imageUrl && <Image src={imageUrl} alt="Uploaded Image" />}
              </div>
            </div>
          </Modal>
        </div>
    )
}

export default ProductManagement