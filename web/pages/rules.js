import { useSelector } from 'react-redux'

const RulesPage = () => {
  const { currentUser } = useSelector((state) => state.near)

  if (currentUser) {
    window.location.replace(window.location.origin)
    return
  }

  return <></>
}

export default RulesPage
