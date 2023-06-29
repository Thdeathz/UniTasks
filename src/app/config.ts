export const columnTitle: {
  [key in StatusType]: {
    title: string
    bgColor: string
  }
} = {
  todo: { title: 'TO DO', bgColor: 'bg-todo' },
  inprogress: { title: 'IN PROGRESS', bgColor: 'bg-inprogress' },
  reviewing: { title: 'REVIEWING', bgColor: 'bg-reviewing' },
  completed: { title: 'COMPLETED', bgColor: 'bg-completed' },
  deleted: { title: 'DELETED', bgColor: 'bg-deleted' }
}

export const recommendedColor = [
  '#F5222D',
  '#FA8C16',
  '#FADB14',
  '#8BBB11',
  '#52C41A',
  '#13A8A8',
  '#1677FF',
  '#2F54EB',
  '#722ED1',
  '#EB2F96',
  '#F5222D4D',
  '#FA8C164D',
  '#FADB144D',
  '#8BBB114D',
  '#52C41A4D',
  '#13A8A84D',
  '#1677FF4D',
  '#2F54EB4D',
  '#722ED14D',
  '#EB2F964D'
]

export const projectTags: {
  [key: string]: {
    title: string
    color: string
  }
} = {
  '🏠Personal': { title: '🏠Personal', color: '#FFD8BF' },
  '🏢Work': { title: '🏢 Work', color: '#CCE3E5' },
  '🏫Education': { title: '🏫Education', color: '#FFDF80' },
  '📚Research': { title: '📚Research', color: '#DAC1A0' },
  '💼Client': { title: '💼Client', color: '#FFB6C1' },
  '🎓Study': { title: '🎓Study', color: '#C2F0C2' },
  '🌐Website': { title: '🌐Website', color: '#CCE1FF' },
  '📱Mobile App': { title: '📱Mobile App', color: '#FFC3A0' },
  '🖥️Software': { title: '🖥️Software', color: '#D0D0D0' },
  '🎥Media': { title: '🎥Media', color: '#FFCCE5' }
}
