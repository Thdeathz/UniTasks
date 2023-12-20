import { SearchOutlined } from '@ant-design/icons'
import React from 'react'
import useProjectStore from '~/stores/ProjectStore'

const SearchBar = () => {
  const [setSearchProjectValue] = useProjectStore(state => [state.setSearchProjectValue])

  const handleSearch = (value: string) => {
    if (value.trim().length === 0) {
      setSearchProjectValue('')
      return
    }

    setSearchProjectValue(value)
  }

  return (
    <div className="flex justify-center items-center px-3 py-1 gap-1 border border-disabled rounded-full bg-bgDefault1">
      <SearchOutlined className="text-textHover" />
      <input
        className="grow outline-none text-base bg-none"
        placeholder="Search something..."
        onChange={e => handleSearch(e.target.value)}
      />
    </div>
  )
}

export default SearchBar
