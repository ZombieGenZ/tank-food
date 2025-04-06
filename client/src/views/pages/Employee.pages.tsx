import React from 'react';

interface Props {
    isLoading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  }

const EmployeePage: React.FC<Props> = (props) => {
    return (
        <div>
            <h1>Employee Page</h1>
            <p>Welcome to the Employee Page!</p>
        </div>
    );
};

export default EmployeePage;