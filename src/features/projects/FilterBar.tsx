import React, { useState } from 'react'
import { FilterOutlined } from '@ant-design/icons'
import { Checkbox, Input, Popover, Tag } from 'antd'
import { projectTags } from '~/app/config'
import { CheckboxValueType } from 'antd/es/checkbox/Group'
import useProjectStore from '~/stores/ProjectStore'

const FilterBar = () => {
  const [projects, setFilterdProject] = useProjectStore(state => [
    state.projects,
    state.setFilterdProject
  ])
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const onChange = (checkedValues: CheckboxValueType[]) => {
    setSelectedTags(checkedValues as string[])

    if (checkedValues.length === 0) {
      setFilterdProject(Array.from(projects.values()))
      return
    }

    const tags = checkedValues as string[]
    const filteredProjects = Array.from(projects.values()).filter(each =>
      tags.some(tag => each.tags.includes(tag))
    )

    setFilterdProject(filteredProjects)
  }

  return (
    <div className="mb-2 flex justify-start items-center gap-2">
      <Popover
        placement="bottomLeft"
        trigger="click"
        arrow={false}
        content={
          <div className="min-w-[10rem] max-w-[10rem] overflow-hidden flex flex-col justify-start items-start gap-1">
            <Input placeholder="Enter tag name..." autoComplete="off" />

            <Checkbox.Group
              options={Array.from(Object.keys(projectTags), each => ({
                value: each,
                label: each
              }))}
              onChange={onChange}
            />
          </div>
        }
      >
        <button
          className={`flex justify-center items-center gap-2 px-3 py-1 shadow-sm rounded-md hover:shadow-md transition-shadow bg-bgDefault font-medium`}
        >
          <FilterOutlined />
          <span>Filter</span>
        </button>
      </Popover>

      <div className="flex justify-start items-center">
        {selectedTags.map((tag, index) => (
          <Tag key={`project-tag-${index}`} color={projectTags[tag].color}>
            {tag}
          </Tag>
        ))}
      </div>
    </div>
  )
}

export default FilterBar
