import { JSX, useEffect, useState } from "react";
import { Table, Input, Button, Modal, InputNumber } from 'antd';
import type { TableProps, GetProps } from 'antd';

interface DataType {
    key: string;
    category: string;
    priority: number;
    note: string[],
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


const CategoryManagement = (): JSX.Element => {
  const [category, setCategory] = useState<Category[]>([])
  const [dataView, setData] = useState<DataType[]>([])
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const language = (): string => {
    const Language = localStorage.getItem('language')
    return Language ? JSON.parse(Language) : "Tiếng Việt"
  }

  const showcreate = () => { 
    setShowCreateModal(true)
  }

  useEffect(() => {
    const body = {
      language: null,
    } 
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
      console.log(data)
    })
  }, [])

  useEffect(() => {
    const newData = category.map((categoryV, index) => ({
      key: String(index + 1),
      category: language() == "Tiếng Việt" ? categoryV.category_name_translate_1 : categoryV.category_name_translate_1,
      priority: categoryV.index,
      note: ["Chỉnh sửa"]
    }))

    setData(newData);
  }, [category])

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 350,
      render: (text) => <p className="font-bold">{text}</p>,
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priority',
      width: 350,
      key: 'priority',
    },
    {
      title: '',
      key: 'note',
      width: 350,
      render: (_, { note }) => (
        <>
          {note.map((noteitem) => {
            return (
              <Button key={noteitem}>
                {noteitem}
              </Button>
            );
          })}
        </>
      ),
    },
  ];

  const App: React.FC = () => <Table<DataType> className="w-full" columns={columns} dataSource={dataView} pagination={{ pageSize: 5 }} />; 
    type SearchProps = GetProps<typeof Input.Search>;
    
        const { Search } = Input;
    
        const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);
    return(
        <div className="p-10">   
            <div className="w-full flex justify-center flex-col gap-10 items-center">
                <div className="w-full flex justify-center flex-col items-cente gap-5">
                    <div className="w-full flex justify-between items-end">
                        <p className="font-bold text-[#FF7846]">{language() == "Tiếng Việt" ? "Danh sách danh mục" : "Category list"}</p>
                        <div className="w-[30%] flex gap-2">
                            <Button onClick={showcreate}>{language() == "Tiếng Việt" ? "Tạo" : "Create"}</Button>
                            <Search placeholder={language() == "Tiếng Việt" ? "Tìm kiếm danh mục theo tên" : "Search category by name"} onSearch={onSearch} enterButton />
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <App />
                    </div>
                </div>
            </div>
            <Modal title={language() == "Tiếng Việt" ? "Tạo danh mục" : "Create category"} visible={showCreateModal} okText="Tạo danh mục" onOk={() => setShowCreateModal(false)} onCancel={() => setShowCreateModal(false)}>
              <div className="w-full flex flex-col gap-5">
                <div className="flex gap-3 flex-col">
                    <p>Tên danh mục:</p>
                    <Input />
                </div>
                <div className="flex gap-3 flex-col">
                  <p>Độ ưu tiên:</p>
                  <div className="flex gap-3">
                    <InputNumber
                      min={1}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </Modal>
        </div>
    )
}

export default CategoryManagement;