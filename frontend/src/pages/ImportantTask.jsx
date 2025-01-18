import React from 'react';
import Cards from '../components/Home/cards'

const ImportantTask = () => {
  return (
    <div>
            <Cards home="true" fetchCompleted={"ImportantTasks"} />
        </div>
  )
}

export default ImportantTask