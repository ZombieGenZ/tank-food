import { JSX, useEffect, useState } from "react";
import { Table, Input, Button, Modal, InputNumber, Select, message, Upload ,Image } from 'antd';
import type { TableProps, GetProps } from 'antd';
import { UploadOutlined } from "@ant-design/icons";
import Verify from "../components/VerifyToken.components";

interface DropdownType {
  value: string;
  label: string;
}

// interface Products {
//   title: string;
//   description: string;
//   price: number;
//   availability: boolean;
//   category_id: string;
//   tag?: string;
//   discount: number,
//   previewImage: File;
// }

interface DataType {
  key: string;
  preview: {
    url: string;
  }
  _id: string;
  title: string;
  category: string;
  availability: boolean;
  category_id: string;
  description: string;
  price: string;
  discount: string,
  tags?: string;
  note: string[];
  previewImage?: File;
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
  discount: number,
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
  const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
  const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));
  const [product, setProduct] = useState<Product[]>([]);
  const [data, setData] = useState<DataType[]>([]);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [messageApi, contextHolder] = message.useMessage();
  const [Category, setCategory] = useState<Category[]>([]);
  const [categorymenu, setCategoryMenu] = useState<DropdownType[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectRcordid, setSelectRecordId] = useState<string>("")
  const [selectProduct, setSelectProduct] = useState<DataType | null>(null)
  const language = (): string => {
    const Language = localStorage.getItem('language')
    return Language ? JSON.parse(Language) : "Tiếng Việt"
  }

  useEffect(() => {
    const handleStorageChange = () => {
      setRefreshToken(localStorage.getItem("refresh_token"));
      setAccessToken(localStorage.getItem("access_token"));
    };
  
    window.addEventListener("storage", handleStorageChange);
  
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [price, setPrice] = useState<number>(0)
  const [availability, setAvailability] = useState<boolean>(false)
  const [discount, setDiscount] = useState<number>(0)
  const [category, setNewCategory] = useState<string>("Đồ ăn nhanh")
  const [tag, setTag] = useState<string>("")

  const [titleEdit, setTitleEdit] = useState<string>(selectProduct?.title || "")
  const [descriptionEdit, setDescriptionEdit] = useState<string>(selectProduct?.description || "")
  const [priceEdit, setPriceEdit] = useState<string>(selectProduct ? selectProduct.price : "0")
  const [availabilityEdit, setAvailabilityEdit] = useState<boolean>(selectProduct?.availability || false)
  const [discountEdit, setDiscountEdit] = useState<string>(selectProduct ? selectProduct.discount : "0")
  const [categoryEdit, setNewCategoryEdit] = useState<string>("Đồ ăn nhanh")
  const [tagEdit, setTagEdit] = useState<string>(selectProduct?.tags || "")
  const [imageEdit, setImageEdit] = useState<File | null>(null);
  const [isImageChanged, setIsImageChanged] = useState<boolean>(false);
  const [imageUrlEdit, setImageUrlEdit] = useState<string | null>(selectProduct?.preview.url || null);

  useEffect(() => { setIsImageChanged(isImageChanged) }, [isImageChanged])

  const handleChangePrice = (e: number|null) => {
    if(e == null) return;
    setPrice(e);
  }

  const handleChangePriceEdit = (e: string|null) => {
    if(e == null) return;
    setPriceEdit(e);
  }

  const handleChangeDiscount = (e: number|null) => {
    if(e == null) return;
    setDiscount(e);
  }

  const handleChangeDiscountEdit = (e: string|null) => {
    if(e == null) return;
    setDiscountEdit(e);
  }

  const beforeUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      message.error("Chỉ được chọn ảnh!");
      return Upload.LIST_IGNORE;
    }
    setImage(file);
    const imageUrl = URL.createObjectURL(file);
    setImageUrl(imageUrl);

    console.log(file)

    return false;
  };

  const beforeUploadEdit = (file: File) => {
    if (!file.type.startsWith("image/")) {
      message.error("Chỉ được chọn ảnh!");
      return Upload.LIST_IGNORE;
    }
    setImageEdit(file);
    const imageUrl = URL.createObjectURL(file);
    setImageUrlEdit(imageUrl);

    setIsImageChanged(true);

    return false;
  };

  const showcreate = () => { 
    setShowCreateModal(true)
  }

  const CreateProduct = () => {

    if (!image) {
      messageApi.error("Vui lòng chọn ảnh trước khi tạo sản phẩm");
      return;
    }

    console.log("Gửi ảnh lên server:", image);

    const formData = new FormData();
    formData.append("language", String(null));
    formData.append("refresh_token", String(refresh_token));
    formData.append("preview", image); 
    formData.append("title", title);
    formData.append("discount", String(discount));
    formData.append("description", description);
    formData.append("price", String(price));
    formData.append("availability", String(availability));
    formData.append("category_id", category);
    formData.append("tag", tag);

    fetch(`${import.meta.env.VITE_API_URL}/api/products/create`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      body: formData
    }).then((response) => { return response.json() }).then((data) => {
      console.log(data)
      if (data.code == "CREATE_PRODUCT_SUCCESSFUL") {
        messageApi.success(data.message)
        setTitle("")
        setDescription("")
        setPrice(0)
        setDiscount(0)
        setAvailability(false)
        setShowCreateModal(false)
        setNewCategory("Đồ ăn nhanh")
        setTag("")
        setImageUrl(null)
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
      } else {
        messageApi.error(data.message)
        return;
      }
     })
  }

  useEffect(() => {
    setTitleEdit(selectProduct?.title || "");
    setDescriptionEdit(selectProduct?.description || "");
    setPriceEdit(selectProduct?.price || "0");
    setAvailabilityEdit(selectProduct?.availability || false);
    setNewCategoryEdit(selectProduct?.category_id || "");
    setTagEdit(selectProduct?.tags || "");
    setImageUrlEdit(selectProduct?.preview?.url || null);
    setDiscountEdit(selectProduct?.discount || "0")
  }, [selectProduct])

  const showEditModalFunc = (record: DataType) => {
    setSelectProduct(record)
    setShowEditModal(true)
    setIsImageChanged(false); 
  }

  const EditProduct = (id: string) => {
    const checkToken = async () => {
      const isValid = await Verify(refresh_token, access_token);
      console.log(isValid)
      if (isValid) {
        const body = {
          language: null,
          refresh_token: refresh_token,
          product_id: id,
          title: titleEdit,
          description: descriptionEdit,
          price: Number(priceEdit),
          availability: availabilityEdit,
          category_id: categoryEdit,
          tag: tagEdit,
          discount: Number(discountEdit),
        }
    
        const formData = new FormData();
        formData.append("language", String(null));
        formData.append("refresh_token", String(refresh_token));
        formData.append("product_id", id);
        formData.append("title", titleEdit);
        formData.append("discount", discountEdit);
        formData.append("description", descriptionEdit);
        formData.append("price", priceEdit);
        formData.append("availability", String(availabilityEdit));
        formData.append("category_id", categoryEdit);
        formData.append("tag", tagEdit);
        if (isImageChanged && imageEdit) {
          formData.append("preview", imageEdit);
        }
    
        if(isImageChanged == true) {
          fetch(`${import.meta.env.VITE_API_URL}/api/products/update-change-image`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
            body: formData
          }).then((response) => { return response.json() }).then((data) => {
            console.log(data)
            if(data.code == "UPDATE_PRODUCT_SUCCESSFUL") {
              messageApi.success(data.message)
              setShowEditModal(false)
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
            }
          })
        } else {
          fetch(`${import.meta.env.VITE_API_URL}/api/products/update`, {
            method: 'PUT',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(body)
          })
          .then((response) => { return response.json() }).then((data) => {
            console.log(data)
            if(data.code == "UPDATE_PRODUCT_SUCCESSFUL") {
              messageApi.success(data.message)
              setShowEditModal(false)
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
            } else {
              messageApi.error(data.message)
              return;
            }
          })
        }
      } else {
          console.log("Token không hợp lệ!");
      }
    };
    
    checkToken();
  }

  const SetshowDeleteModal = () => {
    setShowDeleteModal(false)
  }

  const showDeleteModalFunc = (id: string) => {
    setSelectRecordId(id)
    setShowDeleteModal(true)
  }

  const DeleteProduct = (id: string) => {
    const body = {
      language: null,
      refresh_token: refresh_token,
      product_id: id
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/products/delete`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then((response) => { return response.json() }).then((data) => {
      console.log(data)
      if (data.code == "DELETE_PRODUCT_SUCCESSFUL") {
        messageApi.success(data.message)
        setShowDeleteModal(false)
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
      }
    })
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
        console.log(data)
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
        preview: {
          url: product.preview.url,
        },
        _id: product._id,
        availability: product.availability,
        title: language() == "Tiếng Việt" ? product.title_translate_1 : product.title_translate_2,
        category: product.categories == null ? "không có danh mục" : (language() == "Tiếng Việt" ? product.categories.category_name_translate_1 : product.categories.category_name_translate_2),
        category_id: product.categories == null ? "không có danh mục" : product.categories._id,
        description: language() == "Tiếng Việt" ? product.description_translate_1 : product.description_translate_2,
        price: String(product.price), // Đảm bảo kiểu number
        discount: String(product.discount),
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
          title: 'Giảm giá',
          key: 'discount',
          dataIndex: 'discount',
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
              <Button style={{ background:"blue", color:"white" }} onClick={() => showEditModalFunc(record)}>{language() == "Tiếng Việt" ? "Chỉnh sửa" : "Edit"}</Button>
              <Button style={{ background:"red", color:"white" }} onClick={() => showDeleteModalFunc(record._id)}>{language() == "Tiếng Việt" ? "Xoá" : "Delete"}</Button>
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
                <div className=" flex gap-2 flex-col">
                    <p>{language() == "Tiếng Việt" ? "Giảm giá:" : "Discount:"}</p>
                    <div>
                        <InputNumber placeholder="VNĐ" value={discount} onChange={handleChangeDiscount}/>
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
                  <Upload
                    accept="image/*"
                    beforeUpload={beforeUpload}
                    maxCount={1} // Chỉ cho phép chọn 1 ảnh
                    showUploadList={false} // Không hiển thị danh sách upload
                  >
                    <button>
                      <UploadOutlined /> Chọn ảnh
                    </button>
                  </Upload>
                  {imageUrl && <Image src={imageUrl} alt="Uploaded Image" />}
              </div>
            </div>
          </Modal>
          <Modal title={language() == "Tiếng Việt" ? "Sửa sản phẩm" : "product repair"} open={showEditModal} okText={language() == "Tiếng Việt" ? "Cập nhật sản phẩm" : "Update product"} onOk={() => EditProduct(selectProduct ? selectProduct?._id : "")} onCancel={() => setShowEditModal(false)}>
            {selectProduct && (
              <div className="w-full flex flex-col gap-3">
              <div className="flex gap-2 flex-col">
                  <p>{language() == "Tiếng Việt" ? "Tên sản phẩm:" : "Product name:"}</p>
                  <Input value={titleEdit} onChange={(e) => setTitleEdit(e.target.value)}/>
              </div>
              <div className="flex gap-2 flex-col">
                  <p>{language() == "Tiếng Việt" ? "Mô tả:" : "Description:"}</p>
                  <Input value={descriptionEdit} onChange={(e) => setDescriptionEdit(e.target.value)}/>
              </div>
              <div className="flex gap-2">
                <div className=" flex gap-2 flex-col">
                    <p>{language() == "Tiếng Việt" ? "Giá tiền:" : "Price:"}</p>
                    <div>
                        <InputNumber placeholder="VNĐ" value={priceEdit} onChange={handleChangePriceEdit}/>
                    </div>
                </div>
                <div className=" flex gap-2 flex-col">
                    <p>{language() == "Tiếng Việt" ? "Giảm giá:" : "Discount:"}</p>
                    <div>
                        <InputNumber max={String(100)} placeholder="VNĐ" value={discountEdit} onChange={handleChangeDiscountEdit}/>
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
                    value={categoryEdit}
                    onChange={(value) => setNewCategoryEdit(value)}
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
                    value={availabilityEdit}
                    onChange={(value) => setAvailabilityEdit(value)}
                />
              </div>
              <div className="flex gap-2 flex-col">
                  <p>{language() == "Tiếng Việt" ? "Tags:" : "Tags:"}</p>
                  <Input value={tagEdit} onChange={(e) => setTagEdit(e.target.value)}/>
              </div>
              <div className="flex gap-2 flex-col">
                  <p>{language() == "Tiếng Việt" ? "ẢNh hiển thị sản phẩm:" : "Images:"}</p>
                  <Upload
                    accept="image/*"
                    beforeUpload={beforeUploadEdit}
                    maxCount={1} // Chỉ cho phép chọn 1 ảnh
                    showUploadList={false} // Không hiển thị danh sách upload
                  >
                    <button>
                      <UploadOutlined /> Chọn ảnh
                    </button>
                  </Upload>
                  {imageUrlEdit && <Image src={imageUrlEdit} alt="Uploaded Image" />}
              </div>
            </div>
            )}
          </Modal>
          <Modal okText={language() == "Tiếng Việt" ? "Xác nhận xoá" : "Delete confirm"} onOk={() => DeleteProduct(selectRcordid)} onCancel={() => SetshowDeleteModal()} open={showDeleteModal} title={language() == "Tiếng Việt" ? "Xoá sản phẩm" : "Delete product"}>
            <p>Bạn có chắc chắn muốn xoá sản phẩm này không?</p>
          </Modal>
        </div>
    )
}

export default ProductManagement