import React from 'react';
import Cards from '../components/Home/cards';

const CompletedTask = () => {
    return (
        <div>
            <Cards home="true" fetchCompleted={"CompletedTasks"} />
        </div>
    );
};

export default CompletedTask;
