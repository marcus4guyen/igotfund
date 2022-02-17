import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { fetchProjectsFromFund } from '../redux/actions/contract'
import ProjectList from './ProjectList'

const PAGE_PER_LIMIT = 10

const Fund = () => {
  const dispatch = useDispatch()
  const { contract, projectIdentifiers } = useSelector((state) => state.near)
  const [page, setPage] = useState(1)

  useEffect(() => {
    let offset = -1

    if (page < 1) {
      setPage(1)
      offset = 0
    } else {
      offset = (page - 1) * PAGE_PER_LIMIT
    }

    dispatch(fetchProjectsFromFund({ contract, offset, PAGE_PER_LIMIT }))
  }, [page, dispatch, contract])

  return <ProjectList projectIdentifiers={projectIdentifiers} />
}

export default Fund
