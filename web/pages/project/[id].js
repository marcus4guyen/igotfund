import { useRouter } from 'next/router'
import ProjectDetail from '../../components/ProjectDetail'

const ProjectDetailPage = () => {
  const router = useRouter()
  const projectId = router.query.id

  return <ProjectDetail identifier={projectId} />
}

export default ProjectDetailPage
