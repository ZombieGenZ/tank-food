import { JSX } from "react";

const Category = (): JSX.Element => {
    const body = {
        language: null,
    }
    fetch('http://localhost:3000/api/products/get-product', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
    }).then((response) => {
        return response.json()
    }).then(data => {
        console.log(data)
    })
    return(
        <div>

        </div>
    )
}

export default Category