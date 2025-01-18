import React from 'react'
import Cards from '../components/Home/cards';

const IncompleteTask = () => {
  return (
    <div>
    <Cards home="true" fetchCompleted={"IncompletedTasks"} />
</div>
  )
}

export default IncompleteTask