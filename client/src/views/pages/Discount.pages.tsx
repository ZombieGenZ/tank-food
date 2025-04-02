import { JSX, useState, useEffect } from "react";
import { Table, Input, Button, Modal, InputNumber, message } from 'antd';
import type { TableProps } from 'antd';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

interface DataType {
    key: string,
    _id: string,
    code: string,
    quantity: number,
    discount: number,
    requirement: number,
    expiration_date: string | Dayjs,
    note: string[],
}

interface Voucher {
    code: string;
    created_at: string; // Hoặc Date nếu bạn muốn chuyển đổi khi sử dụng
    discount: number;
    expiration_date: string; // Hoặc Date nếu bạn muốn chuyển đổi khi sử dụng
    quantity: number;
    requirement: number;
    updated_at: string; // Hoặc Date nếu bạn muốn chuyển đổi khi sử dụng
    used: number | null; // Giả sử used là số lượng voucher đã sử dụng, nếu null có thể chưa có dữ liệu
    _id: string;
}

const DiscountCodeManagement = (): JSX.Element => {
    const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
    const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));
    const [voucher, setVoucher] = useState<Voucher[]>([])
    const [messageApi, contextHolder] = message.useMessage();
    const [data, setData] = useState<DataType[]>([]);
    const [selectEditCode, setSelectEditCode] = useState<string>("");
    const [showCreateCode, setShowCreateCode] = useState<boolean>(false);
    const [showUpdateCode, setShowUpdateCode] = useState<boolean>(false);
    const [showDeleteCode, setShowDeleteCode] = useState<boolean>(false);
    const [selectCode, setSelectCode] = useState<DataType|null>(null);
    const [selectDeleteCode, setSelectDeleteCode] = useState<string | null>(null);

    const [code, setCode] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const [discount, setDiscount] = useState<number>(5000);
    const [requirement, setRequirement] = useState<number>(0);
    const [expiration_date, setExpirationDate] = useState<Dayjs|null>(null);

    const [codeEdit, setCodeEdit] = useState<string>("");
    const [quantityEdit, setQuantityEdit] = useState<number>(1);
    const [discountEdit, setDiscountEdit] = useState<number>(5000);
    const [requirementEdit, setRequirementEdit] = useState<number>(0);
    const [expiration_dateEdit, setExpirationDateEdit] = useState<Dayjs|null>(null);

    const showCreateModal = () => {
        setShowCreateCode(true)
    }

    const handlechangQuantity = (value: number|null) => {
        if(value == null) return;
        setQuantity(value)
    }

    const handlechangDiscount = (value: number|null) => {
        if(value == null) return;
        setDiscount(value)
    }

    const handlechangRequirement = (value: number|null) => {
        if(value == null) return;
        setRequirement(value)
    }

    const handlechangQuantityEdit = (value: number|null) => {
        if(value == null) return;
        setQuantityEdit(value)
    }

    const handlechangDiscountEdit = (value: number|null) => {
        if(value == null) return;
        setDiscountEdit(value)
    }

    const handlechangRequirementEdit = (value: number|null) => {
        if(value == null) return;
        setRequirementEdit(value)
    }

    const handleDateChangeDateEdit = (date: Dayjs | null) => {
        if (!date) {
            setExpirationDateEdit(null);
            return;
        }
        setExpirationDateEdit(date);
        console.log("ISO String:", date.toISOString()); // Chuyển đổi sang ISO
    };

    const handleDateChangeDateCreate = (date: Dayjs | null) => {
        if (!date) {
            setExpirationDate(null);
            return;
        }
        setExpirationDate(date);
        console.log("ISO String:", date.toISOString()); // Chuyển đổi sang ISO
    };

    const showEditModal = (record: DataType) => {
        setShowUpdateCode(true)
        setSelectEditCode(record._id)
        setSelectCode(record)
    }

    const showDeleteModal = (id: string) => {
        setShowDeleteCode(true)
        setSelectDeleteCode(id)
    }

    const CreateCode = () => {
        const body = {
            language: null,
            code: code,
            quantity: quantity,
            discount: discount,
            requirement: requirement,
            expiration_date: expiration_date?.toISOString(),
            refresh_token: refresh_token,
        }
        fetch(`${import.meta.env.VITE_API_URL}/api/voucher-public/create`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(body)
        }).then((response) => {
            return response.json()
        }).then((data) => {
            console.log(data)
            if(data.code == "CREATE_VOUCHER_SUCCESSFUL") {
                messageApi.success(data.message)
                setShowCreateCode(false)
                const body = {
                    language: null,
                    refresh_token: refresh_token,
                }
                fetch(`${import.meta.env.VITE_API_URL}/api/voucher-public/get-voucher`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${access_token}`,
                    },
                    body: JSON.stringify(body)
                }).then((response) => {
                    return response.json()
                }).then((data) => {
                    setVoucher(data.voucher)
                    console.log(data)
                })
            } else {
                messageApi.error(data.message)
                return
            }
        })
    }

    const UpdateCode = (id: string) => {
        const body = {
            language: null,
            refresh_token: refresh_token,
            voucher_id: id,
            code: codeEdit,
            quantity: quantityEdit,
            discount: discountEdit,
            requirement: requirementEdit,
            expiration_date: expiration_dateEdit ? expiration_dateEdit.toISOString() : null,
        }

        fetch(`${import.meta.env.VITE_API_URL}/api/voucher-public/update`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(body)
        }).then(response => {
            return response.json()
        }).then((data) => {
            console.log(data)
            if(data.code == "UPDATE_VOUCHER_SUCCESSFUL") {
                messageApi.success(data.message)
                setShowUpdateCode(false)
                const body = {
                    language: null,
                    refresh_token: refresh_token,
                }
                fetch(`${import.meta.env.VITE_API_URL}/api/voucher-public/get-voucher`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${access_token}`,
                    },
                    body: JSON.stringify(body)
                }).then((response) => {
                    return response.json()
                }).then((data) => {
                    setVoucher(data.voucher)
                    console.log(data)
                })
            } else {
                messageApi.error(data.message)
                return;
            }
        })
    }
    
    const DeleteCode = (id: string) => { 
        const body = {
            language: null,
            refresh_token: refresh_token,
            voucher_id: id,
        }

        fetch(`${import.meta.env.VITE_API_URL}/api/voucher-public/delete`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(body)
        }).then(response => {
            return response.json()
        }).then((data) => {
            console.log(data)
            if(data.code == "DELETE_VOUCHER_SUCCESSFUL") {
                messageApi.success(data.message)
                setShowUpdateCode(false)
                const body = {
                    language: null,
                    refresh_token: refresh_token,
                }
                fetch(`${import.meta.env.VITE_API_URL}/api/voucher-public/get-voucher`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${access_token}`,
                    },
                    body: JSON.stringify(body)
                }).then((response) => {
                    return response.json()
                }).then((data) => {
                    setVoucher(data.voucher)
                    console.log(data)
                })
            } else {
                messageApi.error(data.message)
                return;
            }
        })
    }

    const PickDate: React.FC = () => <DatePicker readOnly value={expiration_date} placeholder={language() == "Tiếng Việt" ? "Vui lòng chọn ngày" : "Please choose the date"} onChange={handleDateChangeDateCreate} needConfirm />;
    const PickDateEdit: React.FC = () => <DatePicker readOnly value={expiration_dateEdit} placeholder={language() == "Tiếng Việt" ? "Vui lòng chọn ngày" : "Please choose the date"} onChange={handleDateChangeDateEdit} needConfirm />;

    const language = (): string => {
        const Language = localStorage.getItem('language')
        return Language ? JSON.parse(Language) : "Tiếng Việt"
    }

    useEffect(() => {
        setCodeEdit(selectCode ? selectCode?.code : "")
        setQuantityEdit(selectCode ? selectCode.quantity : 0)
        setRequirementEdit(selectCode ? selectCode.requirement : 0)
        setDiscountEdit(selectCode ? selectCode.discount : 0)
        setExpirationDateEdit(selectCode ? dayjs(selectCode.expiration_date) : null)
    }, [selectCode])

    useEffect(() => {
        const body = {
            language: null,
            refresh_token: refresh_token,
        }
        fetch(`${import.meta.env.VITE_API_URL}/api/voucher-public/get-voucher`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(body)
        }).then((response) => {
            return response.json()
        }).then((data) => {
            setVoucher(data.voucher)
            console.log(data)
        })
    }, [refresh_token, access_token])

    useEffect(() => {
        const newData: DataType[] = voucher.map((voucherV, index) =>
             {
                return ({
                key: String(index + 1),
                _id: voucherV._id,
                code: voucherV.code,
                quantity: voucherV.quantity,
                discount: voucherV.discount,
                requirement: voucherV.requirement,
                expiration_date: voucherV.expiration_date,
                note: ["Chỉnh sửa"]
        })})

        setData(newData)
    }, [voucher])

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

      function formatCurrency(amount: number, currencyCode = 'vi-VN', currency = 'VND') {
        const formatter = new Intl.NumberFormat(currencyCode, {
          style: 'currency',
          currency: currency,
        });
        return formatter.format(amount);
      }

      function formatDateFromISO(isoDateString: string): string {
        const date = new Date(isoDateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
    const columns: TableProps<DataType>['columns'] = [
            {
              title: 'Mã giảm giá',
              dataIndex: 'code',
              key: 'code',
              width: 350,
              render: (text) => <p className="font-bold">{text}</p>,
            },
            {
                title: 'Số lượng mã giảm giá',
                dataIndex: 'quantity',
                width: 350,
                key: 'quantity',
            },
            {
              title: 'Phần trăm được giảm',
              dataIndex: 'discount',
              width: 350,
              key: 'discount',
              render: (text) => <p>{text}%</p>
            },
            {
                title: 'Yêu cầu tối thiểu đơn hàng từ',
                key: 'requirement',
                dataIndex: 'requirement',
                width: 350,
                render: (text) => <p>{formatCurrency(text)}</p>
            },
            {
              title: 'Thời gian hết hạn',
              key: 'expiration_date',
              dataIndex: 'expiration_date',
              width: 350,
              render: (text) => <p>{formatDateFromISO(text)}</p>
            },
            {
                title: '',
                key: 'note',
                width: 350,
                render: (_text, record) => {
                    return (
                      <div className="flex gap-2">
                        <Button style={{ background:"blue", color:"white" }} onClick={() => showEditModal(record)}>{language() == "Tiếng Việt" ? "Chỉnh sửa" : "Edit"}</Button>
                        <Button style={{ background:"red", color:"white" }} onClick={() => showDeleteModal(record._id)}>{language() == "Tiếng Việt" ? "Xoá" : "Delete"}</Button>
                      </div>
                    )
                },
              },
          ];
    
          const App: React.FC = () => <Table<DataType> className="w-full" columns={columns} dataSource={data} />;
    return(
        <div className=" p-10">
            {contextHolder}
            <div className="w-full flex justify-center flex-col gap-10 items-center">
                <div className="w-full flex justify-center flex-col items-center gap-5">
                    <div className="w-full flex justify-between items-end">
                        <Button onClick={() => showCreateModal()}>{language() == "Tiếng Việt" ? "Tạo mã giảm giá" : "Create"}</Button>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <App />
                    </div>
                </div>
            </div>
            <Modal title={language() == "Tiếng Việt" ? "Tạo mã giảm giá" : "Create discount code"} open={showCreateCode} okText={language() == "Tiếng Việt" ? "Tạo mã" : "Create"} onOk={CreateCode} onCancel={() => setShowCreateCode(false)}>
                <div className="w-full flex flex-col gap-3">
                    <div className="flex gap-2 flex-col">
                        <p>{language() == "Tiếng Việt" ? "Nhập mã giảm giá:" : "Enter namecode:"}</p>
                        <Input placeholder={language() == "Tiếng Việt" ? "Tên mã giảm giá" : "Discount code name"} value={code} onChange={(e) => setCode(e.target.value)}/>
                    </div>
                    <div className="flex gap-2 justify-between">
                        <div className="flex gap-2 flex-col">
                            <p className="text-sm">{language() == "Tiếng Việt" ? "Số lượng mã giảm giá:" : "Enter quantity of code:"}</p>
                            <InputNumber min={1} placeholder="Tối thiểu 1 voucher" className="w-full" value={quantity} onChange={handlechangQuantity}/>
                        </div>
                        <div className="flex gap-2 flex-col">
                            <p className="text-sm">{language() == "Tiếng Việt" ? "Phần trăm giảm giá:" : "Enter discount:"}</p>
                            <InputNumber min={0} max={100} placeholder="Tối thiểu giảm 5.000 VNĐ" className="w-full" value={discount} onChange={handlechangDiscount}/>
                        </div>
                        <div className="flex gap-2 flex-col">
                            <p className="text-sm">{language() == "Tiếng Việt" ? "Yêu cầu đơn hàng tối thiểu từ:" : "Minimum order requirement from:"}</p>
                            <InputNumber min={0} className="w-full" value={requirement} onChange={handlechangRequirement}/>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-col">
                        <p>{language() == "Tiếng Việt" ? "Thời hạn mã giảm giá mới:" : "expiration date:"}</p>
                        <PickDate />
                    </div>
                </div>
            </Modal>
            <Modal title={language() == "Tiếng Việt" ? "Cập nhật mã giảm giá" : "Update discount code"} open={showUpdateCode} onOk={() => UpdateCode(selectEditCode ? selectEditCode : "")} onCancel={() => setShowUpdateCode(false)}>
                {selectEditCode && (
                <div className="w-full flex flex-col gap-3">
                    <div className="flex gap-2 flex-col">
                        <p>{language() == "Tiếng Việt" ? "Nhập mã giảm giá:" : "Enter namecode:"}</p>
                        <Input placeholder={language() == "Tiếng Việt" ? "Tên mã giảm giá" : "Discount code name"} value={codeEdit} onChange={(e) => setCodeEdit(e.target.value)}/>
                    </div>
                    <div className="flex gap-2 justify-between">
                        <div className="flex gap-2 flex-col">
                            <p className="text-sm">{language() == "Tiếng Việt" ? "Số lượng mã giảm giá:" : "Enter quantity of code:"}</p>
                            <InputNumber min={1} placeholder="Tối thiểu 1 voucher" className="w-full" value={quantityEdit} onChange={handlechangQuantityEdit}/>
                        </div>
                        <div className="flex gap-2 flex-col">
                            <p className="text-sm">{language() == "Tiếng Việt" ? "Phần trăm giảm giá:" : "Enter discount:"}</p>
                            <InputNumber min={0} max={100} placeholder="Tối thiểu giảm 5.000 VNĐ" className="w-full" value={discountEdit} onChange={handlechangDiscountEdit}/>
                        </div>
                        <div className="flex gap-2 flex-col">
                            <p className="text-sm">{language() == "Tiếng Việt" ? "Yêu cầu đơn hàng tối thiểu từ:" : "Minimum order requirement from:"}</p>
                            <InputNumber min={0} className="w-full" value={requirementEdit} onChange={handlechangRequirementEdit}/>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-col">
                        <p>{language() == "Tiếng Việt" ? "Thời hạn mã giảm giá mới:" : "expiration date:"}</p>
                        <PickDateEdit />
                    </div>
                </div>
                )}
            </Modal>
            <Modal title={language() == "Tiếng Việt" ? "Xoá mã giảm giá" : "Delete discount code"} open={showDeleteCode} onOk={() => DeleteCode(selectDeleteCode ? selectDeleteCode : "")} onCancel={() => setShowDeleteCode(false)}>

            </Modal>
        </div>
    )
}

export default DiscountCodeManagement;